using Microsoft.AspNetCore.Mvc;
using TaskManager.API.DTOs;
using TaskManager.API.Models;
using TaskManager.API.Repositories;

namespace TaskManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ITaskRepository _repo;

    public TasksController(ITaskRepository repo) => _repo = repo;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _repo.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var task = await _repo.GetByIdAsync(id);
        return task is null ? NotFound() : Ok(task);
    }

    [HttpPost]
    public async Task<IActionResult> Create(TaskItemDto dto)
    {
        var task = MapFromDto(dto);
        var created = await _repo.CreateAsync(task);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, TaskItemDto dto)
    {
        var task = MapFromDto(dto);
        var updated = await _repo.UpdateAsync(id, task);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _repo.DeleteAsync(id);
        return result ? NoContent() : NotFound();
    }

    private static TaskItem MapFromDto(TaskItemDto dto) => new()
    {
        Title = dto.Title,
        Description = dto.Description,
        Status = (TaskManager.API.Models.TaskStatus)dto.Status,
        Priority = (TaskPriority)dto.Priority,
        DueDate = dto.DueDate.HasValue
            ? DateTime.SpecifyKind(dto.DueDate.Value, DateTimeKind.Utc)
            : null
    };
}
