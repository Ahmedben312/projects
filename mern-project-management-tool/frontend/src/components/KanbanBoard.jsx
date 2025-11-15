import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { taskAPI } from "../services/api";
import { getStatusColor } from "../utils/format";

const KanbanBoard = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { id: "todo", title: "To Do", color: "bg-gray-200" },
    { id: "in-progress", title: "In Progress", color: "bg-blue-200" },
    { id: "review", title: "Review", color: "bg-purple-200" },
    { id: "done", title: "Done", color: "bg-green-200" },
  ];

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const response = await taskAPI.getByProject(projectId);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId) return;

    try {
      await taskAPI.updatePosition(draggableId, {
        status: destination.droppableId,
        position: destination.index,
      });

      setTasks((prev) =>
        prev.map((task) =>
          task._id === draggableId
            ? { ...task, status: destination.droppableId }
            : task
        )
      );
    } catch (error) {
      console.error("Error updating task position:", error);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading tasks...</div>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {columns.map((column) => (
          <div key={column.id} className="bg-gray-50 rounded-lg p-4">
            <h3
              className={`font-semibold text-lg mb-4 ${column.color} p-2 rounded`}
            >
              {column.title} (
              {tasks.filter((t) => t.status === column.id).length})
            </h3>
            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="min-h-96 space-y-3"
                >
                  {tasks
                    .filter((task) => task.status === column.id)
                    .map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                          >
                            <h4 className="font-medium text-gray-900">
                              {task.title}
                            </h4>
                            {task.assignee && (
                              <p className="text-sm text-gray-600 mt-1">
                                Assignee: {task.assignee.name}
                              </p>
                            )}
                            <div className="flex justify-between items-center mt-2">
                              <span
                                className={`px-2 py-1 rounded text-xs ${getStatusColor(
                                  task.priority
                                )}`}
                              >
                                {task.priority}
                              </span>
                              {task.dueDate && (
                                <span className="text-xs text-gray-500">
                                  Due:{" "}
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
