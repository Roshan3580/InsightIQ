from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Dict, Any
import time
import json

from app.db.database import get_db
from app.models import Query, Dataset, User
from app.services.ai_service import AIService
from app.services.data_service import DataService
from app.schemas.query import QueryRequest, QueryResponse

router = APIRouter()

# Initialize services
ai_service = AIService()
data_service = DataService()

@router.post("/query", response_model=QueryResponse)
async def process_natural_language_query(
    request: QueryRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Process natural language query and return AI-generated insights
    """
    try:
        start_time = time.time()
        
        # For now, use a default dataset (we'll implement user selection later)
        # In a real app, you'd get the dataset from the request or user context
        dataset_result = await data_service.list_tables()
        
        if not dataset_result:
            raise HTTPException(
                status_code=400, 
                detail="No datasets available. Please upload a CSV file first."
            )
        
        # Use the first available table for now
        table_name = dataset_result[0]
        
        # Get table schema and sample data
        table_info = await data_service.get_table_info(table_name)
        
        if not table_info["success"]:
            raise HTTPException(
                status_code=500,
                detail="Failed to get table information"
            )
        
        # Convert natural language to SQL using AI
        ai_result = await ai_service.natural_language_to_sql(
            query=request.query,
            schema_info=table_info["schema"],
            sample_data=table_info["sample_data"]
        )
        
        if ai_result.get("error"):
            raise HTTPException(
                status_code=400,
                detail=f"AI processing failed: {ai_result['error']}"
            )
        
        # Execute the generated SQL
        sql_result = await data_service.execute_sql_query(
            sql=ai_result["sql"],
            table_name=table_name
        )
        
        if not sql_result["success"]:
            raise HTTPException(
                status_code=400,
                detail=f"SQL execution failed: {sql_result['error']}"
            )
        
        # Generate AI explanation of results
        explanation = await ai_service.explain_results(
            query=request.query,
            results=sql_result["data"]
        )
        
        execution_time = int((time.time() - start_time) * 1000)  # milliseconds
        
        # Create query record in database (for now, use a default user)
        # In a real app, you'd get the current user from authentication
        query_record = Query(
            natural_language_query=request.query,
            generated_sql=ai_result["sql"],
            query_type=ai_result["query_type"],
            result_data=sql_result["data"],
            visualization_type=ai_result["visualization_type"],
            execution_time=execution_time,
            status="completed",
            user_id=1,  # Default user ID
            dataset_id=1  # Default dataset ID
        )
        
        db.add(query_record)
        await db.commit()
        
        return QueryResponse(
            success=True,
            query=request.query,
            sql=ai_result["sql"],
            data=sql_result["data"],
            query_type=ai_result["query_type"],
            visualization_type=ai_result["visualization_type"],
            explanation=explanation,
            execution_time=execution_time,
            confidence=ai_result.get("confidence", 0.8)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@router.get("/query/history")
async def get_query_history(
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
):
    """
    Get recent query history
    """
    try:
        # Get recent queries
        result = await db.execute(
            select(Query).order_by(Query.created_at.desc()).limit(limit)
        )
        queries = result.scalars().all()
        
        return {
            "success": True,
            "queries": [
                {
                    "id": q.id,
                    "query": q.natural_language_query,
                    "query_type": q.query_type,
                    "visualization_type": q.visualization_type,
                    "execution_time": q.execution_time,
                    "created_at": q.created_at.isoformat(),
                    "status": q.status
                }
                for q in queries
            ]
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get query history: {str(e)}"
        )

@router.get("/query/{query_id}")
async def get_query_details(
    query_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Get details of a specific query
    """
    try:
        result = await db.execute(select(Query).where(Query.id == query_id))
        query = result.scalar_one_or_none()
        
        if not query:
            raise HTTPException(status_code=404, detail="Query not found")
        
        return {
            "success": True,
            "query": {
                "id": query.id,
                "natural_language_query": query.natural_language_query,
                "generated_sql": query.generated_sql,
                "query_type": query.query_type,
                "result_data": query.result_data,
                "visualization_type": query.visualization_type,
                "execution_time": query.execution_time,
                "status": query.status,
                "created_at": query.created_at.isoformat()
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get query details: {str(e)}"
        ) 