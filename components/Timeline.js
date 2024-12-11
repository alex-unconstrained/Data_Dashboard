import React from 'react';
import { Card } from './Card';

const timelineData = [
  {
    title: 'BOY 2024 Assessments',
    date: 'January 2024',
    description: 'Beginning of Year assessments to evaluate student starting levels.'
  },
  {
    title: 'MOY 2025 Projections',
    date: 'June 2025',
    description: 'Mid-Year projections to monitor progress and adjust support strategies.'
  },
  {
    title: 'EOY 2025 Targets',
    date: 'December 2025',
    description: 'End of Year targets to set goals for student achievements.'
  }
];

const Timeline = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Academic Timeline</h3>
      <div className="space-y-4">
        {timelineData.map((event, index) => (
          <div key={index} className="flex items-start">
            <div className="flex flex-col items-center mr-4">
              <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
              {index < timelineData.length - 1 && (
                <div className="w-px bg-gray-300 flex-1"></div>
              )}
            </div>
            <div>
              <h4 className="font-medium">{event.title}</h4>
              <p className="text-sm text-gray-500">{event.date}</p>
              <p className="text-gray-700">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Timeline; 