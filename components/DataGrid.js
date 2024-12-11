import React, { useEffect, useState } from 'react';
import EditableCell from './EditableCell';
import { Card } from './Card';

export function DataGrid({ children }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch student data from the API
  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students');
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students);
      } else {
        console.error('Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle save/update
  const handleSave = async (studentName, field, value) => {
    try {
      const res = await fetch('/api/students', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ studentName, field, value })
      });
      if (res.ok) {
        // Update the state locally
        setStudents(prev => prev.map(student => 
          student['Student Name'] === studentName
            ? { ...student, [field]: value }
            : student
        ));
      } else {
        const errorData = await res.json();
        console.error('Failed to update:', errorData.message);
        alert(`Update failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating student:', error);
      alert('An error occurred while updating the student.');
    }
  };

  if (loading) {
    return <div>Loading data...</div>;
  }

  return (
    <Card className="mt-6">
      <h2 className="text-lg font-semibold mb-4">Student Data Grid</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Student Name</th>
              <th className="px-4 py-2 border-b">Grade Level</th>
              <th className="px-4 py-2 border-b">Current EAL Level (BEAL, IEAL, MEAL1, MEAL2)</th>
              <th className="px-4 py-2 border-b">Writing Level</th>
              <th className="px-4 py-2 border-b">F&P Level</th>
              <th className="px-4 py-2 border-b">Comments</th>
              {/* Add other columns as needed */}
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{student['Student Name']}</td>
                <td className="px-4 py-2 border-b">{student['Grade Level']}</td>
                <EditableCell
                  value={student['Current EAL Level  (BEAL, IEAL, MEAL1, MEAL2)']}
                  row={student}
                  column={{ id: 'Current EAL Level  (BEAL, IEAL, MEAL1, MEAL2)' }}
                  onSave={handleSave}
                  options={['BEAL', 'IEAL', 'MEAL1', 'MEAL2']}
                />
                <EditableCell
                  value={student['Writing Level']}
                  row={student}
                  column={{ id: 'Writing Level' }}
                  onSave={handleSave}
                />
                <EditableCell
                  value={student['F&P Level']}
                  row={student}
                  column={{ id: 'F&P Level' }}
                  onSave={handleSave}
                />
                <EditableCell
                  value={student['Comments']}
                  row={student}
                  column={{ id: 'Comments' }}
                  onSave={handleSave}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default DataGrid; 