import pandas as pd
import duckdb
import os
from typing import Dict, Any, List, Optional
from pathlib import Path
import json
from app.core.config import settings

class DataService:
    def __init__(self):
        self.duckdb_path = settings.duckdb_path
        self.upload_dir = settings.upload_dir
        
        # Ensure directories exist
        os.makedirs(os.path.dirname(self.duckdb_path), exist_ok=True)
        os.makedirs(self.upload_dir, exist_ok=True)
    
    async def process_csv_upload(self, file_path: str, dataset_name: str) -> Dict[str, Any]:
        """Process uploaded CSV file and generate schema"""
        try:
            # Read CSV file
            df = pd.read_csv(file_path)
            
            # Generate schema information
            schema_info = self._generate_schema_info(df, dataset_name)
            
            # Store in DuckDB
            table_name = self._sanitize_table_name(dataset_name)
            await self._store_in_duckdb(df, table_name)
            
            # Get sample data
            sample_data = self._get_sample_data(df)
            
            return {
                "success": True,
                "schema": schema_info,
                "sample_data": sample_data,
                "row_count": len(df),
                "column_count": len(df.columns),
                "table_name": table_name
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def _generate_schema_info(self, df: pd.DataFrame, dataset_name: str) -> Dict[str, Any]:
        """Generate schema information from DataFrame"""
        columns = []
        
        for col in df.columns:
            col_info = {
                "name": col,
                "type": str(df[col].dtype),
                "description": self._infer_column_description(col, df[col]),
                "unique_values": int(df[col].nunique()),  # Convert to native Python int
                "null_count": int(df[col].isnull().sum()),  # Convert to native Python int
                "sample_values": df[col].dropna().head(3).astype(str).tolist()  # Convert to strings for JSON serialization
            }
            columns.append(col_info)
        
        return {
            "dataset_name": dataset_name,
            "columns": columns,
            "total_rows": int(len(df)),  # Convert to native Python int
            "total_columns": int(len(df.columns))  # Convert to native Python int
        }
    
    def _infer_column_description(self, column_name: str, series: pd.Series) -> str:
        """Infer column description based on name and data"""
        col_lower = column_name.lower()
        
        # Common patterns
        if any(word in col_lower for word in ['date', 'time', 'created', 'updated']):
            return "Date/time information"
        elif any(word in col_lower for word in ['id', 'key', 'pk']):
            return "Unique identifier"
        elif any(word in col_lower for word in ['name', 'title', 'label']):
            return "Descriptive name or label"
        elif any(word in col_lower for word in ['price', 'cost', 'amount', 'revenue', 'sales']):
            return "Monetary value"
        elif any(word in col_lower for word in ['count', 'number', 'quantity']):
            return "Numeric count or quantity"
        elif any(word in col_lower for word in ['email', 'mail']):
            return "Email address"
        elif any(word in col_lower for word in ['phone', 'tel']):
            return "Phone number"
        elif any(word in col_lower for word in ['status', 'state']):
            return "Status or state information"
        elif any(word in col_lower for word in ['category', 'type', 'group']):
            return "Categorization or classification"
        else:
            return "General data field"
    
    def _sanitize_table_name(self, name: str) -> str:
        """Sanitize table name for database"""
        # Remove special characters and replace spaces with underscores
        sanitized = "".join(c for c in name if c.isalnum() or c in (' ', '-', '_')).rstrip()
        sanitized = sanitized.replace(' ', '_').replace('-', '_')
        return f"dataset_{sanitized.lower()}"
    
    async def _store_in_duckdb(self, df: pd.DataFrame, table_name: str):
        """Store DataFrame in DuckDB"""
        try:
            # Connect to DuckDB
            con = duckdb.connect(self.duckdb_path)
            
            # Create table and insert data
            con.execute(f"DROP TABLE IF EXISTS {table_name}")
            con.execute(f"CREATE TABLE {table_name} AS SELECT * FROM df")
            
            con.close()
            
        except Exception as e:
            raise Exception(f"Failed to store data in DuckDB: {str(e)}")
    
    def _get_sample_data(self, df: pd.DataFrame, num_rows: int = 5) -> Dict[str, Any]:
        """Get sample data from DataFrame"""
        sample_df = df.head(num_rows)
        
        # Convert to JSON-serializable format
        rows = []
        for _, row in sample_df.iterrows():
            row_dict = {}
            for col, value in row.items():
                if pd.isna(value):
                    row_dict[col] = None
                elif isinstance(value, (int, float)):
                    row_dict[col] = float(value) if isinstance(value, float) else int(value)
                else:
                    row_dict[col] = str(value)
            rows.append(row_dict)
        
        return {
            "rows": rows,
            "columns": df.columns.tolist()
        }
    
    async def execute_sql_query(self, sql: str, table_name: str) -> Dict[str, Any]:
        """Execute SQL query on DuckDB data"""
        try:
            con = duckdb.connect(self.duckdb_path)
            
            # Execute query
            result = con.execute(sql).fetchdf()
            
            # Convert to JSON-serializable format
            data = []
            for _, row in result.iterrows():
                row_dict = {}
                for col, value in row.items():
                    if pd.isna(value):
                        row_dict[col] = None
                    elif isinstance(value, (int, float)):
                        row_dict[col] = float(value) if isinstance(value, float) else int(value)
                    else:
                        row_dict[col] = str(value)
                data.append(row_dict)
            
            con.close()
            
            return {
                "success": True,
                "data": data,
                "row_count": len(data),
                "columns": result.columns.tolist()
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "data": [],
                "row_count": 0
            }
    
    async def get_table_info(self, table_name: str) -> Dict[str, Any]:
        """Get information about a table"""
        try:
            con = duckdb.connect(self.duckdb_path)
            
            # Get table schema
            schema = con.execute(f"DESCRIBE {table_name}").fetchdf()
            
            # Get row count
            count = con.execute(f"SELECT COUNT(*) FROM {table_name}").fetchone()[0]
            
            # Get sample data
            sample = con.execute(f"SELECT * FROM {table_name} LIMIT 5").fetchdf()
            
            con.close()
            
            # Convert schema to JSON-serializable format
            schema_data = []
            for _, row in schema.iterrows():
                row_dict = {}
                for col, value in row.items():
                    if pd.isna(value):
                        row_dict[col] = None
                    elif isinstance(value, (int, float)):
                        row_dict[col] = float(value) if isinstance(value, float) else int(value)
                    else:
                        row_dict[col] = str(value)
                schema_data.append(row_dict)
            
            # Convert sample data to JSON-serializable format
            sample_data = []
            for _, row in sample.iterrows():
                row_dict = {}
                for col, value in row.items():
                    if pd.isna(value):
                        row_dict[col] = None
                    elif isinstance(value, (int, float)):
                        row_dict[col] = float(value) if isinstance(value, float) else int(value)
                    else:
                        row_dict[col] = str(value)
                sample_data.append(row_dict)
            
            return {
                "success": True,
                "schema": schema_data,
                "row_count": int(count),
                "sample_data": sample_data
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    async def list_tables(self) -> List[str]:
        """List all tables in DuckDB"""
        try:
            con = duckdb.connect(self.duckdb_path)
            tables = con.execute("SHOW TABLES").fetchdf()
            con.close()
            
            return tables['name'].tolist() if not tables.empty else []
            
        except Exception as e:
            return []
    
    async def delete_table(self, table_name: str) -> bool:
        """Delete a table from DuckDB"""
        try:
            con = duckdb.connect(self.duckdb_path)
            con.execute(f"DROP TABLE IF EXISTS {table_name}")
            con.close()
            return True
            
        except Exception as e:
            return False 