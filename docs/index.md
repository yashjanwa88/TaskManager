# 📚 TaskManager — Complete Documentation

> Full-stack Task Management Application built with .NET 6 Web API + Angular 15 + PostgreSQL

---

## 📂 Documentation Structure

```
docs/
├── index.md                        ← You are here
├── backend/
│   └── backend.md                  ← Backend architecture & code explanation
├── frontend/
│   └── frontend.md                 ← Frontend architecture & code explanation
├── database/
│   └── database.md                 ← Database schema & EF Core migrations
├── api/
│   └── api.md                      ← REST API endpoints reference
└── testing/
    └── testing.md                  ← Unit testing (MSTest v2 + Jasmine/Karma)
```

---

## 🗂️ Quick Navigation

| Document | Description |
|----------|-------------|
| [Backend](./backend/backend.md) | .NET 6 Web API — Models, DTOs, Repository, Controller, Program.cs |
| [Frontend](./frontend/frontend.md) | Angular 15 — Components, Services, Forms, Routing |
| [Database](./database/database.md) | PostgreSQL schema, EF Core migrations, table structure |
| [API Reference](./api/api.md) | All REST endpoints with request/response examples |
| [Testing](./testing/testing.md) | MSTest v2 (16 tests) + Jasmine/Karma (27 tests) |

---

## 🚀 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Backend | ASP.NET Core Web API | .NET 6 |
| Frontend | Angular | 15 |
| Database | PostgreSQL | 14+ |
| ORM | Entity Framework Core | 6 |
| Backend Testing | MSTest v2 + Moq | v2 |
| Frontend Testing | Jasmine + Karma | 4.5 / 6.4 |

---

## 🏗️ Application Architecture

```
┌─────────────────────────────────────┐
│     Angular Frontend                │
│     http://localhost:4200           │
└────────────────┬────────────────────┘
                 │  HTTP (GET/POST/PUT/DELETE)
                 ▼
┌─────────────────────────────────────┐
│     .NET 6 Web API                  │
│     http://localhost:5000           │
│                                     │
│  Controller → Repository → DbContext│
└────────────────┬────────────────────┘
                 │  Entity Framework Core
                 ▼
┌─────────────────────────────────────┐
│     PostgreSQL Database             │
│     TaskManagerDb                   │
│     localhost:5432                  │
└─────────────────────────────────────┘
```

---

## ✅ Test Results Summary

| Project | Framework | Tests | Status |
|---------|-----------|-------|--------|
| TaskManager.Tests | MSTest v2 + Moq | 16 | ✅ 16/16 PASS |
| TaskManager.Client | Jasmine + Karma | 27 | ✅ 27/27 PASS |
| **Total** | | **43** | **✅ 43/43 PASS** |

---

## 🌿 Git Branch Strategy

```
Dev  →  Test  →  Main
```

| Branch | Purpose |
|--------|---------|
| `Dev` | Active development |
| `Test` | QA & testing |
| `Main` | Production-ready code |

---

## 👨‍💻 Developer

**Yash Janwa** — APPNEURAL Pvt. Ltd.
🔗 [GitHub Repository](https://github.com/yashjanwa88/TaskManager)
