import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell 
} from 'recharts';
import { Users, Search, Globe2, TrendingUp, BarChart2, BookOpen } from 'lucide-react';
import Papa from 'papaparse';
import _ from 'lodash';
import { useState, useEffect, useMemo } from 'react';
import { saveAs } from 'file-saver';
import ComparisonView from '../components/ComparisonView';
import { Card } from '../components/Card';

const StatsCard = ({ icon: Icon, label, value, className = "" }) => (
  <Card className={`p-4 ${className}`}>
    <div className="flex items-center space-x-3">
      <div className="bg-blue-50 p-2 rounded-lg">
        <Icon className="h-6 w-6 text-blue-500" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  </Card>
);

const TabButton = ({ active, children, onClick }) => (
  <button
    className={`px-4 py-2 rounded-lg ${
      active 
        ? 'bg-blue-50 text-blue-600 font-medium' 
        : 'text-gray-600 hover:bg-gray-50'
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [sortKey, setSortKey] = useState('Student Name');

  const sortedData = useMemo(() => _.orderBy(filteredData, [sortKey], ['asc']), [filteredData, sortKey]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/students.csv');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const csvText = await response.text();
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const processedData = results.data.map(row => ({
              ...row,
              'Grade Level': parseInt(row['Grade Level']) || 0,
              'F&P Level': extractFPLevel(row['BOY 2024 (Writing, and F&P)']),
              'Writing Level': extractWritingLevel(row['BOY 2024 (Writing, and F&P)'])
            }));
            setData(processedData);
            setFilteredData(processedData);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
          }
        });
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchData();
  }, []);

  const extractFPLevel = (text) => {
    const match = text?.match(/[A-Z]/);
    return match ? match[0] : null;
  };

  const extractWritingLevel = (text) => {
    const match = text?.match(/W: (\d)/);
    return match ? parseInt(match[1]) : null;
  };

  useEffect(() => {
    const filtered = data.filter(student => {
      const matchesGrade = selectedGrade === 'all' || student['Grade Level'].toString() === selectedGrade;
      const matchesLanguage = selectedLanguage === 'all' || student['Home Language']?.includes(selectedLanguage);
      const matchesSearch = !searchQuery || 
        student['Student Name']?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesGrade && matchesLanguage && matchesSearch;
    });
    setFilteredData(filtered);
  }, [data, searchQuery, selectedGrade, selectedLanguage]);

  const languages = useMemo(() => _.uniq(data.map(s => s['Home Language'])).filter(Boolean), [data]);

  const getLevelCounts = () => {
    return filteredData.reduce((acc, student) => {
      const level = student['Current EAL Level  (BEAL, IEAL, MEAL1, MEAL2)'];
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {});
  };

  const getLanguageAnalysis = () => {
    const byLanguage = _.groupBy(filteredData, 'Home Language');
    return Object.entries(byLanguage).map(([language, students]) => ({
      language,
      count: students.length,
      averageWriting: _.meanBy(students, s => parseFloat(s['Writing Level']) || 0).toFixed(1),
      levels: _.countBy(students, 'Current EAL Level  (BEAL, IEAL, MEAL1, MEAL2)')
    }));
  };

  const getProgressData = () => {
    const grades = _.groupBy(filteredData, 'Grade Level');
    return Object.entries(grades).map(([grade, students]) => ({
      grade: `Grade ${grade}`,
      averageWriting: _.meanBy(students, s => parseFloat(s['Writing Level']) || 0).toFixed(1),
      bealCount: students.filter(s => s['Current EAL Level  (BEAL, IEAL, MEAL1, MEAL2)'] === 'BEAL').length,
      iealCount: students.filter(s => s['Current EAL Level  (BEAL, IEAL, MEAL1, MEAL2)'] === 'IEAL').length
    }));
  };

  const levelCounts = getLevelCounts();
  const chartData = Object.entries(levelCounts).map(([level, count]) => ({
    name: level,
    students: count
  }));

  const StudentProfile = ({ student }) => {
    if (!student) return null;

    const getProgressIndicator = (level) => {
      const indicators = {
        'BEAL': ['Writing Level 2', 'Basic F&P Progress', 'L1 Support'],
        'IEAL': ['Writing Level 3-4', 'Grade Level F&P', 'Reduced Support'],
        'MEAL1': ['Writing Level 4-5', 'Above Grade F&P', 'Monitor Only'],
        'MEAL2': ['Writing Level 5', 'Advanced F&P', 'Exit Ready']
      };
      return indicators[student['Current EAL Level  (BEAL, IEAL, MEAL1, MEAL2)']] || [];
    };

    const progressData = [
      { name: 'Writing', value: parseInt(student['Writing Level']) || 0, fullMark: 5 },
      { name: 'Reading', value: fpToNum(student['F&P Level']) || 0, fullMark: 26 }
    ];

    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold">{student['Student Name']}</h3>
            <p className="text-gray-500">Grade {student['Grade Level']} | {student['Home Language']}</p>
          </div>
          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
            {student['Current EAL Level  (BEAL, IEAL, MEAL1, MEAL2)']}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Current Levels</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Writing Level</span>
                <span className="font-medium">{student['Writing Level'] || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">F&P Level</span>
                <span className="font-medium">{student['F&P Level'] || 'N/A'}</span>
              </div>
            </div>

            <h4 className="font-medium mt-4 mb-2">Target Goals</h4>
            <ul className="space-y-1">
              {getProgressIndicator(student['Current EAL Level  (BEAL, IEAL, MEAL1, MEAL2)']).map((goal, index) => (
                <li key={index} className="flex items-center text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></span>
                  {goal}
                </li>
              ))}
            </ul>
          </div>

          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={progressData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis angle={30} domain={[0, 26]} />
                <Radar name="Current" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    );
  };

  const fpToNum = (level) => {
    if (!level) return 0;
    const levels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return levels.indexOf(level) + 1;
  };

  const LanguageAnalysis = () => {
    const data = getLanguageAnalysis();
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

    return (
      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Language Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="language"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {data.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Average Writing Levels by Language</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="language" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="averageWriting" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    );
  };

  const ProgressTracking = () => {
    const data = getProgressData();

    return (
      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Progress by Grade Level</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="grade" />
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
                <Line type="monotone" dataKey="averageWriting" stroke="#3b82f6" name="Avg Writing Level" />
                <Line type="monotone" dataKey="bealCount" stroke="#ef4444" name="BEAL Students" />
                <Line type="monotone" dataKey="iealCount" stroke="#10b981" name="IEAL Students" />
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

  const handleSelectAll = () => {
    setSelectedStudents(filteredData.map(student => student['Student Name']));
  };

  const handleClearSelection = () => {
    setSelectedStudents([]);
  };

  const handleSelectStudent = (studentName) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentName)) {
        return prev.filter(name => name !== studentName);
      } else {
        return [...prev, studentName];
      }
    });
  };

  const exportCSV = () => {
    const csv = Papa.unparse(filteredData.filter(student => selectedStudents.includes(student['Student Name'])));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    
    if (typeof window !== 'undefined') {
      saveAs(blob, 'selected_students.csv');
    }
  };

  const selectedStudentsData = useMemo(() => {
    return data.filter(student => selectedStudents.includes(student['Student Name']));
  }, [data, selectedStudents]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">EAL Student Dashboard</h1>
            <p className="text-gray-500 mt-1">Tracking student progress and achievements</p>
          </div>
          <div className="flex gap-4">
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
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatsCard 
            icon={Users} 
            label="Total Students" 
            value={filteredData.length}
          />
          <StatsCard 
            icon={Globe2} 
            label="Languages" 
            value={languages.length}
          />
          <StatsCard 
            icon={BarChart2} 
            label="BEAL Students" 
            value={levelCounts['BEAL'] || 0}
          />
          <StatsCard 
            icon={TrendingUp} 
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
                <h2 className="font-semibold">Students</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSelectAll}
                    className="px-2 py-1 bg-green-500 text-white rounded"
                  >
                    Select All
                  </button>
                  <button
                    onClick={handleClearSelection}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
              <div className="divide-y max-h-[600px] overflow-y-auto">
                {filteredData.map((student, index) => (
                  <div
                    key={index}
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${
                      selectedStudents.includes(student['Student Name'])
                        ? 'bg-blue-50'
                        : ''
                    }`}
                    onClick={() => handleSelectStudent(student['Student Name'])}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student['Student Name'])}
                          onChange={() => handleSelectStudent(student['Student Name'])}
                          className="mr-2"
                        />
                        <div>
                          <p className="font-medium">{student['Student Name']}</p>
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
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column: Analysis and Details */}
          <div className="col-span-8">
            {activeTab === 'overview' && (
              <>
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