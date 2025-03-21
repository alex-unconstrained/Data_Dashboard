import { createContext, useState, useEffect } from 'react';
import Papa from 'papaparse';
import _ from 'lodash';

export const DataContext = createContext();

// Helper function to extract numeric value from Writing Level
const extractNumericWritingLevel = (level) => {
  if (!level) return 0;
  if (level.startsWith('W:')) {
    const match = level.match(/W:\s*(\d+(?:\s*L\d)?|\+?\s*Lf|\s*NR)/i);
    if (match) {
      const value = match[1].trim();
      if (value === 'NR') return 0;
      // Handle cases like "1 L1", "2 +Lf", etc.
      const numericPart = parseInt(value);
      return isNaN(numericPart) ? 0 : numericPart;
    }
  }
  return 0;
};

// Helper function to extract numeric value from F&P Level
const extractNumericFPLevel = (level) => {
  if (!level || level === 'NR') return 0;
  // Add logic to convert F&P levels to numeric values based on your scale
  return 0; // Placeholder - implement based on your F&P level system
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [languageStats, setLanguageStats] = useState([]);
  const [ealLevelStats, setEalLevelStats] = useState([]);
  const [progressStats, setProgressStats] = useState([]);
  const [overviewStats, setOverviewStats] = useState({
    totalStudents: 0,
    averageWritingLevel: 0,
    averageFPLevel: 0,
    levelDistribution: {},
    gradeDistribution: {}
  });
  const [comparisonData, setComparisonData] = useState({
    byGrade: {},
    byEALLevel: {},
    byHomeLanguage: {}
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/students.csv');
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: 'greedy',
          complete: (results) => {
            const processedData = results.data.map(row => ({
              'Student Name': row['Student Name']?.trim() || '',
              'Grade Level': parseInt(row['Grade Level']) || 0,
              'Current EAL Level': row['Current EAL Level  (BEAL, IEAL, MEAL1, MEAL2)']?.trim() || '',
              'Writing Level': `W: ${row['BOY 2024 (Writing, and F&P)']?.split(',')[0]?.trim() || 'NR'}`,
              'F&P Level': row['BOY 2024 (Writing, and F&P)']?.split(',')[1]?.trim() || 'NR',
              'Home Language': row['Home Language']?.trim() || 'Unknown',
              'Comments': row['Comments']?.trim() || ''
            }));

            // Set main data
            setData(processedData);
            setFilteredData(processedData);

            // Calculate Overview Statistics
            const overview = {
              totalStudents: processedData.length,
              averageWritingLevel: _.meanBy(processedData, d => extractNumericWritingLevel(d['Writing Level'])),
              averageFPLevel: _.meanBy(processedData, d => extractNumericFPLevel(d['F&P Level'])),
              levelDistribution: _.countBy(processedData, 'Current EAL Level'),
              gradeDistribution: _.countBy(processedData, 'Grade Level')
            };
            setOverviewStats(overview);

            // Calculate Comparison Data
            const comparison = {
              byGrade: _.groupBy(processedData, 'Grade Level'),
              byEALLevel: _.groupBy(processedData, 'Current EAL Level'),
              byHomeLanguage: _.groupBy(processedData, 'Home Language')
            };

            // Process comparison data to include averages
            const processedComparison = {
              byGrade: _.mapValues(comparison.byGrade, students => ({
                count: students.length,
                avgWritingLevel: _.meanBy(students, s => extractNumericWritingLevel(s['Writing Level'])),
                avgFPLevel: _.meanBy(students, s => extractNumericFPLevel(s['F&P Level'])),
                ealLevelDistribution: _.countBy(students, 'Current EAL Level')
              })),
              byEALLevel: _.mapValues(comparison.byEALLevel, students => ({
                count: students.length,
                avgWritingLevel: _.meanBy(students, s => extractNumericWritingLevel(s['Writing Level'])),
                avgFPLevel: _.meanBy(students, s => extractNumericFPLevel(s['F&P Level'])),
                gradeDistribution: _.countBy(students, 'Grade Level')
              })),
              byHomeLanguage: _.mapValues(comparison.byHomeLanguage, students => ({
                count: students.length,
                avgWritingLevel: _.meanBy(students, s => extractNumericWritingLevel(s['Writing Level'])),
                avgFPLevel: _.meanBy(students, s => extractNumericFPLevel(s['F&P Level'])),
                ealLevelDistribution: _.countBy(students, 'Current EAL Level')
              }))
            };
            setComparisonData(processedComparison);

            // Calculate Language Statistics
            const languageCounts = _.countBy(processedData, 'Home Language');
            setLanguageStats(Object.entries(languageCounts).map(([language, count]) => ({
              language,
              count
            })));

            // Calculate EAL Level Statistics
            const ealCounts = _.countBy(processedData, 'Current EAL Level');
            setEalLevelStats(Object.entries(ealCounts).map(([level, count]) => ({
              level,
              count
            })));

            // Calculate Progress Statistics
            const gradeGroups = _.groupBy(processedData, 'Grade Level');
            const progressData = Object.entries(gradeGroups).map(([grade, students]) => ({
              grade: `Grade ${grade}`,
              avgWritingLevel: _.meanBy(students, student => 
                extractNumericWritingLevel(student['Writing Level'])
              )
            }));
            setProgressStats(progressData);
          }
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{
      data,
      filteredData,
      languageStats,
      ealLevelStats,
      progressStats,
      overviewStats,
      comparisonData,
      setFilteredData
    }}>
      {children}
    </DataContext.Provider>
  );
};