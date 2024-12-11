import React, { useState, useEffect, useMemo } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import _ from 'lodash';
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from 'recharts';
import Timeline from '../components/Timeline';
import GrowthIndicators from '../components/GrowthIndicators';
import DataGrid from '../components/DataGrid';
import Card from '../components/Card';
import ComparisonView from '../components/ComparisonView';
import { StatsCard } from '../components/StatsCard';
import Search from '../components/Search';
import TabButton from '../components/TabButton';
import UsersIcon from '../components/icons/Users';
import Globe2Icon from '../components/icons/Globe2';
import BarChart2Icon from '../components/icons/BarChart2';
import TrendingUpIcon from '../components/icons/TrendingUp';

export default function Dashboard() {
  const { data: session, status } = useSession();

  // State hooks
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortKey, setSortKey] = useState('Student Name');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState('all'); // Assuming you have this state
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [languages, setLanguages] = useState([]); // Assuming languages is fetched or defined somewhere
  const [levelCounts, setLevelCounts] = useState({}); // Assuming this is calculated based on data
  const [chartData, setChartData] = useState([]);
  const [selectedStudentsData, setSelectedStudentsData] = useState([]); // Assuming this is managed somewhere

  // useMemo hook
  const sortedData = useMemo(() => _.orderBy(filteredData, [sortKey], ['asc']), [filteredData, sortKey]);

  // useEffect hook for fetching data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/students');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result.students);
        setFilteredData(result.students);

        // Example: Extract unique languages
        const uniqueLanguages = [...new Set(result.students.map(student => student['Home Language']))];
        setLanguages(uniqueLanguages);

        // Example: Calculate level counts
        const counts = result.students.reduce((acc, student) => {
          const level = student['Current EAL Level  (BEAL, IEAL, MEAL1, MEAL2)'];
          acc[level] = (acc[level] || 0) + 1;
          return acc;
        }, {});
        setLevelCounts(counts);

        // Example: Prepare chart data
        const chart = [
          { name: 'BEAL', students: counts['BEAL'] || 0 },
          { name: 'IEAL', students: counts['IEAL'] || 0 },
          { name: 'MEAL1', students: counts['MEAL1'] || 0 },
          { name: 'MEAL2', students: counts['MEAL2'] || 0 },
        ];
        setChartData(chart);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchData();
  }, []);

  // Function to handle student selection
  const handleSelectStudent = (studentName) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentName)) {
        return prev.filter(name => name !== studentName);
      } else {
        return [...prev, studentName];
      }
    });
  };

  // Function to handle select all
  const handleSelectAll = () => {
    setSelectedStudents(data.map(student => student['Student Name']));
  };

  // Function to handle clear selection
  const handleClearSelection = () => {
    setSelectedStudents([]);
  };

  // Function to export CSV
  const exportCSV = () => {
    // Implement CSV export logic here
    alert('Exporting CSV...');
  };

  // Ensure hooks are not called conditionally
  if (status === 'loading') {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">You are not signed in</h2>
          <button
            onClick={() => signIn()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // Initialize growthData
  const growthData = [
    { label: 'Writing Improvement', value: '15%', trend: 'up' },
    { label: 'Reading Proficiency', value: '5%', trend: 'down' },
    // Add more data as needed
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">  
          <div>
            <h1 className="text-3xl font-bold text-gray-900">EAL Student Dashboard</h1>
            <p className="text-gray-500 mt-1">Tracking student progress and achievements</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}  
              />
            </div>
            <select
              className="border rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}  
            >
              <option value="all">All Grades</option>
              {[1, 2, 3, 4, 5].map(grade => (
                <option key={grade} value={grade}>Grade {grade}</option>
              ))}
            </select>
            <select
              className="border rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="all">All Languages</option>
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>   
              ))}
            </select>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatsCard 
            icon={UsersIcon} 
            label="Total Students" 
            value={filteredData.length}
          />
          <StatsCard 
            icon={Globe2Icon} 
            label="Languages" 
            value={languages.length}
          />
          <StatsCard 
            icon={BarChart2Icon} 
            label="BEAL Students" 
            value={levelCounts['BEAL'] || 0}
          />
          <StatsCard 
            icon={TrendingUpIcon} 
            label="IEAL Students" 
            value={levelCounts['IEAL'] || 0}
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6">
          <TabButton 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </TabButton>
          <TabButton
            active={activeTab === 'languages'}
            onClick={() => setActiveTab('languages')}
          >
            Language Analysis
          </TabButton>
          <TabButton
            active={activeTab === 'progress'}
            onClick={() => setActiveTab('progress')}
          >
            Progress Tracking
          </TabButton>
          <TabButton
            active={activeTab === 'comparison'}
            onClick={() => setActiveTab('comparison')}
          >
            Comparison
          </TabButton>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column: Student List */}
          <div className="col-span-4">
            <Card>
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-semibold text-lg text-text">Students</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSelectAll}
                    className="px-3 py-1 bg-secondary text-white rounded hover:bg-secondary-600 transition"
                  >
                    Select All
                  </button>
                  <button
                    onClick={handleClearSelection}
                    className="px-3 py-1 bg-warning text-white rounded hover:bg-warning-600 transition"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="divide-y max-h-[600px] overflow-y-auto">
                {filteredData.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No students found.
                  </div>
                ) : (
                  filteredData.map((student, index) => (
                    <div
                      key={index}
                      className={`p-4 hover:bg-gray-50 cursor-pointer ${
                        selectedStudents.includes(student['Student Name'])
                          ? 'bg-primary-50'
                          : ''
                      }`}
                      onClick={() => handleSelectStudent(student['Student Name'])}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(student['Student Name'])}
                            onChange={(e) => {
                              e.stopPropagation(); // Prevent triggering the parent onClick
                              handleSelectStudent(student['Student Name']);
                            }}
                            className="mr-2 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                          />
                          <div>
                            <p className="font-medium text-text">{student['Student Name']}</p>
                            <p className="text-sm text-gray-500">
                              Grade {student['Grade Level']} | {student['Current EAL Level  (BEAL, IEAL, MEAL1, MEAL2)']}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {student['Home Language']}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Right Column: Analysis and Details */}
          <div className="col-span-8">
            {activeTab === 'overview' && (
              <>
                <Timeline />
                <GrowthIndicators growthData={growthData} />
                <Card className="p-6 mb-6">
                  <h2 className="text-lg font-semibold mb-4">EAL Level Distribution</h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
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
                        <Bar
                          dataKey="students"
                          fill="#3b82f6"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
                {selectedStudents.length > 0 && (
                  <ComparisonView selectedStudentsData={selectedStudentsData} />
                )}
                <DataGrid />
              </>
            )}

            {activeTab === 'languages' && <LanguageAnalysis />}   
            {activeTab === 'progress' && <ProgressTracking />}    
            {activeTab === 'comparison' && <ComparisonView selectedStudentsData={selectedStudentsData} />}
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={exportCSV}
          className="px-4 py-2 bg-blue-500 text-white rounded mt-4"
        >
          Export Selected CSV
        </button>
      </div>
    </div>
  );
}