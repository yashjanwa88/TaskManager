import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskItem } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  @Input() task: TaskItem | null = null;
  @Output() close = new EventEmitter<void>();

  form!: FormGroup;
  isEdit = false;

  constructor(private fb: FormBuilder, private taskService: TaskService) {}

  ngOnInit(): void {
    this.isEdit = !!this.task;
    this.form = this.fb.group({
      title: [this.task?.title || '', [Validators.required, Validators.maxLength(200)]],
      description: [this.task?.description || '', Validators.maxLength(1000)],
      status: [this.task ? this.getStatusIndex(this.task.status) : 0],
      priority: [this.task ? this.getPriorityIndex(this.task.priority) : 1],
      dueDate: [this.task?.dueDate ? this.task.dueDate.substring(0, 10) : '']
    });
  }

  getStatusIndex(status: string): number {
    return ['Pending', 'InProgress', 'Done'].indexOf(status);
  }

  getPriorityIndex(priority: string): number {
    return ['Low', 'Medium', 'High'].indexOf(priority);
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

  cancel(): void {
    this.close.emit();
  }
}
