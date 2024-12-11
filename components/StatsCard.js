import React from 'react';

export const StatsCard = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow">
      {Icon && <Icon className="h-6 w-6 text-blue-500 mr-4" />}
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
};
