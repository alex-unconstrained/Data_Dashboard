import React from 'react';
import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { Card } from './Card'; // Ensure Card component exists

const ComparisonView = ({ selectedStudentsData }) => {
  if (selectedStudentsData.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-gray-500">No students selected for comparison.</p>
      </Card>
    );
  }

  // Prepare data for Radar Chart (Writing Level and F&P Level)
  const radarData = selectedStudentsData.map(student => ({
    name: student['Student Name'],
    Writing: parseInt(student['Writing Level']) || 0,
    FV: fpToNum(student['F&P Level']) || 0,
  }));

  // Prepare data for side-by-side WIDA scores
  const widaData = selectedStudentsData.map(student => ({
    name: student['Student Name'],
    Writing: parseInt(student['Writing Level']) || 0,
    FP: fpToNum(student['F&P Level']) || 0,
  }));

  // Helper function to convert F&P Level to numeric
  const fpToNum = (level) => {
    if (!level) return 0;
    const levels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return levels.indexOf(level) + 1;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">WIDA Scores Comparison</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis />
              {selectedStudentsData.map((student, index) => (
                <Radar
                  key={index}
                  name={student['Student Name']}
                  dataKey="Writing"
                  stroke={getColor(index)}
                  fill={getColor(index)}
                  fillOpacity={0.6}
                />
              ))}
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Side-by-Side WIDA Scores</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={widaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Writing" fill="#3b82f6" />
              <Bar dataKey="FP" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">F&P Level Tracking</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={widaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="Writing" stroke="#3b82f6" name="Writing Level" />
              <Line type="monotone" dataKey="FP" stroke="#ef4444" name="F&P Level" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

// Helper function to assign colors to students
const getColor = (index) => {
  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#f43f5e'];
  return COLORS[index % COLORS.length];
};

export default ComparisonView; 