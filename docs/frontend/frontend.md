# 🎨 Frontend Documentation

> Angular 15 — Architecture, Components, Services & Forms

---

## 📁 Folder Structure

```
TaskManager.Client/src/app/
├── models/
│   └── task.model.ts                    # TypeScript interfaces + enums
├── services/
│   ├── task.service.ts                  # HTTP API calls
│   └── task.service.spec.ts             # Service unit tests
├── components/
│   ├── task-list/
│   │   ├── task-list.component.ts       # Task list logic
│   │   ├── task-list.component.html     # Task list UI template
│   │   ├── task-list.component.css      # Task list styles
│   │   └── task-list.component.spec.ts  # Component unit tests
│   └── task-form/
│       ├── task-form.component.ts       # Form logic (create/edit)
│       ├── task-form.component.html     # Form UI template
│       ├── task-form.component.css      # Form styles
│       └── task-form.component.spec.ts  # Component unit tests
├── app.module.ts                        # Root module
├── app.component.ts                     # Root component
├── app.component.html                   # Root template
└── app-routing.module.ts                # Routing config
```

---

## 🏗️ Component Architecture

```
AppComponent  (root)
     │
     └── TaskListComponent
               │
               └── TaskFormComponent  (modal — shown conditionally)
```

**Data Flow:**
```
TaskListComponent
     │  calls
     ▼
TaskService  ──── HTTP ────►  .NET 6 API
     │  returns Observable
     ▼
TaskListComponent  ──── @Input ────►  TaskFormComponent
TaskFormComponent  ──── @Output ───►  TaskListComponent (close event)
```

---

## 📄 File 1 — `models/task.model.ts`

TypeScript interfaces and enums that define the shape of data.

```typescript
export interface TaskItem {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;       // Optional
  createdAt: string;
  updatedAt?: string;     // Optional
}

export interface TaskItemDto {
  title: string;
  description: string;
  status: number;         // 0=Pending, 1=InProgress, 2=Done
  priority: number;       // 0=Low, 1=Medium, 2=High
  dueDate?: string;
}

export enum TaskStatus {
  Pending    = 'Pending',
  InProgress = 'InProgress',
  Done       = 'Done'
}

export enum TaskPriority {
  Low    = 'Low',
  Medium = 'Medium',
  High   = 'High'
}
```

| Interface | Used For |
|-----------|----------|
| `TaskItem` | Data received FROM the backend |
| `TaskItemDto` | Data sent TO the backend |

---

## 📄 File 2 — `services/task.service.ts`

Service that handles all HTTP communication with the backend API.

```typescript
@Injectable({ providedIn: 'root' })
export class TaskService {
  private apiUrl = 'http://localhost:5000/api/tasks';

  constructor(private http: HttpClient) {}

  getAll(): Observable<TaskItem[]> {
    return this.http.get<TaskItem[]>(this.apiUrl);
  }

  getById(id: number): Observable<TaskItem> {
    return this.http.get<TaskItem>(`${this.apiUrl}/${id}`);
  }

  create(dto: TaskItemDto): Observable<TaskItem> {
    return this.http.post<TaskItem>(this.apiUrl, dto);
  }

  update(id: number, dto: TaskItemDto): Observable<TaskItem> {
    return this.http.put<TaskItem>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

| Method | HTTP | Endpoint | Description |
|--------|------|----------|-------------|
| `getAll()` | GET | `/api/tasks` | Fetch all tasks |
| `getById(id)` | GET | `/api/tasks/{id}` | Fetch one task |
| `create(dto)` | POST | `/api/tasks` | Create new task |
| `update(id, dto)` | PUT | `/api/tasks/{id}` | Update task |
| `delete(id)` | DELETE | `/api/tasks/{id}` | Delete task |

**Observable:**
- All methods return `Observable<T>` from RxJS
- `.subscribe()` is called in the component to get the data
- Example: `this.taskService.getAll().subscribe(tasks => this.tasks = tasks)`

---

## 📄 File 3 — `components/task-list/task-list.component.ts`

Main component that displays all tasks with filter functionality.

```typescript
export class TaskListComponent implements OnInit {
  tasks: TaskItem[] = [];           // All tasks from API
  filteredTasks: TaskItem[] = [];   // Tasks after filter applied
  filterStatus = '';                // Selected status filter
  filterPriority = '';              // Selected priority filter
  selectedTask: TaskItem | null = null;  // Task being edited
  showForm = false;                 // Show/hide form modal

  ngOnInit(): void {
    this.loadTasks();               // Load tasks on component init
  }

  loadTasks(): void {
    this.taskService.getAll().subscribe(tasks => {
      this.tasks = tasks;
      this.applyFilter();
    });
  }

  applyFilter(): void {
    this.filteredTasks = this.tasks.filter(t => {
      const statusMatch   = this.filterStatus   ? t.status   === this.filterStatus   : true;
      const priorityMatch = this.filterPriority ? t.priority === this.filterPriority : true;
      return statusMatch && priorityMatch;
    });
  }

  openCreate(): void { this.selectedTask = null; this.showForm = true; }
  openEdit(task: TaskItem): void { this.selectedTask = task; this.showForm = true; }
  onFormClose(): void { this.showForm = false; this.loadTasks(); }

  delete(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.delete(id).subscribe(() => this.loadTasks());
    }
  }
}
```

---

## 📄 File 4 — `components/task-list/task-list.component.html`

HTML template with Angular directives.

```html
<!-- Header -->
<div class="header">
  <h1>📋 Task Manager</h1>
  <button (click)="openCreate()">+ New Task</button>
</div>

<!-- Filters -->
<select [(ngModel)]="filterStatus" (change)="applyFilter()">
  <option value="">All Status</option>
  <option value="Pending">Pending</option>
  <option value="InProgress">In Progress</option>
  <option value="Done">Done</option>
</select>

<!-- Task Cards -->
<div *ngFor="let task of filteredTasks" class="task-card">
  <h3>{{ task.title }}</h3>
  <span [ngClass]="getStatusClass(task.status)">{{ task.status }}</span>
  <span [ngClass]="getPriorityClass(task.priority)">{{ task.priority }}</span>
  <p>{{ task.description }}</p>
  <p *ngIf="task.dueDate">📅 {{ task.dueDate | date:'mediumDate' }}</p>
  <button (click)="openEdit(task)">✏️ Edit</button>
  <button (click)="delete(task.id)">🗑️ Delete</button>
</div>

<!-- Form Modal -->
<app-task-form *ngIf="showForm" [task]="selectedTask" (close)="onFormClose()">
</app-task-form>
```

**Angular Directives Used:**

| Directive | Purpose |
|-----------|---------|
| `*ngFor` | Loop — render one card per task |
| `*ngIf` | Conditional — show form only when `showForm=true` |
| `[(ngModel)]` | Two-way binding — sync dropdown with variable |
| `(click)` | Event binding — call function on button click |
| `[ngClass]` | Dynamic CSS class based on status/priority |
| `{{ }}` | Interpolation — display variable value |
| `\| date` | Pipe — format date string |
| `[task]` | Input binding — pass task to child component |
| `(close)` | Output binding — receive event from child |

---

## 📄 File 5 — `components/task-form/task-form.component.ts`

Modal form component for both **Create** and **Edit** modes.

```typescript
export class TaskFormComponent implements OnInit {
  @Input() task: TaskItem | null = null;   // null = Create, task = Edit
  @Output() close = new EventEmitter<void>();

  form!: FormGroup;
  isEdit = false;

  ngOnInit(): void {
    this.isEdit = !!this.task;
    this.form = this.fb.group({
      title:       [this.task?.title || '',       [Validators.required, Validators.maxLength(200)]],
      description: [this.task?.description || '', Validators.maxLength(1000)],
      status:      [this.task ? this.getStatusIndex(this.task.status) : 0],
      priority:    [this.task ? this.getPriorityIndex(this.task.priority) : 1],
      dueDate:     [this.task?.dueDate ? this.task.dueDate.substring(0, 10) : '']
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    const dto = { ...this.form.value };
    if (!dto.dueDate) delete dto.dueDate;

    const request = this.isEdit
      ? this.taskService.update(this.task!.id, dto)
      : this.taskService.create(dto);

    request.subscribe(() => this.close.emit());
  }

  cancel(): void { this.close.emit(); }
}
```

**How Create vs Edit works:**

| Mode | `@Input() task` | `isEdit` | On Submit |
|------|----------------|----------|-----------|
| Create | `null` | `false` | Calls `create()` |
| Edit | `TaskItem` | `true` | Calls `update()` |

---

## 📄 File 6 — `app.module.ts`

Root module — registers all components, imports required modules.

```typescript
@NgModule({
  declarations: [
    AppComponent,
    TaskListComponent,
    TaskFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,      // For HTTP calls
    ReactiveFormsModule,   // For Reactive Forms
    FormsModule            // For [(ngModel)]
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

---

## 📦 NPM Packages

| Package | Version | Purpose |
|---------|---------|---------|
| `@angular/core` | ^15.2.0 | Angular framework |
| `@angular/forms` | ^15.2.0 | Reactive + Template forms |
| `@angular/common/http` | ^15.2.0 | HTTP client |
| `rxjs` | ~7.5.0 | Observables |
| `typescript` | ~4.9.4 | TypeScript language |
| `jasmine-core` | ~4.5.0 | Test framework |
| `karma` | ~6.4.0 | Test runner |

---

## ▶️ How to Run

```bash
cd TaskManager.Client
npm install
ng serve
```

App runs on: `http://localhost:4200`
