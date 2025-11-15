import React, { useState, useEffect } from "react";
import { timeLogAPI } from "../services/api";
import { formatTime } from "../utils/format";

const TimeTracker = ({ taskId }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentLog, setCurrentLog] = useState(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    checkRunningTimer();
  }, []);

  const checkRunningTimer = async () => {
    try {
      const response = await timeLogAPI.getMyLogs();
      const runningLog = response.data.find((log) => log.isRunning);
      if (runningLog) {
        setCurrentLog(runningLog);
        setIsRunning(true);
      }
    } catch (error) {
      console.error("Error checking running timer:", error);
    }
  };

  const startTimer = async () => {
    try {
      const response = await timeLogAPI.start({
        taskId,
        description,
      });
      setCurrentLog(response.data);
      setIsRunning(true);
      setDescription("");
    } catch (error) {
      console.error("Error starting timer:", error);
    }
  };

  const stopTimer = async () => {
    try {
      await timeLogAPI.stop();
      setIsRunning(false);
      setCurrentLog(null);
    } catch (error) {
      console.error("Error stopping timer:", error);
    }
  };

  const getElapsedTime = () => {
    if (!currentLog) return 0;
    const start = new Date(currentLog.startTime);
    const now = new Date();
    return Math.round((now - start) / (1000 * 60)); // minutes
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="font-semibold mb-3">Time Tracker</h3>

      {isRunning ? (
        <div className="space-y-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {formatTime(getElapsedTime())}
            </div>
            <p className="text-sm text-gray-600">Time elapsed</p>
          </div>
          <button
            onClick={stopTimer}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded transition duration-200"
          >
            Stop Timer
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What are you working on?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            rows="3"
          />
          <button
            onClick={startTimer}
            disabled={!description.trim()}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white py-2 rounded transition duration-200"
          >
            Start Timer
          </button>
        </div>
      )}
    </div>
  );
};

export default TimeTracker;
