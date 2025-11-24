import React from 'react';
import { Check } from 'lucide-react';

interface ProgressIndicatorProps {
  currentSection: number;
  totalSections: number;
  onNavigate: (section: number) => void;
}

const sections = [
  'פרטי קשר',
  'שם הסוכן',
  'תיאור',
  'פרסונה ותפקיד',
  'מיומנויות',
  'מוצרים ושירותים',
  'אילוצים',
];

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentSection,
  totalSections,
  onNavigate,
}) => {
  const progressPercentage = ((currentSection + 1) / totalSections) * 100;

  return (
    <div className="mb-8">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            סעיף {currentSection + 1} מתוך {totalSections}
          </span>
          <span className="text-sm font-medium text-primary-600">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-primary-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Section Dots */}
      <div className="hidden md:flex justify-between items-center">
        {sections.map((section, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <button
              onClick={() => onNavigate(index)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${index < currentSection
                  ? 'bg-primary-600 text-white'
                  : index === currentSection
                    ? 'bg-primary-600 text-white ring-4 ring-primary-200'
                    : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                }`}
            >
              {index < currentSection ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </button>
            <span
              className={`text-xs mt-2 text-center max-w-[80px] ${index === currentSection ? 'text-primary-700 font-semibold' : 'text-gray-600'
                }`}
            >
              {section}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
