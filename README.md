# 📋 TaskManager

A full-stack **Task Management Application** built with **.NET 6 Web API** (Backend) and **Angular 15** (Frontend), connected to **PostgreSQL** database.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | .NET 6 Web API (C#) |
| Frontend | Angular 15 (TypeScript) |
| Database | PostgreSQL (pgAdmin 4) |
| ORM | Entity Framework Core 6 |
| Backend Testing | MSTest v2 + Moq |
| Frontend Testing | Jasmine + Karma |
| Version Control | Git + GitHub |

---

## 📁 Project Structure

```
TaskManager/
│
├── TaskManager.API/              # Backend - .NET 6 Web API
│   ├── Controllers/
│   │   └── TasksController.cs    # REST API endpoints
│   ├── Data/
│   │   └── AppDbContext.cs       # EF Core DbContext
│   ├── DTOs/
│   │   └── TaskItemDto.cs        # Request/Response DTO
│   ├── Models/
│   │   └── TaskItem.cs           # Task entity + enums
│   ├── Repositories/
│   │   ├── ITaskRepository.cs    # Interface
│   │   └── TaskRepository.cs     # DB operations
│   ├── Migrations/               # EF Core migrations
│   ├── Program.cs                # App startup + DI
│   └── appsettings.json          # DB connection string
│
├── TaskManager.Tests/            # Backend Tests - MSTest v2
│   ├── TasksControllerTests.cs   # 10 controller test cases
│   └── TaskItemModelTests.cs     # 6 model test cases
│
├── TaskManager.Client/           # Frontend - Angular 15
│   └── src/app/
│       ├── models/
│       │   └── task.model.ts     # TypeScript interfaces + enums
│       ├── services/
│       │   ├── task.service.ts   # HTTP API calls
│       │   └── task.service.spec.ts
│       └── components/
│           ├── task-list/        # Task list + filter UI
│           └── task-form/        # Create / Edit modal form
│
└── TaskManager.sln               # Solution file
```

---

## ✨ Features

- ✅ **Create** new tasks with title, description, status, priority, due date
- ✅ **View** all tasks in a card layout
- ✅ **Edit** existing tasks via modal form
- ✅ **Delete** tasks with confirmation
- ✅ **Filter** tasks by Status and Priority
- ✅ **Swagger UI** for API testing
- ✅ **43 Unit Tests** — all passing

---

## 🗂️ Task Fields

| Field | Type | Description |
|-------|------|-------------|
| Id | int | Auto-generated primary key |
| Title | string | Task name (required, max 200 chars) |
| Description | string | Task detail (max 1000 chars) |
| Status | enum | `Pending` / `InProgress` / `Done` |
| Priority | enum | `Low` / `Medium` / `High` |
| DueDate | DateTime? | Optional deadline |
| CreatedAt | DateTime | Auto set to UTC on create |
| UpdatedAt | DateTime? | Auto set to UTC on update |

---

## 🔌 API Endpoints

Base URL: `http://localhost:5000/api/tasks`

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/api/tasks` | Get all tasks | 200 OK |
| GET | `/api/tasks/{id}` | Get task by ID | 200 OK / 404 |
| POST | `/api/tasks` | Create new task | 201 Created |
| PUT | `/api/tasks/{id}` | Update task | 200 OK / 404 |
| DELETE | `/api/tasks/{id}` | Delete task | 204 NoContent / 404 |

---

## ⚙️ Prerequisites

Make sure these are installed on your system:

- [.NET 6 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/6.0)
- [Node.js](https://nodejs.org/) (v16+)
- [Angular CLI](https://angular.io/cli) v15 → `npm install -g @angular/cli@15`
- [PostgreSQL](https://www.postgresql.org/download/) + pgAdmin 4

---

## 🛠️ Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yashjanwa88/TaskManager.git
cd TaskManager
```

### 2. Backend Setup

```bash
cd TaskManager.API
```

Update `appsettings.json` with your PostgreSQL credentials:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=TaskManagerDb;Username=postgres;Password=YOUR_PASSWORD"
  }
}
```

Run database migration:

```bash
dotnet ef database update
```

Start the API:

```bash
dotnet run
```

> API runs on: `http://localhost:5000`
> Swagger UI: `http://localhost:5000/swagger`

### 3. Frontend Setup

```bash
cd TaskManager.Client
npm install
ng serve
```

> App runs on: `http://localhost:4200`

---

## 🧪 Running Tests

### Backend Tests (MSTest v2)

```bash
cd TaskManager.Tests
dotnet test
```

**Results:**

| Test Class | Tests | Status |
|------------|-------|--------|
| TasksControllerTests | 10 | ✅ PASS |
| TaskItemModelTests | 6 | ✅ PASS |
| **Total** | **16** | **16/16** |

### Frontend Tests (Jasmine + Karma)

```bash
cd TaskManager.Client
ng test --watch=false --browsers=ChromeHeadless
```

**Results:**

| Test File | Tests | Status |
|-----------|-------|--------|
| task.service.spec.ts | 5 | ✅ PASS |
| task-list.component.spec.ts | 11 | ✅ PASS |
| task-form.component.spec.ts | 10 | ✅ PASS |
| app.component.spec.ts | 1 | ✅ PASS |
| **Total** | **27** | **27/27** |

---

## 🌿 Git Branch Strategy

```
Dev  →  Test  →  Main (Production)
```

| Branch | Purpose |
|--------|---------|
| `Dev` | Active development |
| `Test` | QA & testing |
| `Main` | Production-ready stable code |

---

## 🏗️ Architecture

```
Angular Frontend (localhost:4200)
        │
        │  HTTP (GET/POST/PUT/DELETE)
        ▼
.NET 6 Web API (localhost:5000)
        │
        │  Entity Framework Core
        ▼
PostgreSQL Database (TaskManagerDb)
```

**Repository Pattern:**
```
Controller → ITaskRepository → TaskRepository → AppDbContext → PostgreSQL
```

---

## 📸 Screenshots

### Task List
> All tasks displayed in card layout with Status and Priority badges, filter dropdowns, and action buttons.

### Task Form
> Modal form for creating and editing tasks with validation.

### Swagger UI
> API documentation and testing at `http://localhost:5000/swagger`

---

## 👨‍💻 Developer

**Yash Janwa**
APPNEURAL Pvt. Ltd.

---

## 📄 License

This project is for educational and demonstration purposes.
