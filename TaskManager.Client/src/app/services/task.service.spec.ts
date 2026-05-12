import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { TaskItem, TaskItemDto, TaskStatus, TaskPriority } from '../models/task.model';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:5000/api/tasks';

  const mockTask: TaskItem = {
    id: 1, title: 'Test Task', description: 'Desc',
    status: TaskStatus.Pending, priority: TaskPriority.Medium,
    createdAt: new Date().toISOString()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAll() should return task list via GET', () => {
    service.getAll().subscribe(tasks => {
      expect(tasks.length).toBe(1);
      expect(tasks[0].title).toBe('Test Task');
    });
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush([mockTask]);
  });

  it('getById() should return single task via GET', () => {
    service.getById(1).subscribe(task => {
      expect(task.id).toBe(1);
      expect(task.title).toBe('Test Task');
    });
    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTask);
  });

  it('create() should POST and return created task', () => {
    const dto: TaskItemDto = { title: 'New Task', description: 'Desc', status: 0, priority: 1 };
    service.create(dto).subscribe(task => {
      expect(task.id).toBe(1);
      expect(task.title).toBe('Test Task');
    });
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush(mockTask);
  });

  it('update() should PUT and return updated task', () => {
    const dto: TaskItemDto = { title: 'Updated', description: 'Desc', status: 1, priority: 2 };
    service.update(1, dto).subscribe(task => {
      expect(task.id).toBe(1);
    });
    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(dto);
    req.flush(mockTask);
  });

  it('delete() should send DELETE request', () => {
    service.delete(1).subscribe();
    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
