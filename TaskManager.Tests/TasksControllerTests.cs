using Microsoft.AspNetCore.Mvc;
using Moq;
using TaskManager.API.Controllers;
using TaskManager.API.DTOs;
using TaskManager.API.Models;
using TaskManager.API.Repositories;

namespace TaskManager.Tests;

[TestClass]
public class TasksControllerTests
{
    private Mock<ITaskRepository> _mockRepo = null!;
    private TasksController _controller = null!;

    [TestInitialize]
    public void Setup()
    {
        _mockRepo = new Mock<ITaskRepository>();
        _controller = new TasksController(_mockRepo.Object);
    }

    // ---------------------------------------------------------------
    // GET ALL
    // ---------------------------------------------------------------
    [TestMethod]
    public async Task GetAll_ReturnsOk_WithTaskList()
    {
        var tasks = new List<TaskItem>
        {
            new() { Id = 1, Title = "Task 1", Status = TaskManager.API.Models.TaskStatus.Pending, Priority = TaskPriority.High },
            new() { Id = 2, Title = "Task 2", Status = TaskManager.API.Models.TaskStatus.Done,    Priority = TaskPriority.Low  }
        };
        _mockRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(tasks);

        var result = await _controller.GetAll();

        var ok = result as OkObjectResult;
        Assert.IsNotNull(ok);
        Assert.AreEqual(200, ok.StatusCode);
        var returned = ok.Value as List<TaskItem>;
        Assert.AreEqual(2, returned!.Count);
    }

    [TestMethod]
    public async Task GetAll_ReturnsOk_WithEmptyList()
    {
        _mockRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<TaskItem>());

        var result = await _controller.GetAll();

        var ok = result as OkObjectResult;
        Assert.IsNotNull(ok);
        Assert.AreEqual(200, ok.StatusCode);
    }

    // ---------------------------------------------------------------
    // GET BY ID
    // ---------------------------------------------------------------
    [TestMethod]
    public async Task GetById_ReturnsOk_WhenTaskExists()
    {
        var task = new TaskItem { Id = 1, Title = "Test Task" };
        _mockRepo.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(task);

        var result = await _controller.GetById(1);

        var ok = result as OkObjectResult;
        Assert.IsNotNull(ok);
        Assert.AreEqual(200, ok.StatusCode);
        Assert.AreEqual(task, ok.Value);
    }

    [TestMethod]
    public async Task GetById_ReturnsNotFound_WhenTaskDoesNotExist()
    {
        _mockRepo.Setup(r => r.GetByIdAsync(99)).ReturnsAsync((TaskItem?)null);

        var result = await _controller.GetById(99);

        Assert.IsInstanceOfType(result, typeof(NotFoundResult));
    }

    // ---------------------------------------------------------------
    // CREATE
    // ---------------------------------------------------------------
    [TestMethod]
    public async Task Create_ReturnsCreated_WithNewTask()
    {
        var dto = new TaskItemDto { Title = "New Task", Description = "Desc", Status = 0, Priority = 1 };
        var created = new TaskItem { Id = 1, Title = "New Task", Description = "Desc" };
        _mockRepo.Setup(r => r.CreateAsync(It.IsAny<TaskItem>())).ReturnsAsync(created);

        var result = await _controller.Create(dto);

        var createdResult = result as CreatedAtActionResult;
        Assert.IsNotNull(createdResult);
        Assert.AreEqual(201, createdResult.StatusCode);
        Assert.AreEqual(created, createdResult.Value);
    }

    [TestMethod]
    public async Task Create_MapsDto_Correctly()
    {
        var dto = new TaskItemDto { Title = "Task", Description = "Desc", Status = 1, Priority = 2 };
        TaskItem? captured = null;
        _mockRepo.Setup(r => r.CreateAsync(It.IsAny<TaskItem>()))
                 .Callback<TaskItem>(t => captured = t)
                 .ReturnsAsync(new TaskItem { Id = 1 });

        await _controller.Create(dto);

        Assert.IsNotNull(captured);
        Assert.AreEqual("Task", captured!.Title);
        Assert.AreEqual(TaskManager.API.Models.TaskStatus.InProgress, captured.Status);
        Assert.AreEqual(TaskPriority.High, captured.Priority);
    }

    // ---------------------------------------------------------------
    // UPDATE
    // ---------------------------------------------------------------
    [TestMethod]
    public async Task Update_ReturnsOk_WhenTaskExists()
    {
        var dto = new TaskItemDto { Title = "Updated", Description = "Desc", Status = 2, Priority = 0 };
        var updated = new TaskItem { Id = 1, Title = "Updated" };
        _mockRepo.Setup(r => r.UpdateAsync(1, It.IsAny<TaskItem>())).ReturnsAsync(updated);

        var result = await _controller.Update(1, dto);

        var ok = result as OkObjectResult;
        Assert.IsNotNull(ok);
        Assert.AreEqual(200, ok.StatusCode);
        Assert.AreEqual(updated, ok.Value);
    }

    [TestMethod]
    public async Task Update_ReturnsNotFound_WhenTaskDoesNotExist()
    {
        var dto = new TaskItemDto { Title = "X", Status = 0, Priority = 0 };
        _mockRepo.Setup(r => r.UpdateAsync(99, It.IsAny<TaskItem>())).ReturnsAsync((TaskItem?)null);

        var result = await _controller.Update(99, dto);

        Assert.IsInstanceOfType(result, typeof(NotFoundResult));
    }

    // ---------------------------------------------------------------
    // DELETE
    // ---------------------------------------------------------------
    [TestMethod]
    public async Task Delete_ReturnsNoContent_WhenTaskExists()
    {
        _mockRepo.Setup(r => r.DeleteAsync(1)).ReturnsAsync(true);

        var result = await _controller.Delete(1);

        Assert.IsInstanceOfType(result, typeof(NoContentResult));
    }

    [TestMethod]
    public async Task Delete_ReturnsNotFound_WhenTaskDoesNotExist()
    {
        _mockRepo.Setup(r => r.DeleteAsync(99)).ReturnsAsync(false);

        var result = await _controller.Delete(99);

        Assert.IsInstanceOfType(result, typeof(NotFoundResult));
    }
}
