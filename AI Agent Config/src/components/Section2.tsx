import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import { FormData } from '../types/form';

interface Section2Props {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  watch: UseFormWatch<FormData>;
}

const Section2: React.FC<Section2Props> = ({ register, errors, watch }) => {
  const description = watch('section2.agentDescription') || '';
  const charCount = description.length;
  const maxChars = 500;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">תיאור הסוכן</h2>
        <p className="text-gray-600 mb-6">תאר בקצרה (2-3 משפטים) מה הסוכן עושה ואיך הוא עוזר ללקוחות</p>
      </div>

      <div>
        <label htmlFor="agentDescription" className="block text-sm font-medium text-gray-700 mb-2">
          תיאור כללי <span className="text-red-500">*</span>
        </label>
        <textarea
          id="agentDescription"
          {...register('section2.agentDescription')}
          rows={5}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none ${
            errors.section2?.agentDescription ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="לדוגמה: מאיה היא סוכנת AI מתקדמת המתמחה בשירות לקוחות עבור חנויות אונליין. היא עוזרת ללקוחות לבחור מוצרים, לבצע הזמנות, ולענות על שאלות נפוצות. מאיה זמינה 24/7 ומספקת מענה מהיר ומקצועי בעברית."
        />
        <div className="flex justify-between items-center mt-2">
          {errors.section2?.agentDescription && (
            <p className="text-sm text-red-600">{errors.section2.agentDescription.message}</p>
          )}
          <span
            className={`text-sm ${
              charCount > maxChars
                ? 'text-red-600'
                : charCount > maxChars * 0.9
                ? 'text-orange-600'
                : 'text-gray-500'
            } mr-auto`}
          >
            {charCount} / {maxChars} תווים
          </span>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-900 mb-2">✅ תיאור טוב כולל:</h3>
        <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
          <li>מה הסוכן עושה (תחום העיסוק)</li>
          <li>למי הוא מיועד (קהל יעד)</li>
          <li>מה היתרונות העיקריים שלו</li>
          <li>זמינות וערוצי תקשורת</li>
        </ul>
      </div>
    </div>
  );
};

export default Section2;
