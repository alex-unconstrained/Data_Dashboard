import React, { useContext } from 'react';
import { DataContext } from '../context/DataContext';
import { Card } from './Card';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const LanguageAnalysis = () => {
  const { data, loading, error } = useContext(DataContext);

  if (loading) return <div>Loading Language Analysis...</div>;
  if (error) return <div>Error: {error}</div>;

  // Calculate counts and average EAL levels per language
  const languageStats = data.reduce((acc, student) => {
    const lang = student['Home Language'] || 'Unknown';
    const ealLevel = student['Current EAL Level'] || 'Unknown';

    if (!acc[lang]) {
      acc[lang] = {
        language: lang,
        count: 0,
        ealLevels: {},
      };
    }
    acc[lang].count += 1;
    acc[lang].ealLevels[ealLevel] = (acc[lang].ealLevels[ealLevel] || 0) + 1;

    return acc;
  }, {});

  const chartData = Object.values(languageStats);

  return (
    <div className="space-y-6">
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Students per Home Language</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="language" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">EAL Levels per Home Language</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="language" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={(data) => data.ealLevels['BEAL'] || 0} name="BEAL" stackId="a" fill="#1F77B4" />
              <Bar dataKey={(data) => data.ealLevels['IEAL'] || 0} name="IEAL" stackId="a" fill="#FF7F0E" />
              <Bar dataKey={(data) => data.ealLevels['MEAL1'] || 0} name="MEAL1" stackId="a" fill="#2CA02C" />
              <Bar dataKey={(data) => data.ealLevels['MEAL2'] || 0} name="MEAL2" stackId="a" fill="#D62728" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default LanguageAnalysis;
