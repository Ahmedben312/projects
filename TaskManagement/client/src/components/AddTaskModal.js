import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { useTaskContext } from "../Context/TaskContext";
import "react-datepicker/dist/react-datepicker.css";

const AddTaskModal = ({ isOpen, closeModal }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const { addTask } = useTaskContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    await addTask(title, description, "todo", dueDate);
    setLoading(false);

    setTitle("");
    setDescription("");
    setDueDate(new Date());
    closeModal();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform animate-scale-in">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              Create New Task
            </h2>
            <button
              onClick={closeModal}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition duration-200 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <p className="text-gray-600 mt-1">Add details for your new task</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Task Title *
            </label>
            <input
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              placeholder="Add more details about this task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-none"
              rows="4"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Due Date
            </label>
            <DatePicker
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              dateFormat="MMMM d, yyyy"
              minDate={new Date()}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                  Creating...
                </div>
              ) : (
                "Create Task"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
