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
    // First, let's fix the data processing for Writing Level and F&P Level
    const processStudentData = (student) => {
      // Extract numeric writing level
      const writingLevel = student['Writing Level'];
      let numericWriting = 0;
      
      if (writingLevel) {
        const match = writingLevel.match(/W:\s*(\d+)/);
        numericWriting = match ? parseInt(match[1]) : 0;
      }
  
      // Process F&P Level
      const fpLevel = student['F&P Level'];
      const numericFP = fpToNum(fpLevel);
  
      return {
        name: student['Student Name'],
        Writing: numericWriting,
        Reading: numericFP,
        FP: numericFP
      };
    };
  
    if (!selectedStudentsData || selectedStudentsData.length === 0) {
      return (
        <Card className="p-6">
          <p className="text-gray-500">No students selected for comparison.</p>
        </Card>
      );
    }
  
    // Process the data for all charts
    const processedData = selectedStudentsData.map(processStudentData);
  
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-text">Academic Progress Comparison</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={processedData}>
                <PolarGrid stroke="#d1d5db" />
                <PolarAngleAxis dataKey="name" stroke="#1F2937" />
                <PolarRadiusAxis stroke="#1F2937" />
                <Radar
                  name="Writing Level"
                  dataKey="Writing"
                  stroke={getColor(0)}
                  fill={getColor(0)}
                  fillOpacity={0.6}
                />
                <Radar
                  name="Reading Level"
                  dataKey="Reading"
                  stroke={getColor(1)}
                  fill={getColor(1)}
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
  
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-text">Writing and Reading Levels</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processedData}>
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
                <Bar dataKey="Writing" fill="#2563EB" name="Writing Level" />
                <Bar dataKey="FP" fill="#10B981" name="Reading Level" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
  
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-text">Progress Tracking</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={processedData}>
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
                <Line 
                  type="monotone" 
                  dataKey="Writing" 
                  stroke="#2563EB" 
                  name="Writing Level"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="FP" 
                  stroke="#10B981" 
                  name="Reading Level"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    );
  };
  
  export default ComparisonView;