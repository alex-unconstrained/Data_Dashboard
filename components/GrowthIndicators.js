import React from 'react';
import { ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';
import { Card } from './Card';

const GrowthIndicators = ({ growthData }) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Growth Indicators</h3>
      <div className="grid grid-cols-3 gap-4">
        {growthData.map((indicator, index) => (
          <div key={index} className="flex items-center">
            {indicator.trend === 'up' && <ArrowUp className="text-green-500 mr-2" />}
            {indicator.trend === 'down' && <ArrowDown className="text-red-500 mr-2" />}
            {indicator.trend === 'neutral' && <ArrowRight className="text-gray-500 mr-2" />}
            <div>
              <p className="font-medium">{indicator.label}</p>
              <p className="text-sm text-gray-500">{indicator.value}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default GrowthIndicators; 