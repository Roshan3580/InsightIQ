# InsightIQ

An AI-powered business analytics dashboard that enables users to query and visualize data using natural language. Built with React, FastAPI, LangChain, and Groq.

## 🚀 Features

### Frontend
- **Natural Language Queries**: Ask questions in plain English like "What's our churn this month?"
- **Interactive Visualizations**: Beautiful charts and graphs using Recharts
- **Modern UI**: Responsive design with shadcn/ui components
- **Real-time Insights**: Instant AI-generated explanations of data

### Backend
- **NL2SQL Pipeline**: Convert natural language to SQL using Groq AI
- **CSV Upload & Processing**: Automatic schema generation from uploaded files
- **DuckDB Integration**: Fast analytical database for data processing
- **Dashboard Builder**: Create custom dashboards with drag-and-drop widgets
- **Query History**: Track and retrieve past queries

## 🏗️ Architecture

```
InsightIQ/
├── frontend/          # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   └── hooks/         # Custom hooks
│   └── package.json
├── backend/           # FastAPI + LangChain + Groq
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── services/     # AI and data services
│   │   └── models/       # Database models
│   └── requirements.txt
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful UI components
- **Recharts** - Charting library

### Backend
- **FastAPI** - Modern Python web framework
- **LangChain** - AI application framework
- **Groq** - Fast AI inference for NL2SQL
- **PostgreSQL** - Primary database
- **DuckDB** - Analytical database
- **SQLAlchemy** - ORM and database toolkit

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- Python 3.8+
- PostgreSQL
- Groq API key

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:** `http://localhost:5173`

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment:**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

5. **Start the server:**
   ```bash
   python start.py
   ```

6. **API Documentation:** `http://localhost:8000/docs`

## 📚 API Endpoints

### Queries
- `POST /api/v1/query` - Process natural language query
- `GET /api/v1/query/history` - Get query history

### Upload
- `POST /api/v1/upload/csv` - Upload and process CSV file
- `GET /api/v1/datasets` - List all datasets

### Dashboards
- `GET /api/v1/dashboards` - List all dashboards
- `POST /api/v1/dashboards` - Create new dashboard

## 🔍 Usage Examples

### 1. Upload Data
Upload a CSV file through the web interface or API:
```bash
curl -X POST "http://localhost:8000/api/v1/upload/csv" \
  -F "file=@sales_data.csv" \
  -F "dataset_name=Sales Data"
```

### 2. Ask Questions
Use natural language to query your data:
- "What's our monthly revenue trend?"
- "Show me customer churn by region"
- "Which products are selling best?"

### 3. Create Dashboards
Build custom dashboards with your insights and share them with your team.

## 🐳 Docker Deployment

### Backend
```bash
cd backend
docker build -t insightiq-backend .
docker run -p 8000:8000 insightiq-backend
```

### Frontend
```bash
cd frontend
docker build -t insightiq-frontend .
docker run -p 5173:5173 insightiq-frontend
```

## 🔧 Development

### Frontend Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

### Backend Commands
- `python start.py` - Start development server
- `pytest` - Run tests
- `black .` - Format code

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request
