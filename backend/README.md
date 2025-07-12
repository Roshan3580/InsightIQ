# InsightIQ Backend

AI-Powered Business Analytics Dashboard Backend API built with FastAPI, LangChain, and Groq.

## 🚀 Features

- **Natural Language to SQL**: Convert plain English queries to SQL using Groq AI
- **CSV Upload & Processing**: Upload CSV files with automatic schema generation
- **DuckDB Integration**: Fast analytical database for data processing
- **Dashboard Management**: Create and manage custom dashboards
- **Query History**: Track and retrieve past queries
- **RESTful API**: Complete API with automatic documentation

## 🛠️ Tech Stack

- **FastAPI**: Modern, fast web framework for building APIs
- **SQLAlchemy**: SQL toolkit and ORM
- **PostgreSQL**: Primary database for metadata
- **DuckDB**: Analytical database for data processing
- **LangChain**: Framework for AI applications
- **Groq**: Fast AI inference for NL2SQL
- **Pydantic**: Data validation using Python type annotations

## 📋 Prerequisites

- Python 3.8+
- PostgreSQL
- Groq API key

## 🏗️ Installation

1. **Clone the repository and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

5. **Configure PostgreSQL:**
   - Create a database named `insightiq`
   - Update the database URLs in `.env`

6. **Get a Groq API key:**
   - Sign up at [Groq](https://console.groq.com/)
   - Add your API key to `.env`

## 🔧 Configuration

### Environment Variables

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/insightiq
DATABASE_URL_ASYNC=postgresql+asyncpg://postgres:password@localhost:5432/insightiq

# AI Configuration
GROQ_API_KEY=your_groq_api_key_here

# Security
SECRET_KEY=your-secret-key-change-in-production

# App Configuration
DEBUG=true
UPLOAD_DIR=uploads
MAX_FILE_SIZE=52428800
DUCKDB_PATH=data/insightiq.duckdb
```

## 🚀 Running the Application

### Development Mode
```bash
python start.py
```

### Production Mode
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API Base**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📚 API Endpoints

### Queries
- `POST /api/v1/query` - Process natural language query
- `GET /api/v1/query/history` - Get query history
- `GET /api/v1/query/{query_id}` - Get specific query details

### Upload
- `POST /api/v1/upload/csv` - Upload and process CSV file
- `GET /api/v1/datasets` - List all datasets
- `GET /api/v1/datasets/{dataset_id}` - Get dataset details
- `DELETE /api/v1/datasets/{dataset_id}` - Delete dataset

### Dashboards
- `GET /api/v1/dashboards` - List all dashboards
- `GET /api/v1/dashboards/{dashboard_id}` - Get dashboard details
- `POST /api/v1/dashboards` - Create new dashboard
- `POST /api/v1/dashboards/{dashboard_id}/widgets` - Add widget to dashboard

## 🔍 Usage Examples

### 1. Upload a CSV File
```bash
curl -X POST "http://localhost:8000/api/v1/upload/csv" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@your_data.csv" \
  -F "dataset_name=Sales Data" \
  -F "description=Monthly sales data for 2023"
```

### 2. Query Data with Natural Language
```bash
curl -X POST "http://localhost:8000/api/v1/query" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What is our monthly revenue trend?",
    "dataset_id": 1
  }'
```

### 3. Get Query History
```bash
curl "http://localhost:8000/api/v1/query/history?limit=10"
```

## 🏗️ Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── routes/
│   │       ├── query.py      # Query endpoints
│   │       ├── upload.py     # File upload endpoints
│   │       └── dashboard.py  # Dashboard endpoints
│   ├── core/
│   │   └── config.py         # Configuration settings
│   ├── db/
│   │   └── database.py       # Database connection
│   ├── models/
│   │   ├── base.py          # Base model
│   │   ├── user.py          # User model
│   │   ├── dataset.py       # Dataset model
│   │   ├── query.py         # Query model
│   │   └── dashboard.py     # Dashboard models
│   ├── schemas/
│   │   └── query.py         # Pydantic schemas
│   ├── services/
│   │   ├── ai_service.py    # AI/NL2SQL service
│   │   └── data_service.py  # Data processing service
│   └── main.py              # FastAPI application
├── requirements.txt         # Python dependencies
├── start.py                # Startup script
└── README.md               # This file
```

## 🔧 Development

### Running Tests
```bash
pytest
```

### Code Formatting
```bash
black .
isort .
```

### Database Migrations
```bash
# Create migration
alembic revision --autogenerate -m "Description"

# Apply migration
alembic upgrade head
```

## 🚀 Deployment

### Docker
```bash
# Build image
docker build -t insightiq-backend .

# Run container
docker run -p 8000:8000 insightiq-backend
```

### Environment Variables for Production
- Set `DEBUG=false`
- Use strong `SECRET_KEY`
- Configure production database URLs
- Set up proper CORS origins

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 