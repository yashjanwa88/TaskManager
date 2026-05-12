import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { TaskFormComponent } from './task-form.component';
import { TaskService } from '../../services/task.service';
import { TaskItem, TaskStatus, TaskPriority } from '../../models/task.model';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;

  const mockTask: TaskItem = {
    id: 1, title: 'Existing Task', description: 'Old Desc',
    status: TaskStatus.InProgress, priority: TaskPriority.High, createdAt: ''
  };

  beforeEach(async () => {
    taskServiceSpy = jasmine.createSpyObj('TaskService', ['create', 'update']);
    taskServiceSpy.create.and.returnValue(of(mockTask));
    taskServiceSpy.update.and.returnValue(of(mockTask));

    await TestBed.configureTestingModule({
      declarations: [TaskFormComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: TaskService, useValue: taskServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
  });

  // ---------------------------------------------------------------
  // CREATE MODE
  // ---------------------------------------------------------------
  describe('Create Mode', () => {
    beforeEach(() => {
      component.task = null;
      fixture.detectChanges();
    });

    it('should create', () => expect(component).toBeTruthy());

    it('isEdit should be false when no task input', () => {
      expect(component.isEdit).toBeFalse();
    });

    it('form should be invalid when title is empty', () => {
      component.form.get('title')!.setValue('');
      expect(component.form.invalid).toBeTrue();
    });

    it('form should be valid when title is provided', () => {
      component.form.get('title')!.setValue('New Task');
      expect(component.form.valid).toBeTrue();
    });

    it('submit() should call create() when form is valid', () => {
      component.form.get('title')!.setValue('New Task');
      component.submit();
      expect(taskServiceSpy.create).toHaveBeenCalled();
    });

    it('submit() should NOT call create() when form is invalid', () => {
      component.form.get('title')!.setValue('');
      component.submit();
      expect(taskServiceSpy.create).not.toHaveBeenCalled();
    });

    it('submit() should emit close after create', () => {
      spyOn(component.close, 'emit');
      component.form.get('title')!.setValue('New Task');
      component.submit();
      expect(component.close.emit).toHaveBeenCalled();
    });

    it('cancel() should emit close', () => {
      spyOn(component.close, 'emit');
      component.cancel();
      expect(component.close.emit).toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------
  // EDIT MODE
  // ---------------------------------------------------------------
  describe('Edit Mode', () => {
    beforeEach(() => {
      component.task = mockTask;
      fixture.detectChanges();
    });

    it('isEdit should be true when task input is provided', () => {
      expect(component.isEdit).toBeTrue();
    });

    it('form should be pre-filled with task values', () => {
      expect(component.form.get('title')!.value).toBe('Existing Task');
      expect(component.form.get('description')!.value).toBe('Old Desc');
    });

    it('submit() should call update() not create()', () => {
      component.form.get('title')!.setValue('Updated Task');
      component.submit();
      expect(taskServiceSpy.update).toHaveBeenCalledWith(1, jasmine.any(Object));
      expect(taskServiceSpy.create).not.toHaveBeenCalled();
    });

    it('getStatusIndex() should return correct index', () => {
      expect(component.getStatusIndex('Pending')).toBe(0);
      expect(component.getStatusIndex('InProgress')).toBe(1);
      expect(component.getStatusIndex('Done')).toBe(2);
    });

    it('getPriorityIndex() should return correct index', () => {
      expect(component.getPriorityIndex('Low')).toBe(0);
      expect(component.getPriorityIndex('Medium')).toBe(1);
      expect(component.getPriorityIndex('High')).toBe(2);
    });
  });
});
