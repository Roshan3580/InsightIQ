from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import os
import shutil
from typing import Dict, Any
from pathlib import Path
import time

from app.db.database import get_db
from app.models import Dataset, User
from app.services.data_service import DataService
from app.core.config import settings

router = APIRouter()

# Initialize data service
data_service = DataService()

@router.post("/upload/csv")
async def upload_csv_file(
    file: UploadFile = File(...),
    dataset_name: str = Form(...),
    description: str = Form(""),
    db: AsyncSession = Depends(get_db)
):
    """
    Upload and process a CSV file
    """
    try:
        # Validate file type
        if not file.filename.endswith('.csv'):
            raise HTTPException(
                status_code=400,
                detail="Only CSV files are supported"
            )
        
        # Check file size
        if file.size and file.size > settings.max_file_size:
            raise HTTPException(
                status_code=400,
                detail=f"File size exceeds maximum limit of {settings.max_file_size // (1024*1024)}MB"
            )
        
        # Create unique filename
        timestamp = int(time.time())
        safe_filename = f"{timestamp}_{file.filename.replace(' ', '_')}"
        file_path = os.path.join(settings.upload_dir, safe_filename)
        
        # Save uploaded file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Process the CSV file
        result = await data_service.process_csv_upload(file_path, dataset_name)
        
        if not result["success"]:
            # Clean up file if processing failed
            os.remove(file_path)
            raise HTTPException(
                status_code=400,
                detail=f"Failed to process CSV file: {result['error']}"
            )
        
        # Create dataset record in database (for now, use default user)
        dataset_record = Dataset(
            name=dataset_name,
            description=description,
            file_path=file_path,
            file_size=file.size or 0,
            row_count=result["row_count"],
            column_count=result["column_count"],
            schema=result["schema"],
            sample_data=result["sample_data"],
            owner_id=1  # Default user ID
        )
        
        db.add(dataset_record)
        await db.commit()
        await db.refresh(dataset_record)
        
        return {
            "success": True,
            "message": "CSV file uploaded and processed successfully",
            "dataset": {
                "id": dataset_record.id,
                "name": dataset_record.name,
                "description": dataset_record.description,
                "row_count": dataset_record.row_count,
                "column_count": dataset_record.column_count,
                "schema": dataset_record.schema,
                "sample_data": dataset_record.sample_data,
                "created_at": dataset_record.created_at.isoformat()
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        # Clean up file if any error occurred
        if 'file_path' in locals() and os.path.exists(file_path):
            os.remove(file_path)
        
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload file: {str(e)}"
        )

@router.get("/datasets")
async def list_datasets(
    db: AsyncSession = Depends(get_db)
):
    """
    List all available datasets
    """
    try:
        result = await db.execute(select(Dataset).order_by(Dataset.created_at.desc()))
        datasets = result.scalars().all()
        
        return {
            "success": True,
            "datasets": [
                {
                    "id": dataset.id,
                    "name": dataset.name,
                    "description": dataset.description,
                    "row_count": dataset.row_count,
                    "column_count": dataset.column_count,
                    "created_at": dataset.created_at.isoformat()
                }
                for dataset in datasets
            ]
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to list datasets: {str(e)}"
        )

@router.get("/datasets/{dataset_id}")
async def get_dataset_details(
    dataset_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Get details of a specific dataset
    """
    try:
        result = await db.execute(select(Dataset).where(Dataset.id == dataset_id))
        dataset = result.scalar_one_or_none()
        
        if not dataset:
            raise HTTPException(status_code=404, detail="Dataset not found")
        
        return {
            "success": True,
            "dataset": {
                "id": dataset.id,
                "name": dataset.name,
                "description": dataset.description,
                "row_count": dataset.row_count,
                "column_count": dataset.column_count,
                "schema": dataset.schema,
                "sample_data": dataset.sample_data,
                "created_at": dataset.created_at.isoformat()
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get dataset details: {str(e)}"
        )

@router.delete("/datasets/{dataset_id}")
async def delete_dataset(
    dataset_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Delete a dataset and its associated file
    """
    try:
        result = await db.execute(select(Dataset).where(Dataset.id == dataset_id))
        dataset = result.scalar_one_or_none()
        
        if not dataset:
            raise HTTPException(status_code=404, detail="Dataset not found")
        
        # Delete the file
        if os.path.exists(dataset.file_path):
            os.remove(dataset.file_path)
        
        # Delete from database
        await db.delete(dataset)
        await db.commit()
        
        return {
            "success": True,
            "message": "Dataset deleted successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete dataset: {str(e)}"
        ) 