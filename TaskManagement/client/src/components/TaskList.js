import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { useTaskContext } from "../Context/TaskContext";

const TaskItem = ({ task }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task._id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getPriorityColor = (dueDate) => {
    if (!dueDate) return "bg-gray-100";
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "bg-red-100 border-red-300";
    if (diffDays === 0) return "bg-orange-100 border-orange-300";
    if (diffDays <= 2) return "bg-yellow-100 border-yellow-300";
    return "bg-gray-100 border-gray-200";
  };

  return (
    <div
      ref={drag}
      className={`p-4 mb-3 rounded-xl border-2 cursor-move transform transition-all duration-200 hover:scale-105 hover:shadow-lg ${
        isDragging
          ? "opacity-50 bg-blue-50 border-blue-300 rotate-2"
          : `${getPriorityColor(task.dueDate)}`
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-gray-800 text-lg">{task.title}</h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            task.status === "completed"
              ? "bg-green-500 text-white"
              : task.status === "inprogress"
              ? "bg-yellow-500 text-white"
              : "bg-gray-500 text-white"
          }`}
        >
          {task.status}
        </span>
      </div>

      {task.description && (
        <p className="text-gray-600 mb-3 text-sm leading-relaxed">
          {task.description}
        </p>
      )}

      {task.dueDate && (
        <div className="flex items-center text-sm text-gray-500">
          <span className="mr-1">📅</span>
          <span>Due: {formatDate(task.dueDate)}</span>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-200 border-dashed">
        <div className="text-xs text-gray-400">
          Drag to move between columns
        </div>
      </div>
    </div>
  );
};

const TaskColumn = ({ status, children }) => {
  const { updateTaskStatus } = useTaskContext();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item) => updateTaskStatus(item.id, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const getColumnStyles = (status) => {
    switch (status) {
      case "todo":
        return "bg-red-50 border-red-200";
      case "inprogress":
        return "bg-yellow-50 border-yellow-200";
      case "completed":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "todo":
        return "To Do 📋";
      case "inprogress":
        return "In Progress 🚀";
      case "completed":
        return "Completed ✅";
      default:
        return status;
    }
  };

  const getTaskCount = React.useMemo(() => {
    return React.Children.count(children);
  }, [children]);

  return (
    <div
      ref={drop}
      className={`p-6 rounded-2xl border-2 min-h-[600px] transition-all duration-300 ${
        isOver ? "scale-105 bg-opacity-100 shadow-xl" : "bg-opacity-80"
      } ${getColumnStyles(status)}`}
    >
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {getStatusText(status)}
        </h2>
        <div className="w-12 h-1 bg-current mx-auto opacity-30 rounded-full"></div>
        <div className="mt-2 text-sm text-gray-600 font-semibold">
          {getTaskCount} {getTaskCount === 1 ? "task" : "tasks"}
        </div>
      </div>

      <div className="space-y-3">{children}</div>

      {getTaskCount === 0 && (
        <div className="text-center text-gray-400 mt-8">
          <div className="text-4xl mb-2">📭</div>
          <p>No tasks here</p>
          <p className="text-sm">Drop tasks in this column</p>
        </div>
      )}
    </div>
  );
};

const TaskList = () => {
  const { tasks } = useTaskContext();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Your Task Board
        </h2>
        <p className="text-gray-600">
          Drag and drop tasks between columns to update their status
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TaskColumn status="todo">
          {tasks
            .filter((task) => task.status === "todo")
            .map((task) => (
              <TaskItem key={task._id} task={task} />
            ))}
        </TaskColumn>

        <TaskColumn status="inprogress">
          {tasks
            .filter((task) => task.status === "inprogress")
            .map((task) => (
              <TaskItem key={task._id} task={task} />
            ))}
        </TaskColumn>

        <TaskColumn status="completed">
          {tasks
            .filter((task) => task.status === "completed")
            .map((task) => (
              <TaskItem key={task._id} task={task} />
            ))}
        </TaskColumn>
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">
            No tasks yet
          </h3>
          <p className="text-gray-600 mb-6">
            Click "Add Task" to create your first task!
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskList;
