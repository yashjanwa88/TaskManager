# 🧪 Testing Documentation

> MSTest v2 + Moq (Backend) — Jasmine + Karma (Frontend)

---

## 📊 Test Results Summary

| Project | Framework | Tests | Result |
|---------|-----------|-------|--------|
| `TaskManager.Tests` | MSTest v2 + Moq | 16 | ✅ 16/16 PASS |
| `TaskManager.Client` | Jasmine + Karma | 27 | ✅ 27/27 PASS |
| **Total** | | **43** | **✅ 43/43 PASS** |

---

## ▶️ Run Commands

```bash
# Backend tests
cd TaskManager.Tests
dotnet test

# Frontend tests
cd TaskManager.Client
ng test --watch=false --browsers=ChromeHeadless
```

---

# PART A — Backend Testing (MSTest v2 + Moq)

---

## 🔧 Setup

**NuGet Packages:**

| Package | Version | Purpose |
|---------|---------|---------|
| `MSTest` | 3.6.4 | Test framework |
| `Microsoft.NET.Test.Sdk` | 17.12.0 | Test runner |
| `Moq` | 4.20.72 | Mocking library |
| `Microsoft.AspNetCore.Mvc.Testing` | 6.0.36 | MVC testing support |

**MSTest Attributes:**

| Attribute | Purpose |
|-----------|---------|
| `[TestClass]` | Marks class as test container |
| `[TestMethod]` | Marks method as a test case |
| `[TestInitialize]` | Runs before each test (setup) |

**Assert Methods:**

| Method | Checks |
|--------|--------|
| `Assert.AreEqual(expected, actual)` | Values are equal |
| `Assert.IsNotNull(obj)` | Object is not null |
| `Assert.IsNull(obj)` | Object is null |
| `Assert.IsInstanceOfType(obj, type)` | Object is of given type |

---

## 🎭 Moq — Mocking Library

Moq creates a **fake** implementation of `ITaskRepository` so we can test the controller without a real database.

```csharp
// Create mock
var mockRepo = new Mock<ITaskRepository>();

// Setup — what to return when method is called
mockRepo.Setup(r => r.GetAllAsync())
        .ReturnsAsync(new List<TaskItem> { ... });

// Inject mock into controller
var controller = new TasksController(mockRepo.Object);
```

---

## 📄 File 1 — `TasksControllerTests.cs` (10 Tests)

### Setup (runs before each test)
```csharp
[TestInitialize]
public void Setup()
{
    _mockRepo = new Mock<ITaskRepository>();
    _controller = new TasksController(_mockRepo.Object);
}
```

---

### GET ALL (2 tests)

| Test | What it checks |
|------|---------------|
| `GetAll_ReturnsOk_WithTaskList` | Returns 200 OK with list of 2 tasks |
| `GetAll_ReturnsOk_WithEmptyList` | Returns 200 OK even when no tasks exist |

```csharp
[TestMethod]
public async Task GetAll_ReturnsOk_WithTaskList()
{
    _mockRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(tasks);
    var result = await _controller.GetAll();
    var ok = result as OkObjectResult;
    Assert.AreEqual(200, ok.StatusCode);
    Assert.AreEqual(2, (ok.Value as List<TaskItem>)!.Count);
}
```

---

### GET BY ID (2 tests)

| Test | What it checks |
|------|---------------|
| `GetById_ReturnsOk_WhenTaskExists` | Returns 200 OK with correct task |
| `GetById_ReturnsNotFound_WhenTaskDoesNotExist` | Returns 404 when task not found |

---

### CREATE (2 tests)

| Test | What it checks |
|------|---------------|
| `Create_ReturnsCreated_WithNewTask` | Returns 201 Created with new task |
| `Create_MapsDto_Correctly` | DTO is correctly mapped to TaskItem (Status, Priority enums) |

```csharp
[TestMethod]
public async Task Create_MapsDto_Correctly()
{
    var dto = new TaskItemDto { Title = "Task", Status = 1, Priority = 2 };
    TaskItem? captured = null;
    _mockRepo.Setup(r => r.CreateAsync(It.IsAny<TaskItem>()))
             .Callback<TaskItem>(t => captured = t)
             .ReturnsAsync(new TaskItem { Id = 1 });

    await _controller.Create(dto);

    Assert.AreEqual(TaskStatus.InProgress, captured!.Status);
    Assert.AreEqual(TaskPriority.High, captured.Priority);
}
```

---

### UPDATE (2 tests)

| Test | What it checks |
|------|---------------|
| `Update_ReturnsOk_WhenTaskExists` | Returns 200 OK with updated task |
| `Update_ReturnsNotFound_WhenTaskDoesNotExist` | Returns 404 when task not found |

---

### DELETE (2 tests)

| Test | What it checks |
|------|---------------|
| `Delete_ReturnsNoContent_WhenTaskExists` | Returns 204 No Content on success |
| `Delete_ReturnsNotFound_WhenTaskDoesNotExist` | Returns 404 when task not found |

---

## 📄 File 2 — `TaskItemModelTests.cs` (6 Tests)

Tests the `TaskItem` model's default values and property assignments.

| Test | What it checks |
|------|---------------|
| `TaskItem_DefaultStatus_IsPending` | Default status is `Pending` |
| `TaskItem_DefaultPriority_IsMedium` | Default priority is `Medium` |
| `TaskItem_DefaultTitle_IsEmptyString` | Default title is `""` |
| `TaskItem_CreatedAt_IsUtc` | `CreatedAt` has `DateTimeKind.Utc` |
| `TaskItem_DueDate_IsNullByDefault` | `DueDate` is `null` by default |
| `TaskItem_CanSetAllProperties` | All properties can be set correctly |

---

# PART B — Frontend Testing (Jasmine + Karma)

---

## 🔧 Setup

**Jasmine Functions:**

| Function | Purpose |
|----------|---------|
| `describe('name', () => {})` | Test suite (group of tests) |
| `it('name', () => {})` | Single test case |
| `beforeEach(() => {})` | Runs before each test |
| `afterEach(() => {})` | Runs after each test |
| `expect(value)` | Start an assertion |

**Jasmine Matchers:**

| Matcher | Checks |
|---------|--------|
| `.toBeTruthy()` | Value is truthy |
| `.toBeFalse()` | Value is `false` |
| `.toBeTrue()` | Value is `true` |
| `.toBe(val)` | Strict equality |
| `.toEqual(val)` | Deep equality |
| `.toBeNull()` | Value is null |
| `.toHaveBeenCalled()` | Spy was called |
| `.toHaveBeenCalledWith(args)` | Spy was called with specific args |
| `.not.toHaveBeenCalled()` | Spy was NOT called |

**Jasmine Spy:**
```typescript
// Create spy object
taskServiceSpy = jasmine.createSpyObj('TaskService', ['getAll', 'delete']);

// Setup return value
taskServiceSpy.getAll.and.returnValue(of(mockTasks));

// Verify call
expect(taskServiceSpy.getAll).toHaveBeenCalled();
```

---

## 📄 File 1 — `task.service.spec.ts` (5 Tests)

Uses `HttpTestingController` to intercept HTTP calls — no real network requests.

| Test | What it checks |
|------|---------------|
| `should be created` | Service is instantiated |
| `getAll() should return task list via GET` | GET request sent to correct URL |
| `getById() should return single task via GET` | GET `/api/tasks/1` called |
| `create() should POST and return created task` | POST with correct body |
| `update() should PUT and return updated task` | PUT with correct body |
| `delete() should send DELETE request` | DELETE request sent |

```typescript
it('getAll() should return task list via GET', () => {
  service.getAll().subscribe(tasks => {
    expect(tasks.length).toBe(1);
    expect(tasks[0].title).toBe('Test Task');
  });
  const req = httpMock.expectOne(apiUrl);
  expect(req.request.method).toBe('GET');
  req.flush([mockTask]);
});
```

---

## 📄 File 2 — `task-list.component.spec.ts` (11 Tests)

| Test | What it checks |
|------|---------------|
| `should create` | Component is created |
| `should load tasks on init` | `getAll()` called on `ngOnInit` |
| `should filter tasks by status` | Status filter works correctly |
| `should filter tasks by priority` | Priority filter works correctly |
| `should filter tasks by both status and priority` | Combined filter works |
| `should return empty list when no tasks match filter` | Empty result on no match |
| `openCreate() should set showForm=true and selectedTask=null` | Create mode setup |
| `openEdit() should set showForm=true and selectedTask` | Edit mode setup |
| `onFormClose() should hide form and reload tasks` | Form close + reload |
| `getStatusClass() should return correct badge class` | CSS class mapping |
| `getPriorityClass() should return correct badge class` | CSS class mapping |

---

## 📄 File 3 — `task-form.component.spec.ts` (10 Tests)

**Create Mode (5 tests):**

| Test | What it checks |
|------|---------------|
| `should create` | Component is created |
| `isEdit should be false when no task input` | Create mode detected |
| `form should be invalid when title is empty` | Validation works |
| `form should be valid when title is provided` | Valid form state |
| `submit() should call create() when form is valid` | API call on valid submit |
| `submit() should NOT call create() when form is invalid` | No API call on invalid |
| `submit() should emit close after create` | Close event emitted |
| `cancel() should emit close` | Cancel emits close |

**Edit Mode (5 tests):**

| Test | What it checks |
|------|---------------|
| `isEdit should be true when task input is provided` | Edit mode detected |
| `form should be pre-filled with task values` | Form pre-populated |
| `submit() should call update() not create()` | Correct API method called |
| `getStatusIndex() should return correct index` | Enum to index mapping |
| `getPriorityIndex() should return correct index` | Enum to index mapping |

---

## 📄 File 4 — `app.component.spec.ts` (1 Test)

| Test | What it checks |
|------|---------------|
| `should create the app` | Root component is created successfully |
