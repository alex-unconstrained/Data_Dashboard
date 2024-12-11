import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

const EditableCell = ({ value: initialValue, row, column, onSave, options }) => {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  const validate = (val) => {
    // Implement validation based on the column
    if (column.id === 'Current EAL Level  (BEAL, IEAL, MEAL1, MEAL2)') {
      const validLevels = ['BEAL', 'IEAL', 'MEAL1', 'MEAL2'];
      if (!validLevels.includes(val)) {
        return `Invalid EAL Level. Valid options: ${validLevels.join(', ')}`;
      }
    }

    // Add more validation rules as needed for other fields
    if (column.id === 'Writing Level' || column.id === 'F&P Level') {
      const num = parseInt(val, 10);
      if (isNaN(num) || num < 0) {
        return `${column.id} must be a positive number.`;
      }
    }

    return '';
  };

  const handleSave = () => {
    const validationError = validate(value);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    onSave(row['Student Name'], column.id, value);
    setIsEditing(false);
  };

  return (
    <td className="px-4 py-2 border-b">
      {isEditing ? (
        <div className="flex items-center space-x-2">
          {options ? (
            <select
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select</option>
              {options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          <button onClick={handleSave} className="text-green-500 hover:text-green-700">
            <Check size={16} />
          </button>
          <button onClick={() => { setIsEditing(false); setValue(initialValue); setError(''); }} className="text-red-500 hover:text-red-700">
            <X size={16} />
          </button>
        </div>
      ) : (
        <div onClick={() => setIsEditing(true)} className="cursor-pointer">
          {value || '—'}
        </div>
      )}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </td>
  );
};

export default EditableCell; 