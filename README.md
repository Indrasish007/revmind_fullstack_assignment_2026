# RevMind AI — Full-Stack Take-Home Assignment

This repository contains the full-stack application for **NovaBite Consumer Goods Sales Insights**, featuring a FastAPI backend, a React (Vite) frontend, and a SQLite database populated with sales data.

## Project Structure

```
├── backend/                  # Python FastAPI API
│   ├── main.py               # API endpoints
│   ├── requirements.txt      # Python dependencies
│   ├── .env.example          # Environment variables template
│   └── seed.py               # SQLite seeding script (to be implemented)
├── frontend/                 # React (Vite) Frontend
├── data/
│   └── novabite_sales_data.csv # Raw transactional dataset
├── .gitignore
└── README.md
```

## How to Run the Project Locally

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ (npm or yarn)

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows (PowerShell):
   .\venv\Scripts\Activate.ps1
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy the `.env.example` to `.env` and fill in your API keys:
   ```bash
   cp .env.example .env
   ```
5. Run the FastAPI development server:
   ```bash
   uvicorn main:app --reload
   ```
   The API will be available at `http://127.0.0.1:8000`. You can view the API documentation at `http://127.0.0.1:8000/docs`.

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

---

## Technical Details (To Be Updated During Implementation)

### 1. LLM Selection
*(Explain which LLM you used and why here)*

### 2. Prompt Engineering
*(Explain how you structured the prompt in `/api/chat` here)*

### 3. Areas of Improvement
*(Describe what you would improve with more time)*

### 4. Tradeoffs & Shortcuts
*(Describe any tradeoffs or shortcuts you knowingly made)*
