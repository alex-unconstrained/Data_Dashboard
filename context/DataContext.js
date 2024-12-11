import { createContext, useState, useEffect } from 'react';
import Papa from 'papaparse';
import _ from 'lodash';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  // ... other states

  useEffect(() => {
    // Fetch and process data
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

  // ... other data processing functions

  return (
    <DataContext.Provider value={{
      data,
      filteredData,
      // ... other states and functions
    }}>
      {children}
    </DataContext.Provider>
  );
}; 