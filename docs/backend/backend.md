# 🔧 Backend Documentation

> .NET 6 Web API — Architecture, Code Structure & Explanation

---

## 📁 Folder Structure

```
TaskManager.API/
├── Controllers/
│   └── TasksController.cs      # REST API endpoints
├── Data/
│   └── AppDbContext.cs         # EF Core DbContext
├── DTOs/
│   └── TaskItemDto.cs          # Request/Response DTO
├── Models/
│   └── TaskItem.cs             # Task entity + enums
├── Repositories/
│   ├── ITaskRepository.cs      # Interface (contract)
│   └── TaskRepository.cs       # DB operations implementation
├── Migrations/                 # EF Core auto-generated migrations
├── Program.cs                  # App startup + Dependency Injection
├── appsettings.json            # Configuration + DB connection string
└── TaskManager.API.csproj      # Project file + NuGet packages
```

---

## 🏗️ Architecture Pattern — Repository Pattern

```
HTTP Request
     │
     ▼
TasksController
     │  uses interface
     ▼
ITaskRepository  ◄──── Dependency Injection
     │  implemented by
     ▼
TaskRepository
     │  uses
     ▼
AppDbContext (EF Core)
     │
     ▼
PostgreSQL Database
```

**Why Repository Pattern?**
- Controller does not directly talk to the database
- Easy to unit test — we can mock `ITaskRepository`
- Separation of concerns — each layer has one responsibility
- Easy to swap database in future without changing controller

---

## 📄 File 1 — `Models/TaskItem.cs`

The **entity class** that maps to the `Tasks` table in PostgreSQL.

```csharp
namespace TaskManager.API.Models;

public class TaskItem
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public TaskStatus Status { get; set; } = TaskStatus.Pending;
    public TaskPriority Priority { get; set; } = TaskPriority.Medium;
    public DateTime? DueDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}

public enum TaskStatus  { Pending, InProgress, Done }
public enum TaskPriority { Low, Medium, High }
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `Id` | int | Auto | Primary key (PostgreSQL IDENTITY) |
| `Title` | string | `""` | Task name — required, max 200 chars |
| `Description` | string | `""` | Task detail — max 1000 chars |
| `Status` | enum | `Pending` | Task state |
| `Priority` | enum | `Medium` | Task urgency |
| `DueDate` | DateTime? | `null` | Optional deadline |
| `CreatedAt` | DateTime | `UtcNow` | Auto-set on creation |
| `UpdatedAt` | DateTime? | `null` | Auto-set on update |

> ⚠️ **Important:** `DateTime.UtcNow` is used because PostgreSQL requires UTC timezone. Using `DateTime.Now` causes `InvalidCastException`.

---

## 📄 File 2 — `DTOs/TaskItemDto.cs`

**DTO (Data Transfer Object)** — the shape of data received from the frontend.

```csharp
namespace TaskManager.API.DTOs;

public class TaskItemDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Status { get; set; }
    public int Priority { get; set; }
    public DateTime? DueDate { get; set; }
}
```

**Why a separate DTO?**
- `Id`, `CreatedAt`, `UpdatedAt` are server-generated — frontend should not send them
- Security — user can only send allowed fields
- `Status` and `Priority` come as integers (0, 1, 2) from the form dropdowns

---

## 📄 File 3 — `Data/AppDbContext.cs`

**EF Core DbContext** — the bridge between C# code and PostgreSQL.

```csharp
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<TaskItem> Tasks => Set<TaskItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<TaskItem>(e =>
        {
            e.HasKey(t => t.Id);
            e.Property(t => t.Title).IsRequired().HasMaxLength(200);
            e.Property(t => t.Description).HasMaxLength(1000);
            e.Property(t => t.Status).HasConversion<string>();
            e.Property(t => t.Priority).HasConversion<string>();
        });
    }
}
```

**Key Points:**
- `DbSet<TaskItem> Tasks` → represents the `Tasks` table
- `HasConversion<string>()` → stores enum as text in DB (`"Pending"` not `0`)
- `HasMaxLength()` → adds column length constraint in DB

---

## 📄 File 4 — `Repositories/ITaskRepository.cs`

**Interface** — defines the contract for all database operations.

```csharp
public interface ITaskRepository
{
    Task<IEnumerable<TaskItem>> GetAllAsync();
    Task<TaskItem?> GetByIdAsync(int id);
    Task<TaskItem> CreateAsync(TaskItem task);
    Task<TaskItem?> UpdateAsync(int id, TaskItem task);
    Task<bool> DeleteAsync(int id);
}
```

---

## 📄 File 5 — `Repositories/TaskRepository.cs`

**Implementation** — actual database operations using EF Core.

```csharp
public class TaskRepository : ITaskRepository
{
    private readonly AppDbContext _context;
    public TaskRepository(AppDbContext context) => _context = context;

    // GET ALL — latest first
    public async Task<IEnumerable<TaskItem>> GetAllAsync() =>
        await _context.Tasks.OrderByDescending(t => t.CreatedAt).ToListAsync();

    // GET BY ID
    public async Task<TaskItem?> GetByIdAsync(int id) =>
        await _context.Tasks.FindAsync(id);

    // CREATE
    public async Task<TaskItem> CreateAsync(TaskItem task)
    {
        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();
        return task;
    }

    // UPDATE
    public async Task<TaskItem?> UpdateAsync(int id, TaskItem task)
    {
        var existing = await _context.Tasks.FindAsync(id);
        if (existing is null) return null;

        existing.Title       = task.Title;
        existing.Description = task.Description;
        existing.Status      = task.Status;
        existing.Priority    = task.Priority;
        existing.DueDate     = task.DueDate;
        existing.UpdatedAt   = DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Utc);

        await _context.SaveChangesAsync();
        return existing;
    }

    // DELETE
    public async Task<bool> DeleteAsync(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task is null) return false;

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();
        return true;
    }
}
```

---

## 📄 File 6 — `Controllers/TasksController.cs`

**REST API Controller** — receives HTTP requests and returns responses.

```csharp
[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ITaskRepository _repo;
    public TasksController(ITaskRepository repo) => _repo = repo;

    [HttpGet]    public async Task<IActionResult> GetAll()           => Ok(await _repo.GetAllAsync());
    [HttpGet("{id}")] public async Task<IActionResult> GetById(int id) { ... }
    [HttpPost]   public async Task<IActionResult> Create(TaskItemDto dto) { ... }
    [HttpPut("{id}")] public async Task<IActionResult> Update(int id, TaskItemDto dto) { ... }
    [HttpDelete("{id}")] public async Task<IActionResult> Delete(int id) { ... }

    private static TaskItem MapFromDto(TaskItemDto dto) => new()
    {
        Title       = dto.Title,
        Description = dto.Description,
        Status      = (TaskStatus)dto.Status,
        Priority    = (TaskPriority)dto.Priority,
        DueDate     = dto.DueDate.HasValue
                      ? DateTime.SpecifyKind(dto.DueDate.Value, DateTimeKind.Utc)
                      : null
    };
}
```

**`MapFromDto()` method:**
- Converts `TaskItemDto` → `TaskItem`
- Converts `DueDate` to UTC using `DateTime.SpecifyKind()` — required for PostgreSQL

---

## 📄 File 7 — `Program.cs`

**Application startup** — registers all services with Dependency Injection.

```csharp
// 1. PostgreSQL + EF Core
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Repository — Scoped (one instance per HTTP request)
builder.Services.AddScoped<ITaskRepository, TaskRepository>();

// 3. CORS — Allow Angular (localhost:4200) to call the API
builder.Services.AddCors(options =>
    options.AddPolicy("AllowAngular", policy =>
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()));

// 4. JSON Enum as string ("Pending" not 0)
builder.Services.AddControllers()
    .AddJsonOptions(x =>
        x.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

// 5. Swagger UI
builder.Services.AddSwaggerGen();
```

---

## 📦 NuGet Packages

| Package | Version | Purpose |
|---------|---------|---------|
| `Swashbuckle.AspNetCore` | 6.5.0 | Swagger UI |
| `Npgsql.EntityFrameworkCore.PostgreSQL` | 6.0.22 | PostgreSQL + EF Core |
| `Microsoft.EntityFrameworkCore.Design` | 6.0.36 | Migration tooling |
| `Microsoft.EntityFrameworkCore.Tools` | 6.0.36 | `dotnet ef` commands |

---

## ▶️ How to Run

```bash
cd TaskManager.API
dotnet run
```

- API: `http://localhost:5000`
- Swagger: `http://localhost:5000/swagger`
