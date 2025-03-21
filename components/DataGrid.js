import React from 'react';
import Card from './Card';
import EditableCell from './EditableCell';

export function DataGrid({ students, loading, error, onSave }) {
  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
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
              <th className="px-4 py-2 border-b">Current EAL Level</th>
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
                  value={student['Current EAL Level']}
                  row={student}
                  column={{ id: 'Current EAL Level' }}
                  onSave={onSave}
                  options={['BEAL', 'IEAL', 'MEAL1', 'MEAL2']}
                />
                <EditableCell
                  value={student['Writing Level']}
                  row={student}
                  column={{ id: 'Writing Level' }}
                  onSave={onSave}
                />
                <EditableCell
                  value={student['F&P Level']}
                  row={student}
                  column={{ id: 'F&P Level' }}
                  onSave={onSave}
                />
                <EditableCell
                  value={student['Comments']}
                  row={student}
                  column={{ id: 'Comments' }}
                  onSave={onSave}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default DataGrid; 