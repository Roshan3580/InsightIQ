import os
from typing import Dict, Any, Optional
from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate
from langchain.schema import HumanMessage, SystemMessage
import pandas as pd
import json

class AIService:
    def __init__(self):
        self.groq_api_key = os.getenv("GROQ_API_KEY")
        if not self.groq_api_key:
            raise ValueError("GROQ_API_KEY environment variable is required")
        
        self.llm = ChatGroq(
            groq_api_key=self.groq_api_key,
            model_name="llama3-8b-8192"  # Fast and cost-effective
        )
    
    async def natural_language_to_sql(
        self, 
        query: str, 
        schema_info: Dict[str, Any],
        sample_data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Convert natural language query to SQL using Groq
        """
        try:
            # Create schema description
            schema_description = self._format_schema_description(schema_info, sample_data)
            
            # Create prompt
            prompt = ChatPromptTemplate.from_messages([
                ("system", self._get_system_prompt()),
                ("human", self._get_human_prompt(query, schema_description))
            ])
            
            # Generate response
            response = await self.llm.ainvoke(prompt.format_messages(
                query=query,
                schema_description=schema_description
            ))
            
            # Parse response
            result = self._parse_ai_response(response.content)
            
            return {
                "sql": result.get("sql"),
                "query_type": result.get("query_type"),
                "visualization_type": result.get("visualization_type"),
                "explanation": result.get("explanation"),
                "confidence": result.get("confidence", 0.8)
            }
            
        except Exception as e:
            return {
                "error": str(e),
                "sql": None,
                "query_type": "error",
                "visualization_type": "table"
            }
    
    def _format_schema_description(self, schema_info: Dict[str, Any], sample_data: Optional[Dict[str, Any]] = None) -> str:
        """Format schema information for the AI prompt"""
        schema_desc = "Database Schema:\n"
        
        for column in schema_info.get("columns", []):
            schema_desc += f"- {column['name']} ({column['type']}): {column.get('description', 'No description')}\n"
        
        if sample_data:
            schema_desc += "\nSample Data (first 3 rows):\n"
            for i, row in enumerate(sample_data.get("rows", [])[:3]):
                schema_desc += f"Row {i+1}: {row}\n"
        
        return schema_desc
    
    def _get_system_prompt(self) -> str:
        """Get the system prompt for NL2SQL conversion"""
        return """You are an expert SQL analyst. Your job is to convert natural language queries into accurate SQL statements.

Key rules:
1. Always use proper SQL syntax
2. Use appropriate aggregation functions (COUNT, SUM, AVG, etc.)
3. Include proper WHERE clauses for filtering
4. Use ORDER BY for sorting when relevant
5. Limit results to reasonable amounts (e.g., LIMIT 100)
6. Use proper date functions for time-based queries
7. Return JSON format with sql, query_type, visualization_type, and explanation

Common query types:
- churn_analysis: Customer retention/churn metrics
- revenue_analysis: Sales and revenue trends
- user_analysis: User growth and engagement
- general_metrics: Basic business metrics

Visualization types:
- line: Time series data
- bar: Categorical comparisons
- pie: Proportions/percentages
- table: Tabular data"""
    
    def _get_human_prompt(self, query: str, schema_description: str) -> str:
        """Get the human prompt for the specific query"""
        return f"""Schema Information:
{schema_description}

Natural Language Query: "{query}"

Please convert this to SQL and return a JSON response with:
{{
    "sql": "SELECT ...",
    "query_type": "churn_analysis|revenue_analysis|user_analysis|general_metrics",
    "visualization_type": "line|bar|pie|table",
    "explanation": "Brief explanation of what this query does",
    "confidence": 0.9
}}"""
    
    def _parse_ai_response(self, response: str) -> Dict[str, Any]:
        """Parse the AI response to extract SQL and metadata"""
        try:
            # Try to extract JSON from response
            if "```json" in response:
                json_start = response.find("```json") + 7
                json_end = response.find("```", json_start)
                json_str = response[json_start:json_end].strip()
            elif "{" in response and "}" in response:
                json_start = response.find("{")
                json_end = response.rfind("}") + 1
                json_str = response[json_start:json_end]
            else:
                # Fallback: try to extract SQL manually
                return {
                    "sql": response.strip(),
                    "query_type": "general_metrics",
                    "visualization_type": "table",
                    "explanation": "Query generated from natural language",
                    "confidence": 0.7
                }
            
            return json.loads(json_str)
            
        except json.JSONDecodeError:
            # Fallback parsing
            return {
                "sql": response.strip(),
                "query_type": "general_metrics",
                "visualization_type": "table",
                "explanation": "Query generated from natural language",
                "confidence": 0.6
            }
    
    async def explain_results(self, query: str, results: Any) -> str:
        """Generate AI explanation of query results"""
        try:
            prompt = f"""Analyze these query results and provide a business-friendly explanation:

Query: "{query}"
Results: {json.dumps(results, default=str)}

Please provide a clear, actionable explanation that a business user would understand."""
            
            response = await self.llm.ainvoke([HumanMessage(content=prompt)])
            return response.content
            
        except Exception as e:
            return f"Analysis of the results: {str(e)}" 