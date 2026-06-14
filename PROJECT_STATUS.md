# NovaBite Sales Insights - Project Status Report

This document outlines the current state of the implementation for the **NovaBite Consumer Goods Sales Insights** project. It details the components that have been completed and lists the remaining tasks to satisfy all take-home assignment requirements.

---

## 📋 High-Level Summary

| Component | Status | Description |
| :--- | :---: | :--- |
| **Backend Core** | 🟢 **Complete** | FastAPI server configuration, database connections, and basic middlewares. |
| **Database & Seeding** | 🟢 **Complete** | SQLite setup, transactional database schema mapping, and CSV parser seeder. |
| **Dashboard API Routes** | 🟢 **Complete** | All required endpoints (`/api/products`, `/api/trends`, `/api/summary`) are fully implemented and verified. |
| **Chat API (`/api/chat`)** | 🔴 **Not Started** | LLM client configuration, SQL generation/retrieval setup, and prompt structure. |
| **Dashboard UI** | 🟢 **Complete** | Glassmorphic dark-themed layout, charts (monthly trends, regional pie, category bars), and KPI cards. |
| **Chat UI** | 🔴 **Not Started** | Text input, loading states, chat message logs, and server query integration. |
| **Docker & Environments** | 🟡 **Partially Complete** | Local `.env` configs exist in subdirectories, but root config and docker orchestration are missing. |
| **Documentation & Tests** | 🟡 **Partially Complete** | Basic README instructions exist, but LLM details and code explanations are placeholder text. |

---

## 🟢 1. Things Done (Completed Features)

### A. Database and Schema Seeding
* **CSV Data Asset:** Verified the raw transactional data file (`novabite_sales_data.csv` containing 1,000 transaction rows) is present in the `data/` directory.
* **SQLAlchemy Database Model:** Implemented modern SQLAlchemy 2.0 mapping in [sales.py](file:///d:/revmind_fullstack_assignment_2026/backend/app/models/sales.py) defining columns, types, and database indexes for optimal querying.
* **Idempotent Seeder Script:** Completed [seed.py](file:///d:/revmind_fullstack_assignment_2026/backend/seed.py) which handles SQLite tables creation, reads transactions, filters duplicate records by checking existing transaction IDs, and executes high-performance bulk inserts.
* **Seeded SQLite Database:** Seeding has run successfully, generating the SQLite file `sales_insights.db` containing the transaction database.

### B. Backend API Core Foundations
* **FastAPI Server Setup:** Initialized the REST API in [main.py](file:///d:/revmind_fullstack_assignment_2026/backend/app/main.py) and [main.py](file:///d:/revmind_fullstack_assignment_2026/backend/main.py).
* **CORS Support:** CORS middleware is enabled to allow local connection from the Vite development server.
* **Error Handling:** Setup standard global error handlers and custom middlewares to wrap server issues cleanly.
* **Health Endpoint:** Configured a health check router in [health.py](file:///d:/revmind_fullstack_assignment_2026/backend/app/api/health.py).

### C. Backend Analytics API Endpoints
Implemented query routines in [analytics.py](file:///d:/revmind_fullstack_assignment_2026/backend/app/api/analytics.py):
* `GET /api/summary`: Computes top-level KPIs (Total net revenue, units, gross profit margin %, top performing region, top channel, top product).
* `GET /api/products`: Returns all distinct products with their cumulative net revenue and unit sales, sorted by revenue descending.
* `GET /api/trends`: Exposes chronological monthly net revenue aggregates (specifically under `/api/trends`) for charts.
* `GET /api/sales-by-region`: Computes aggregated sales and profit margins grouped by region.
* `GET /api/sales-by-category`: Computes sales metrics grouped by product category.
* `GET /api/top-products`: Returns the highest performing products by net revenue (with adjustable limit parameters).
* `GET /api/profit-analysis`: Detailed COGS and profitability margin analytics by category, subcategory, and channel.
* `GET /api/monthly-trend`: Aggregates net revenue, gross profit, and unit sales chronologically by month.

### D. Frontend Dashboard Layout
Created a high-fidelity analytics panel with rich visual aesthetics using Tailwind CSS and React:
* **Central API Coordinator:** Implemented [api.js](file:///d:/revmind_fullstack_assignment_2026/frontend/src/services/api.js) to fetch data asynchronously from the FastAPI server.
* **Responsive Visuals:**
  * **6 KPI Cards:** Exceeds the required 3 cards by implementing: Total Revenue, Gross Profit Margin %, Units Sold, Top Region, Top Channel, Top Product. Includes skeletal states and glow effects.
  * **Interactive Trend Area Chart:** Uses `Recharts` to display net revenue and gross profit curves chronologically with hover details.
  * **Region Distribution Donut Chart:** Shows regional shares with custom legends.
  * **Product Category Performance Bar Chart:** Renders revenue and unit volume indicators per category.
  * **Rank-Badged Products Table:** Paginated table listing top performing products with SKU chips.
  * **Profitability Tabs:** Analyzes COGS and margin stats per segment.
  * **Global Refresh Action:** Re-fetches all analytics segments in parallel.

---

## 🔴 2. Things Left to Complete (Outstanding Tasks)

### A. Missing API Routes
* [x] **`GET /api/products` Endpoint:** Build a route returning *all distinct* products with their cumulative net revenue and unit sales (to satisfy backend specification).
* [x] **`GET /api/trends` Route:** Expose the monthly net revenue aggregation specifically under the path `/api/trends` (to match the assignment route spec exactly).

### B. LLM & Chat Backend Integration
* [ ] **`POST /api/chat` Endpoint:** Create a chat router in the backend to handle requests.
* [ ] **LLM Configuration:** Connect an LLM client (using the `openai` SDK or `anthropic`) with API keys loaded securely from config.
* [ ] **Data Context Retrieval & Prompt Design:** Design a prompt wrapper that supplies the model with relevant database schema context, statistics, or automatically runs SQL query generation against the SQLite database to answer data-driven questions.
* [ ] **Validation against Test Questions:** Verify the chatbot answers these specific prompt test cases accurately:
  1. *"Which region had the highest net revenue in Q1 2024?"*
  2. *"What is the gross profit margin for the Snacks category?"*
  3. *"Which sales rep closed the most units in 2025?"*
  4. *"Compare E-Commerce vs Modern Trade net revenue."*
  5. *"What was the best performing product in the West region?"*

### C. Chat Screen UI
* [ ] **Screen/Panel Component:** Add a dedicated Chat interface screen (e.g. via navigation tab or split view alongside the dashboard).
* [ ] **User Query Form:** Implement a text input field for sales manager questions.
* [ ] **Message Stream Display:** Create message bubbles showing the user's questions and the AI's responses (supporting markdown rendering for tables or lists).
* [ ] **Loading Feedback:** Implement a clean skeleton or typewriter-style typing indicator while waiting for the LLM API to respond.

### D. Submission Prerequisites & Environment Config
* [ ] **Root `.env.example`:** Create a consolidated `.env.example` at the root directory listing all variables (including keys like `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, or `GROQ_API_KEY`).
* [ ] **`docker-compose.yml` (Optional but Valued):** Create a container configuration to build and start the backend (FastAPI) and frontend (Vite) concurrently with a single command.
* [ ] **Finalize README.md:** Replace markdown placeholders in the root [README.md](file:///d:/revmind_fullstack_assignment_2026/README.md) with authentic project details:
  * Running instructions for both ends.
  * The selected LLM provider and justification.
  * Details of the prompt structure and how SQLite data context is fed to the model.
  * Known tradeoffs, shortcuts, and ideas for further improvement.

### E. Bonus Features (Optional Additions)
* [ ] **Streaming Chat Responses:** Deliver typewriter-style replies using Server-Sent Events (SSE).
* [ ] **Backend Testing:** Add automated unit tests for endpoints or SQL query generators.
