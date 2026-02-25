# 💝 OurStory AI — Relationship Memory Assistant

> An emotionally intelligent full-stack AI application that stores, organizes, and retrieves relationship memories — powered by **Groq LLaMA3** for lightning-fast AI inference.

---

## 🏗️ Architecture Overview

```
ourstory-ai/
├── backend/          # Spring Boot 3 (Java 17)
│   └── src/main/java/com/ourstory/
│       ├── config/           # Security, CORS, WebClient
│       ├── controller/       # REST endpoints
│       ├── dto/              # Request/Response DTOs
│       ├── entity/           # JPA entities + enums
│       ├── exception/        # Global exception handling
│       ├── mapper/           # MapStruct mappers
│       ├── repository/       # Spring Data JPA
│       └── service/impl/     # Business logic + Groq integration
├── frontend/         # React 18 + Vite + TypeScript
│   └── src/
│       ├── components/       # Reusable UI components
│       ├── pages/            # Route-level pages
│       ├── services/         # Axios API client
│       └── types/            # TypeScript interfaces
└── docker-compose.yml
```

---

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 20+
- MySQL 8+ (or use Docker)
- A **Groq API key** (free at [console.groq.com](https://console.groq.com))

---

### Option 1: Docker Compose (Recommended)

```bash
# 1. Clone & enter directory
cd ourstory-ai

# 2. Set your environment variables
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# 3. Start everything
docker-compose up --build

# App runs at:
#   Frontend → http://localhost:80
#   Backend  → http://localhost:8080/api
```

---

### Option 2: Local Development

#### Backend

```bash
cd backend

# Configure your environment
export GROQ_API_KEY=gsk_your_key_here
export DB_USERNAME=root
export DB_PASSWORD=yourpassword

# Run
./mvnw spring-boot:run
# API available at http://localhost:8080/api
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
# App available at http://localhost:5173
```

---

## 🔑 Get Your Groq API Key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up for a free account
3. Navigate to **API Keys** → **Create API Key**
4. Copy the key and set `GROQ_API_KEY=gsk_...` in your `.env`

> Groq offers **free tier** with generous rate limits for LLaMA3.

---

## 📡 API Reference

### Memory Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/memories` | Get all memories |
| `GET` | `/api/memories?type=MEMORY` | Filter by type |
| `GET` | `/api/memories?search=keyword` | Search memories |
| `GET` | `/api/memories/{id}` | Get by ID |
| `POST` | `/api/memories` | Create memory |
| `PUT` | `/api/memories/{id}` | Update memory |
| `DELETE` | `/api/memories/{id}` | Delete memory |
| `GET` | `/api/memories/stats` | Get counts by type |

### Chat Endpoint

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/chat` | Send message to AI |
| `GET` | `/api/chat/health` | Health check |

### Example Request — Create Memory

```json
POST /api/memories
{
  "type": "FIRST_MEETING",
  "title": "How We Met at the Coffee Shop",
  "content": "It was a rainy Tuesday afternoon when we both reached for the last chocolate croissant...",
  "date": "2022-03-14"
}
```

### Example Request — Chat

```json
POST /api/chat
{
  "message": "How did we first meet?"
}
```

### Example Response — Chat

```json
{
  "message": "How did we first meet?",
  "reply": "What a beautiful memory! According to your story, you first met at a coffee shop on March 14, 2022...",
  "timestamp": "2024-01-15T14:30:00",
  "memoriesUsed": 12,
  "model": "llama3-8b-8192"
}
```

---

## 🗄️ Database Schema

```sql
CREATE TABLE relationship_memory (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    type        ENUM('FIRST_MEETING','MEMORY','HER_INFO','HIS_INFO','EVENT','NOTE') NOT NULL,
    title       VARCHAR(255) NOT NULL,
    content     TEXT NOT NULL,
    date        DATE,
    createdAt   DATETIME NOT NULL,
    updatedAt   DATETIME NOT NULL,
    INDEX idx_memory_type (type),
    INDEX idx_memory_date (date),
    INDEX idx_memory_created_at (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 🧠 How the AI Works

1. **User sends a message** via the chat interface
2. **All relationship memories** are fetched from the database
3. **Context is formatted** structurally:
   ```
   [FIRST_MEETING]
   Title: How We Met at the Coffee Shop
   Content: It was a rainy Tuesday...
   Date: March 14, 2022
   ---
   ```
4. **Prompt is built** combining the system prompt + full context + user question
5. **Groq API is called** with `llama3-8b-8192` model (8192 token context)
6. **AI response is streamed** back to the user with metadata

---

## 🏛️ Backend Architecture (Clean Architecture)

```
Controller → Service Interface → Service Impl → Repository
                                      ↓
                               Groq WebClient
```

- **Controller Layer** — REST endpoints, input validation
- **Service Layer** — Business logic, orchestration
- **Repository Layer** — Spring Data JPA queries
- **DTO Layer** — Input/output data contracts
- **Mapper Layer** — MapStruct entity↔DTO conversion
- **Config Layer** — WebClient, Security, CORS
- **Exception Layer** — GlobalExceptionHandler with typed errors

---

## 🎨 Frontend Features

- **Dashboard** — Stats overview, quick actions, recent memories
- **AI Chat** — Real-time messaging with typing indicators, suggested questions
- **Memories** — Full CRUD with search, type filtering, expand/collapse cards
- **Responsive** — Mobile-first, works on all screen sizes
- **Animations** — Framer Motion throughout for polished UX

---

## 🔒 Security

The MVP uses **permitAll** for simplicity. To enable JWT:

1. Uncomment JWT dependencies in `pom.xml`
2. Add `JwtAuthFilter` to `SecurityFilterChain`
3. Add `/api/auth/login` endpoint

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript, TailwindCSS, Framer Motion |
| Backend | Java 17, Spring Boot 3.2, Spring Data JPA |
| Database | MySQL 8.0 |
| ORM | Hibernate via Spring JPA |
| Mapping | MapStruct 1.5 |
| HTTP Client | Spring WebFlux WebClient |
| AI Provider | Groq (LLaMA3-8b-8192) |
| Auth | Spring Security (Basic/JWT-ready) |
| Build | Maven, Vite |
| Deploy | Docker + Nginx |

---

## 📝 Memory Types

| Type | Emoji | Description |
|------|-------|-------------|
| `FIRST_MEETING` | ✨ | How you first met |
| `MEMORY` | 💝 | Shared experiences |
| `HER_INFO` | 🌸 | Her preferences & details |
| `HIS_INFO` | 💙 | His preferences & details |
| `EVENT` | 🎉 | Important milestones |
| `NOTE` | 📝 | General notes |

---

*Built with ❤️ — Every love story deserves to be remembered.*
