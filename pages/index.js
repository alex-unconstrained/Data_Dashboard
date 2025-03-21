import React, { useContext, useState } from 'react';
import { DataContext } from '../context/DataContext';
import DataGrid from '../components/DataGrid';
import LanguageAnalysis from '../components/LanguageAnalysis';
import ProgressTracking from '../components/ProgressTracking';
import SearchComponent from '../components/Search';
import TabButton from '../components/TabButton';
import GrowthIndicators from '../components/GrowthIndicators';
import Timeline from '../components/Timeline';
import ComparisonView from '../components/ComparisonView';
import { Card } from '../components/Card';
import { useSession, signIn } from 'next-auth/react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const {
    data,
    filteredData,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedGrade,
    setSelectedGrade,
    refreshData,
  } = useContext(DataContext);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Redirect to sign-in page if not authenticated
  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  if (!session) {
    signIn();
    return null;
  }

  const handleStudentSelect = (student) => {
    if (selectedStudents.find(s => s['Student Name'] === student['Student Name'])) {
      setSelectedStudents(selectedStudents.filter(s => s['Student Name'] !== student['Student Name']));
    } else {
      setSelectedStudents([...selectedStudents, student]);
    }
  };

  const handleSave = async (studentName, field, value) => {
    try {
      const response = await fetch('/api/students', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentName, field, value }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Update failed');
      }

      // Refresh the data context after successful update
      await refreshData();
    } catch (error) {
      console.error('Update failed:', error.message);
      alert('Failed to update student data: ' + error.message);
    }
  };

  // Dynamic growthData based on real data
  const calculateAverageGrowth = (field) => {
    const initialLevels = data.map(student => parseFloat(student[field] || 0));
    const average = initialLevels.reduce((sum, level) => sum + level, 0) / initialLevels.length || 0;
    return average.toFixed(2);
  };

  const growthData = [
    {
      label: 'Average Writing Level',
      value: calculateAverageGrowth('Writing Level'),
      trend: 'up',
    },
    {
      label: 'Average F&P Level',
      value: calculateAverageGrowth('F&P Level'),
      trend: 'up',
    },
    // Add more indicators as needed
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Student Selection</h2>
          <SearchComponent
            className="w-full mb-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="w-full border rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
          >
            <option value="all">All Grades</option>
            {['K', 1, 2, 3, 4, 5].map((grade) => (
              <option key={grade} value={grade}>
                Grade {grade}
              </option>
            ))}
          </select>
          <div className="max-h-screen overflow-y-auto">
            {filteredData.map((student) => (
              <div
                key={student['Student Name']}
                className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedStudents.find(s => s['Student Name'] === student['Student Name'])
                    ? 'bg-blue-50'
                    : ''
                }`}
                onClick={() => handleStudentSelect(student)}
              >
                <p className="font-medium">{student['Student Name']}</p>
                <p className="text-sm text-gray-500">
                  Grade {student['Grade Level']} | EAL Level: {student['Current EAL Level']}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">EAL Student Dashboard</h1>
              <p className="text-gray-500 mt-1">Tracking student progress and achievements</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
              Overview
            </TabButton>
            <TabButton active={activeTab === 'comparison'} onClick={() => setActiveTab('comparison')}>
              Student Comparison
            </TabButton>
            <TabButton active={activeTab === 'studentData'} onClick={() => setActiveTab('studentData')}>
              Student Data
            </TabButton>
            <TabButton active={activeTab === 'languageAnalysis'} onClick={() => setActiveTab('languageAnalysis')}>
              Language Analysis
            </TabButton>
          </div>

          {/* Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <GrowthIndicators growthData={growthData} />

              <ProgressTracking />

              <Timeline />
            </div>
          )}

          {activeTab === 'comparison' && (
            selectedStudents.length > 0 ? (
              <ComparisonView selectedStudentsData={selectedStudents} />
            ) : (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Comparison View</h3>
                <p className="text-gray-500">Select students from the sidebar to compare.</p>
              </Card>
            )
          )}

          {activeTab === 'studentData' && (
            <DataGrid
              students={filteredData}
              loading={loading}
              error={error}
              onSave={handleSave}
            />
          )}

          {activeTab === 'languageAnalysis' && (
            <LanguageAnalysis />
          )}
        </div>
      </div>
    </div>
  );
}