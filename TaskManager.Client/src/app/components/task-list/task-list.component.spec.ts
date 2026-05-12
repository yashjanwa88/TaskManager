import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../services/task.service';
import { TaskItem, TaskStatus, TaskPriority } from '../../models/task.model';
import { TaskFormComponent } from '../task-form/task-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;

  const mockTasks: TaskItem[] = [
    { id: 1, title: 'Task A', description: '', status: TaskStatus.Pending,    priority: TaskPriority.High,   createdAt: '' },
    { id: 2, title: 'Task B', description: '', status: TaskStatus.Done,       priority: TaskPriority.Low,    createdAt: '' },
    { id: 3, title: 'Task C', description: '', status: TaskStatus.InProgress, priority: TaskPriority.Medium, createdAt: '' }
  ];

  beforeEach(async () => {
    taskServiceSpy = jasmine.createSpyObj('TaskService', ['getAll', 'delete']);
    taskServiceSpy.getAll.and.returnValue(of(mockTasks));
    taskServiceSpy.delete.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      declarations: [TaskListComponent, TaskFormComponent],
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule],
      providers: [{ provide: TaskService, useValue: taskServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks on init', () => {
    expect(taskServiceSpy.getAll).toHaveBeenCalled();
    expect(component.tasks.length).toBe(3);
    expect(component.filteredTasks.length).toBe(3);
  });

  it('should filter tasks by status', () => {
    component.filterStatus = 'Pending';
    component.applyFilter();
    expect(component.filteredTasks.length).toBe(1);
    expect(component.filteredTasks[0].title).toBe('Task A');
  });

  it('should filter tasks by priority', () => {
    component.filterPriority = 'Low';
    component.applyFilter();
    expect(component.filteredTasks.length).toBe(1);
    expect(component.filteredTasks[0].title).toBe('Task B');
  });

  it('should filter tasks by both status and priority', () => {
    component.filterStatus = 'Done';
    component.filterPriority = 'Low';
    component.applyFilter();
    expect(component.filteredTasks.length).toBe(1);
  });

  it('should return empty list when no tasks match filter', () => {
    component.filterStatus = 'Done';
    component.filterPriority = 'High';
    component.applyFilter();
    expect(component.filteredTasks.length).toBe(0);
  });

  it('openCreate() should set showForm=true and selectedTask=null', () => {
    component.openCreate();
    expect(component.showForm).toBeTrue();
    expect(component.selectedTask).toBeNull();
  });

  it('openEdit() should set showForm=true and selectedTask to given task', () => {
    component.openEdit(mockTasks[0]);
    expect(component.showForm).toBeTrue();
    expect(component.selectedTask).toEqual(mockTasks[0]);
  });

  it('onFormClose() should hide form and reload tasks', () => {
    component.showForm = true;
    component.onFormClose();
    expect(component.showForm).toBeFalse();
    expect(taskServiceSpy.getAll).toHaveBeenCalledTimes(2);
  });

  it('getStatusClass() should return correct badge class', () => {
    expect(component.getStatusClass('Pending')).toBe('badge-pending');
    expect(component.getStatusClass('InProgress')).toBe('badge-inprogress');
    expect(component.getStatusClass('Done')).toBe('badge-done');
    expect(component.getStatusClass('Unknown')).toBe('');
  });

  it('getPriorityClass() should return correct badge class', () => {
    expect(component.getPriorityClass('Low')).toBe('badge-low');
    expect(component.getPriorityClass('Medium')).toBe('badge-medium');
    expect(component.getPriorityClass('High')).toBe('badge-high');
    expect(component.getPriorityClass('Unknown')).toBe('');
  });
});
