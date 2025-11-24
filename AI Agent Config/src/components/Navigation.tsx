import React from 'react';
import { ChevronRight, ChevronLeft, Send } from 'lucide-react';

interface NavigationProps {
  currentSection: number;
  totalSections: number;
  onPrevious: () => void;
  onNext: () => void;
  isLastSection: boolean;
  isFirstSection: boolean;
}

const Navigation: React.FC<NavigationProps> = ({
  currentSection,
  totalSections,
  onPrevious,
  onNext,
  isLastSection,
  isFirstSection,
}) => {
  return (
    <div className="flex justify-between items-center pt-8 border-t border-gray-200 mt-8">
      <button
        type="button"
        onClick={onPrevious}
        disabled={isFirstSection}
        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
          isFirstSection
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        <ChevronRight className="w-5 h-5" />
        הקודם
      </button>

      <div className="text-sm text-gray-600">
        סעיף {currentSection + 1} מתוך {totalSections}
      </div>

      {isLastSection ? (
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          <Send className="w-5 h-5" />
          שלח טופס
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          הבא
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default Navigation;
