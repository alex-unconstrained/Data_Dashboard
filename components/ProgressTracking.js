import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { Card } from './Card';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const ProgressTracking = () => {
  const { data, loading, error } = useContext(DataContext);

  if (loading) return <div>Loading Progress Tracking...</div>;
  if (error) return <div>Error: {error}</div>;

  // Aggregate writing levels over grades
  const gradeProgress = data.reduce((acc, student) => {
    const grade = `Grade ${student['Grade Level']}`;
    const writing = parseFloat(student['Writing Level']) || 0;

    if (!acc[grade]) {
      acc[grade] = { grade, totalWriting: 0, count: 0 };
    }
    acc[grade].totalWriting += writing;
    acc[grade].count += 1;
    return acc;
  }, {});

  const chartData = Object.values(gradeProgress).map((entry) => ({
    grade: entry.grade,
    averageWriting: parseFloat((entry.totalWriting / entry.count).toFixed(2)),
  }));

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Progress Tracking</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
            <XAxis dataKey="grade" stroke="#1F2937" />
            <YAxis stroke="#1F2937" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="averageWriting" stroke="#2563EB" name="Avg Writing Level" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ProgressTracking;
