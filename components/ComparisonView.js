import React from 'react';
import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { Card } from './Card';

/**
 * Converts F&P Level to a numeric value.
 * @param {string} level - The F&P Level letter.
 * @returns {number} - Numeric representation.
 */
const fpToNum = (level) => {
  if (!level) return 0;
  const levels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const index = levels.indexOf(level.toUpperCase());
  return index !== -1 ? index + 1 : 0;
};

/**
 * Assigns a color based on the index.
 * @param {number} index 
 * @returns {string} 
 */
const getColor = (index) => {
  const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#3b82f6', '#f43f5e'];
  return COLORS[index % COLORS.length];
};

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
    Writing: parseInt(student['Writing Level'], 10) || 0,
    Reading: fpToNum(student['F&P Level']) || 0,
  }));

  // Prepare data for side-by-side WIDA scores
  const widaData = selectedStudentsData.map(student => ({
    name: student['Student Name'],
    Writing: parseInt(student['Writing Level'], 10) || 0,
    FP: fpToNum(student['F&P Level']) || 0,
  }));

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-text">WIDA Scores Comparison</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#d1d5db" />
              <PolarAngleAxis dataKey="name" stroke="#1F2937" />
              <PolarRadiusAxis stroke="#1F2937" />
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
        <h3 className="text-lg font-semibold mb-4 text-text">Side-by-Side WIDA Scores</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={widaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
              <XAxis dataKey="name" stroke="#1F2937" />
              <YAxis stroke="#1F2937" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                }}
              />
              <Legend />
              <Bar dataKey="Writing" fill="#2563EB" />
              <Bar dataKey="FP" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-text">F&P Level Tracking</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={widaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
              <XAxis dataKey="name" stroke="#1F2937" />
              <YAxis stroke="#1F2937" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="Writing" stroke="#2563EB" name="Writing Level" />
              <Line type="monotone" dataKey="FP" stroke="#10B981" name="F&P Level" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default ComparisonView; 