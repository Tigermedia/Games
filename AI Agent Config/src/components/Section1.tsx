import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormData } from '../types/form';

interface Section1Props {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

const Section1: React.FC<Section1Props> = ({ register, errors }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">שם הסוכן</h2>
        <p className="text-gray-600 mb-6">בחר שם ייחודי ומזהה לסוכן ה-AI שלך</p>
      </div>

      <div>
        <label htmlFor="agentName" className="block text-sm font-medium text-gray-700 mb-2">
          שם הסוכן <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="agentName"
          {...register('section1.agentName')}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
            errors.section1?.agentName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder='לדוגמה: "מאיה - עוזרת שירות לקוחות" או "בוט המכירות"'
        />
        {errors.section1?.agentName && (
          <p className="mt-2 text-sm text-red-600">{errors.section1.agentName.message}</p>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">💡 טיפים לבחירת שם:</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>בחר שם קל לזכירה וייחודי</li>
          <li>השם יכול לשקף את התחום או התפקיד של הסוכן</li>
          <li>ניתן להוסיף תיאור קצר בסוגריים לבהירות</li>
        </ul>
      </div>
    </div>
  );
};

export default Section1;
