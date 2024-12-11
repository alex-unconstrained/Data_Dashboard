import { createContext, useState, useEffect } from 'react';
import Papa from 'papaparse';
import _ from 'lodash';

export const DataContext = createContext();

// Helper function to extract F&P Level
const extractFPLevel = (data) => {
  if (!data) return '';
  // Add your F&P level extraction logic here
  return data.split(',')[0] || '';
};

// Helper function to extract Writing Level
const extractWritingLevel = (data) => {
  if (!data) return '';
  // Add your Writing level extraction logic here
  return data.split(',')[1] || '';
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch and process data
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Fetching data from /data/students.csv');
        const response = await fetch('/data/students.csv');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const csvText = await response.text();
        console.log('CSV text received, first 100 chars:', csvText.substring(0, 100));
        
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            console.log('Parse complete, rows:', results.data.length);
            console.log('First row sample:', results.data[0]);
            
            const processedData = results.data.map(row => {
              try {
                return {
                  ...row,
                  'Grade Level': parseInt(row['Grade Level']) || 0,
                  'F&P Level': extractFPLevel(row['BOY 2024 (Writing, and F&P)']),
                  'Writing Level': extractWritingLevel(row['BOY 2024 (Writing, and F&P)'])
                };
              } catch (err) {
                console.error('Error processing row:', row, err);
                return row;
              }
            });
            
            setData(processedData);
            setFilteredData(processedData);
            setIsLoading(false);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
            setError('Error parsing CSV file');
            setIsLoading(false);
          }
        });
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{
      data,
      filteredData,
      error,
      isLoading,
      setFilteredData
    }}>
      {children}
    </DataContext.Provider>
  );
};