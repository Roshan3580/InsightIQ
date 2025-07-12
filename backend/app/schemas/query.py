from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class QueryRequest(BaseModel):
    query: str = Field(..., description="Natural language query")
    dataset_id: Optional[int] = Field(None, description="Dataset ID to query")

class QueryResponse(BaseModel):
    success: bool
    query: str
    sql: Optional[str] = None
    data: List[Dict[str, Any]] = []
    query_type: str
    visualization_type: str
    explanation: Optional[str] = None
    execution_time: int
    confidence: float = 0.8
    error: Optional[str] = None

class QueryHistoryItem(BaseModel):
    id: int
    query: str
    query_type: str
    visualization_type: str
    execution_time: int
    created_at: str
    status: str

class QueryHistoryResponse(BaseModel):
    success: bool
    queries: List[QueryHistoryItem] 