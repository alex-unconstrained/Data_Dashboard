import { getSession } from 'next-auth/react';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

const CSV_FILE_PATH = path.join(process.cwd(), 'data', 'students.csv');

/**
 * Reads the students CSV file and returns data as JSON.
 */
const readStudentData = () => {
  const csvFile = fs.readFileSync(CSV_FILE_PATH, 'utf8');
  const parsed = Papa.parse(csvFile, {
    header: true,
    skipEmptyLines: true,
  });
  return parsed.data;
};

/**
 * Writes data to the students CSV file.
 * @param {Array} data - Array of student objects.
 */
const writeStudentData = (data) => {
  const csv = Papa.unparse(data);
  fs.writeFileSync(CSV_FILE_PATH, csv, 'utf8');
};

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  if (req.method === 'GET') {
    try {
      const data = readStudentData();
      res.status(200).json({ students: data });
    } catch (error) {
      res.status(500).json({ message: 'Error reading student data.', error: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const { studentName, field, value } = req.body;

      if (!studentName || !field || value === undefined) {
        res.status(400).json({ message: 'Missing required fields.' });
        return;
      }

      const data = readStudentData();
      const studentIndex = data.findIndex(student => student['Student Name'] === studentName);

      if (studentIndex === -1) {
        res.status(404).json({ message: 'Student not found.' });
        return;
      }

      // Data Validation
      if (field === 'Current EAL Level  (BEAL, IEAL, MEAL1, MEAL2)') {
        const validLevels = ['BEAL', 'IEAL', 'MEAL1', 'MEAL2'];
        if (!validLevels.includes(value)) {
          res.status(400).json({ message: `Invalid EAL Level. Valid options: ${validLevels.join(', ')}` });
          return;
        }
      }

      // Add more validation rules as needed for other fields

      // Update the field
      data[studentIndex][field] = value;

      // Write back to CSV
      writeStudentData(data);

      res.status(200).json({ message: 'Student data updated successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating student data.', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 