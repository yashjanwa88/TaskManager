using TaskManager.API.Models;

namespace TaskManager.Tests;

[TestClass]
public class TaskItemModelTests
{
    [TestMethod]
    public void TaskItem_DefaultStatus_IsPending()
    {
        var task = new TaskItem();
        Assert.AreEqual(TaskManager.API.Models.TaskStatus.Pending, task.Status);
    }

    [TestMethod]
    public void TaskItem_DefaultPriority_IsMedium()
    {
        var task = new TaskItem();
        Assert.AreEqual(TaskPriority.Medium, task.Priority);
    }

    [TestMethod]
    public void TaskItem_DefaultTitle_IsEmptyString()
    {
        var task = new TaskItem();
        Assert.AreEqual(string.Empty, task.Title);
    }

    [TestMethod]
    public void TaskItem_CreatedAt_IsUtc()
    {
        var task = new TaskItem();
        Assert.AreEqual(DateTimeKind.Utc, task.CreatedAt.Kind);
    }

    [TestMethod]
    public void TaskItem_DueDate_IsNullByDefault()
    {
        var task = new TaskItem();
        Assert.IsNull(task.DueDate);
    }

    [TestMethod]
    public void TaskItem_CanSetAllProperties()
    {
        var due = DateTime.UtcNow.AddDays(5);
        var task = new TaskItem
        {
            Id          = 10,
            Title       = "My Task",
            Description = "Some description",
            Status      = TaskManager.API.Models.TaskStatus.InProgress,
            Priority    = TaskPriority.High,
            DueDate     = due
        };

        Assert.AreEqual(10,                                              task.Id);
        Assert.AreEqual("My Task",                                       task.Title);
        Assert.AreEqual("Some description",                              task.Description);
        Assert.AreEqual(TaskManager.API.Models.TaskStatus.InProgress,   task.Status);
        Assert.AreEqual(TaskPriority.High,                               task.Priority);
        Assert.AreEqual(due,                                             task.DueDate);
    }
}
