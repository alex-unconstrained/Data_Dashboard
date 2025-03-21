import React, { useState } from 'react';

const EditableCell = ({ value: initialValue, row, column, onSave, options }) => {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  const validate = (val) => {
    if (column.id === 'Current EAL Level') {
      const validLevels = ['BEAL', 'IEAL', 'MEAL1', 'MEAL2'];
      if (!validLevels.includes(val)) {
        return `Invalid EAL Level. Valid options: ${validLevels.join(', ')}`;
      }
    }
    // Add more validation rules as needed
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setValue(initialValue);
      setIsEditing(false);
    }
  };

  return (
    <td className="px-4 py-2 border-b">
      {isEditing ? (
        <div>
          {options ? (
            <select
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={handleSave}
              className="border rounded px-2 py-1 w-full"
              autoFocus
            >
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="border rounded px-2 py-1 w-full"
              autoFocus
            />
          )}
          {error && <div className="text-red-500 text-sm">{error}</div>}
        </div>
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="cursor-pointer hover:bg-gray-100 p-2"
        >
          {value}
        </div>
      )}
    </td>
  );
};

export default EditableCell; 