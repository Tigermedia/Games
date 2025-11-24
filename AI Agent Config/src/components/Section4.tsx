import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import { FormData } from '../types/form';

interface Section4Props {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  watch: UseFormWatch<FormData>;
}

const Section4: React.FC<Section4Props> = ({ register, errors, watch }) => {
  const otherCapability = watch('section4.coreCapabilities.other');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">מיומנויות - פונקציות ותהליכים</h2>
        <p className="text-gray-600 mb-6">הגדר את היכולות והתרחישים שהסוכן יטפל בהם</p>
      </div>

      {/* 4.1 Core Capabilities */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">4.1 יכולות ליבה</h3>
        <p className="text-sm text-gray-600 mb-4">בחר את היכולות העיקריות של הסוכן (ניתן לבחור מספר אפשרויות)</p>
        <div className="space-y-3">
          {[
            { name: 'faq', label: 'מענה על שאלות נפוצות' },
            { name: 'leadGeneration', label: 'איסוף מידע על משתמשים (יצירת לידים)' },
            { name: 'orderProcessing', label: 'עיבוד הזמנות/הזמנות תורים' },
            { name: 'productRecommendations', label: 'מתן המלצות על מוצרים' },
            { name: 'technicalSupport', label: 'פתרון בעיות טכניות' },
            { name: 'scheduling', label: 'קביעת פגישות' },
            { name: 'humanEscalation', label: 'העברה לנציג אנושי' },
            { name: 'other', label: 'אחר' },
          ].map((capability) => (
            <label
              key={capability.name}
              className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <input
                type="checkbox"
                {...register(`section4.coreCapabilities.${capability.name}` as any)}
                className="mt-1 ml-3 h-4 w-4 text-primary-600 focus:ring-primary-500 rounded"
              />
              <span className="text-gray-900">{capability.label}</span>
            </label>
          ))}
          {otherCapability && (
            <input
              type="text"
              {...register('section4.coreCapabilities.otherText')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="ציין יכולת אחרת..."
            />
          )}
        </div>
      </div>

      {/* 4.2 Workflow Scenarios */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">4.2 תרחישי עבודה</h3>
        <p className="text-sm text-gray-600 mb-6">
          תאר כיצד הסוכן צריך להתנהג בתרחישים שונים. ספק הנחיות מפורטות וברורות.
        </p>
        <div className="space-y-6">
          {/* Greeting */}
          <div>
            <label htmlFor="greeting" className="block text-sm font-medium text-gray-700 mb-2">
              תרחיש 1: ברכת פתיחה <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">כאשר משתמש מתחיל שיחה, הסוכן צריך:</p>
            <textarea
              id="greeting"
              {...register('section4.workflows.greeting')}
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none ${
                errors.section4?.workflows?.greeting ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder='לדוגמה: "להציג את עצמו בשם, לברך את המשתמש, לשאול איך הוא יכול לעזור, ולהציע 2-3 אפשרויות פעולה נפוצות"'
            />
            {errors.section4?.workflows?.greeting && (
              <p className="mt-2 text-sm text-red-600">{errors.section4.workflows.greeting.message}</p>
            )}
          </div>

          {/* Help Request */}
          <div>
            <label htmlFor="helpRequest" className="block text-sm font-medium text-gray-700 mb-2">
              תרחיש 2: משתמש צריך עזרה <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">כאשר משתמש מבקש עזרה או שואל שאלה:</p>
            <textarea
              id="helpRequest"
              {...register('section4.workflows.helpRequest')}
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none ${
                errors.section4?.workflows?.helpRequest ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder='לדוגמה: "להקשיב בקפידה, לברר את הצרכים, לספק מענה ברור ומפורט, לשאול אם יש עוד משהו שניתן לעזור בו"'
            />
            {errors.section4?.workflows?.helpRequest && (
              <p className="mt-2 text-sm text-red-600">{errors.section4.workflows.helpRequest.message}</p>
            )}
          </div>

          {/* Cannot Help */}
          <div>
            <label htmlFor="cannotHelp" className="block text-sm font-medium text-gray-700 mb-2">
              תרחיש 3: הסוכן לא יכול לעזור <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">כאשר הסוכן לא יכול לענות או לפתור בעיה:</p>
            <textarea
              id="cannotHelp"
              {...register('section4.workflows.cannotHelp')}
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none ${
                errors.section4?.workflows?.cannotHelp ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder='לדוגמה: "להודות למשתמש על הסבלנות, להסביר בכנות שהוא לא יכול לעזור בנושא זה, להציע העברה לנציג אנושי או להציע אלטרנטיבה"'
            />
            {errors.section4?.workflows?.cannotHelp && (
              <p className="mt-2 text-sm text-red-600">{errors.section4.workflows.cannotHelp.message}</p>
            )}
          </div>

          {/* Frustrated User */}
          <div>
            <label htmlFor="frustrated" className="block text-sm font-medium text-gray-700 mb-2">
              תרחיש 4: משתמש מתוסכל/כועס <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">כאשר משתמש מראה סימני תסכול או כעס:</p>
            <textarea
              id="frustrated"
              {...register('section4.workflows.frustrated')}
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none ${
                errors.section4?.workflows?.frustrated ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder='לדוגמה: "להתנצל, להראות אמפתיה, לנסות להבין את הבעיה, לספק פתרון מיידי או העברה דחופה לנציג"'
            />
            {errors.section4?.workflows?.frustrated && (
              <p className="mt-2 text-sm text-red-600">{errors.section4.workflows.frustrated.message}</p>
            )}
          </div>

          {/* Additional Scenarios */}
          <div>
            <label htmlFor="additional" className="block text-sm font-medium text-gray-700 mb-2">
              תרחישים נוספים (אופציונלי)
            </label>
            <textarea
              id="additional"
              {...register('section4.workflows.additional')}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
              placeholder="תאר תרחישים נוספים שרלוונטיים לעסק שלך..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section4;
