from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Dict, Any

from app.db.database import get_db
from app.models import Dashboard, DashboardWidget, Query

router = APIRouter()

@router.get("/dashboards")
async def list_dashboards(
    db: AsyncSession = Depends(get_db)
):
    """
    List all dashboards
    """
    try:
        result = await db.execute(select(Dashboard).order_by(Dashboard.created_at.desc()))
        dashboards = result.scalars().all()
        
        return {
            "success": True,
            "dashboards": [
                {
                    "id": dashboard.id,
                    "name": dashboard.name,
                    "description": dashboard.description,
                    "is_public": dashboard.is_public,
                    "created_at": dashboard.created_at.isoformat()
                }
                for dashboard in dashboards
            ]
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to list dashboards: {str(e)}"
        )

@router.get("/dashboards/{dashboard_id}")
async def get_dashboard_details(
    dashboard_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Get dashboard details with widgets
    """
    try:
        result = await db.execute(select(Dashboard).where(Dashboard.id == dashboard_id))
        dashboard = result.scalar_one_or_none()
        
        if not dashboard:
            raise HTTPException(status_code=404, detail="Dashboard not found")
        
        # Get widgets for this dashboard
        widgets_result = await db.execute(
            select(DashboardWidget).where(DashboardWidget.dashboard_id == dashboard_id)
        )
        widgets = widgets_result.scalars().all()
        
        return {
            "success": True,
            "dashboard": {
                "id": dashboard.id,
                "name": dashboard.name,
                "description": dashboard.description,
                "is_public": dashboard.is_public,
                "layout_config": dashboard.layout_config,
                "widgets": [
                    {
                        "id": widget.id,
                        "title": widget.title,
                        "widget_type": widget.widget_type,
                        "position_x": widget.position_x,
                        "position_y": widget.position_y,
                        "width": widget.width,
                        "height": widget.height,
                        "config": widget.config
                    }
                    for widget in widgets
                ],
                "created_at": dashboard.created_at.isoformat()
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get dashboard details: {str(e)}"
        )

@router.post("/dashboards")
async def create_dashboard(
    name: str,
    description: str = "",
    is_public: bool = False,
    db: AsyncSession = Depends(get_db)
):
    """
    Create a new dashboard
    """
    try:
        dashboard = Dashboard(
            name=name,
            description=description,
            is_public=is_public,
            owner_id=1  # Default user ID
        )
        
        db.add(dashboard)
        await db.commit()
        await db.refresh(dashboard)
        
        return {
            "success": True,
            "message": "Dashboard created successfully",
            "dashboard": {
                "id": dashboard.id,
                "name": dashboard.name,
                "description": dashboard.description,
                "is_public": dashboard.is_public,
                "created_at": dashboard.created_at.isoformat()
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create dashboard: {str(e)}"
        )

@router.post("/dashboards/{dashboard_id}/widgets")
async def add_widget_to_dashboard(
    dashboard_id: int,
    title: str,
    widget_type: str,
    query_id: int,
    position_x: int = 0,
    position_y: int = 0,
    width: int = 6,
    height: int = 4,
    config: Dict[str, Any] = {},
    db: AsyncSession = Depends(get_db)
):
    """
    Add a widget to a dashboard
    """
    try:
        # Verify dashboard exists
        dashboard_result = await db.execute(select(Dashboard).where(Dashboard.id == dashboard_id))
        dashboard = dashboard_result.scalar_one_or_none()
        
        if not dashboard:
            raise HTTPException(status_code=404, detail="Dashboard not found")
        
        # Verify query exists
        query_result = await db.execute(select(Query).where(Query.id == query_id))
        query = query_result.scalar_one_or_none()
        
        if not query:
            raise HTTPException(status_code=404, detail="Query not found")
        
        # Create widget
        widget = DashboardWidget(
            title=title,
            widget_type=widget_type,
            position_x=position_x,
            position_y=position_y,
            width=width,
            height=height,
            config=config,
            query_id=query_id,
            dashboard_id=dashboard_id
        )
        
        db.add(widget)
        await db.commit()
        await db.refresh(widget)
        
        return {
            "success": True,
            "message": "Widget added successfully",
            "widget": {
                "id": widget.id,
                "title": widget.title,
                "widget_type": widget.widget_type,
                "position_x": widget.position_x,
                "position_y": widget.position_y,
                "width": widget.width,
                "height": widget.height,
                "config": widget.config
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to add widget: {str(e)}"
        ) 