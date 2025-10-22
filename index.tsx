import React, { useState } from 'react';

export default function LifeBalancePieChart() {
  const [percentages, setPercentages] = useState({
    work: 25,
    relationships: 25,
    spiritual: 25,
    health: 25
  });

  const categories = [
    { key: 'work', label: 'Work/Career', color: '#3B82F6' },
    { key: 'relationships', label: 'Relationships/Social', color: '#EC4899' },
    { key: 'spiritual', label: 'Spiritual', color: '#8B5CF6' },
    { key: 'health', label: 'Health', color: '#10B981' }
  ];

  const handleSliderChange = (key, value) => {
    const newValue = parseInt(value);
    const oldValue = percentages[key];
    const change = newValue - oldValue;
    
    // Distribute the change equally among the other three categories
    const otherKeys = Object.keys(percentages).filter(k => k !== key);
    const changePerCategory = -change / otherKeys.length;
    
    const newPercentages = { [key]: newValue };
    let excessValue = 0;
    
    // Calculate new values and track any that would go negative
    otherKeys.forEach(k => {
      const proposed = percentages[k] + changePerCategory;
      if (proposed < 0) {
        newPercentages[k] = 0;
        excessValue += Math.abs(proposed);
      } else {
        newPercentages[k] = proposed;
      }
    });
    
    // If we had excess (negatives clamped to 0), reduce the slider we're moving
    if (excessValue > 0) {
      newPercentages[key] = Math.max(0, newValue - excessValue);
    }
    
    // Round all values
    Object.keys(newPercentages).forEach(k => {
      newPercentages[k] = Math.round(newPercentages[k]);
    });
    
    // Final adjustment to ensure total is exactly 100
    const total = Object.values(newPercentages).reduce((sum, val) => sum + val, 0);
    if (total !== 100) {
      newPercentages[key] += (100 - total);
    }
    
    setPercentages(newPercentages);
  };

  const createPieSlice = (startAngle, endAngle, color) => {
    const radius = 120;
    const centerX = 150;
    const centerY = 150;

    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  const renderPieChart = () => {
    const total = Object.values(percentages).reduce((sum, val) => sum + val, 0);
    let currentAngle = 0;

    return categories.map(({ key, color }) => {
      const percentage = percentages[key];
      const sliceAngle = (percentage / total) * 360;
      const path = createPieSlice(currentAngle, currentAngle + sliceAngle, color);
      currentAngle += sliceAngle;

      return (
        <path
          key={key}
          d={path}
          fill={color}
          stroke="white"
          strokeWidth="2"
          className="transition-all duration-300"
        />
      );
    });
  };

  const total = Object.values(percentages).reduce((sum, val) => sum + val, 0);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-center mb-8 text-slate-800">Life Balance Chart</h1>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
          {/* Pie Chart */}
          <div className="flex-shrink-0">
            <svg width="300" height="300" viewBox="0 0 300 300">
              {renderPieChart()}
            </svg>
            <div className="text-center mt-4">
              <span className="text-sm text-slate-600">Total: </span>
              <span className={`text-lg font-bold ${total === 100 ? 'text-green-600' : 'text-orange-600'}`}>
                {total}%
              </span>
            </div>
          </div>

          {/* Sliders */}
          <div className="flex-1 w-full space-y-6">
            {categories.map(({ key, label, color }) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: color }}
                    ></span>
                    {label}
                  </label>
                  <span className="text-lg font-bold text-slate-800" style={{ color }}>
                    {percentages[key]}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={percentages[key]}
                  onChange={(e) => handleSliderChange(key, e.target.value)}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${color} 0%, ${color} ${percentages[key]}%, #e2e8f0 ${percentages[key]}%, #e2e8f0 100%)`
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {total !== 100 && (
          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg text-center">
            <p className="text-sm text-orange-800">
              Tip: Adjust sliders so the total equals 100% for accurate proportions
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
