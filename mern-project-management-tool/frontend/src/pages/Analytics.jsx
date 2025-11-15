import React, { useState, useEffect } from "react";
import { analyticsAPI } from "../services/api";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // For now, we'll show sample data
      // In a real app, you would fetch from the API
      setAnalytics({
        totalProjects: 5,
        completedTasks: 24,
        totalTime: 1250, // minutes
        teamPerformance: [
          { name: "John Doe", completed: 8, time: 320 },
          { name: "Jane Smith", completed: 6, time: 280 },
          { name: "Bob Johnson", completed: 10, time: 450 },
        ],
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Analytics</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Total Projects
          </h3>
          <p className="text-3xl font-bold text-primary-600">
            {analytics.totalProjects}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Completed Tasks
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {analytics.completedTasks}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Total Time Tracked
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {Math.round(analytics.totalTime / 60)} hours
          </p>
        </div>
      </div>

      {/* Team Performance */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Team Performance
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {analytics.teamPerformance.map((member, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h4 className="font-medium text-gray-900">{member.name}</h4>
                  <p className="text-sm text-gray-600">
                    {member.completed} tasks completed
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {Math.round(member.time / 60)} hours
                  </p>
                  <p className="text-sm text-gray-600">Time spent</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Task Distribution</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
          <p className="text-gray-500">
            Chart.js charts will be implemented here
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
