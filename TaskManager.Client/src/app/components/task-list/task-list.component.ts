import { Component, OnInit } from '@angular/core';
import { TaskItem, TaskStatus, TaskPriority } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: TaskItem[] = [];
  filteredTasks: TaskItem[] = [];
  filterStatus = '';
  filterPriority = '';
  selectedTask: TaskItem | null = null;
  showForm = false;

  TaskStatus = TaskStatus;
  TaskPriority = TaskPriority;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getAll().subscribe(tasks => {
      this.tasks = tasks;
      this.applyFilter();
    });
  }

  applyFilter(): void {
    this.filteredTasks = this.tasks.filter(t => {
      const statusMatch = this.filterStatus ? t.status === this.filterStatus : true;
      const priorityMatch = this.filterPriority ? t.priority === this.filterPriority : true;
      return statusMatch && priorityMatch;
    });
  }

  openCreate(): void {
    this.selectedTask = null;
    this.showForm = true;
  }

  openEdit(task: TaskItem): void {
    this.selectedTask = task;
    this.showForm = true;
  }

  onFormClose(): void {
    this.showForm = false;
    this.loadTasks();
  }

  delete(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.delete(id).subscribe(() => this.loadTasks());
    }
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      Pending: 'badge-pending',
      InProgress: 'badge-inprogress',
      Done: 'badge-done'
    };
    return map[status] || '';
  }

  getPriorityClass(priority: string): string {
    const map: Record<string, string> = {
      Low: 'badge-low',
      Medium: 'badge-medium',
      High: 'badge-high'
    };
    return map[priority] || '';
  }
}
