import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import { FormData } from '../types/form';

interface Section6Props {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  watch: UseFormWatch<FormData>;
}

const Section6: React.FC<Section6Props> = ({ register, errors, watch }) => {
  const otherRestriction = watch('section6.behavioralRestrictions.other');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">אילוצים ומגבלות</h2>
        <p className="text-gray-600 mb-6">הגדר גבולות ברורים למה הסוכן יכול ולא יכול לעשות</p>
      </div>

      {/* 6.1 Should Discuss */}
      <div>
        <label htmlFor="shouldDiscuss" className="block text-sm font-medium text-gray-700 mb-2">
          6.1 נושאים שהסוכן צריך לדון בהם <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-2">נושאים שהסוכן מוסמך לטפל בהם</p>
        <textarea
          id="shouldDiscuss"
          {...register('section6.shouldDiscuss')}
          rows={4}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none bg-green-50 border-green-300 focus:border-green-500 focus:ring-green-500 ${
            errors.section6?.shouldDiscuss ? 'border-red-500' : ''
          }`}
          placeholder="לדוגמה: מוצרים זמינים במלאי, מחירים מפורסמים, זמני משלוח סטנדרטיים, תנאי החזרה, שאלות טכניות בסיסיות"
        />
        {errors.section6?.shouldDiscuss && (
          <p className="mt-2 text-sm text-red-600">{errors.section6.shouldDiscuss.message}</p>
        )}
      </div>

      {/* 6.2 Should NOT Discuss */}
      <div>
        <label htmlFor="shouldNotDiscuss" className="block text-sm font-medium text-gray-700 mb-2">
          6.2 נושאים שהסוכן לא צריך לדון בהם <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-2">נושאים אסורים או רגישים</p>
        <textarea
          id="shouldNotDiscuss"
          {...register('section6.shouldNotDiscuss')}
          rows={4}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none bg-red-50 border-red-300 focus:border-red-500 focus:ring-red-500 ${
            errors.section6?.shouldNotDiscuss ? 'border-red-500' : ''
          }`}
          placeholder="לדוגמה: מידע אישי של לקוחות אחרים, הנחות לא מאושרות, מדיניות פנימית של החברה, ייעוץ משפטי או רפואי"
        />
        {errors.section6?.shouldNotDiscuss && (
          <p className="mt-2 text-sm text-red-600">{errors.section6.shouldNotDiscuss.message}</p>
        )}
      </div>

      {/* 6.3 Confidential Info */}
      <div>
        <label htmlFor="confidentialInfo" className="block text-sm font-medium text-gray-700 mb-2">
          6.3 מידע סודי שאסור לשתף (אופציונלי)
        </label>
        <p className="text-xs text-gray-500 mb-2">מידע רגיש שהסוכן חייב לשמור בסודיות</p>
        <textarea
          id="confidentialInfo"
          {...register('section6.confidentialInfo')}
          rows={3}
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none bg-yellow-50 border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500"
          placeholder="לדוגמה: פרטי ספקים, עלויות רכש, מידע על עובדים, אסטרטגיות עסקיות"
        />
      </div>

      {/* 6.4 Behavioral Restrictions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">6.4 הגבלות התנהגות</h3>
        <p className="text-sm text-gray-600 mb-4">סמן את ההגבלות שחלות על הסוכן</p>
        <div className="space-y-3">
          {[
            { name: 'noDeliveryPromises', label: 'לעולם לא להבטיח זמני אספקה ספציפיים' },
            { name: 'noLegalMedicalFinancialAdvice', label: 'לעולם לא לתת ייעוץ משפטי/רפואי/פיננסי' },
            { name: 'noCompetitorDiscussion', label: 'לעולם לא לדבר על מתחרים או להשוות מחירים' },
            { name: 'noPricingWithoutApproval', label: 'לעולם לא לשתף מחירים/הנחות פנימיות ללא אישור' },
            { name: 'other', label: 'אחר' },
          ].map((restriction) => (
            <label
              key={restriction.name}
              className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <input
                type="checkbox"
                {...register(`section6.behavioralRestrictions.${restriction.name}` as any)}
                className="mt-1 ml-3 h-4 w-4 text-primary-600 focus:ring-primary-500 rounded"
              />
              <span className="text-gray-900">{restriction.label}</span>
            </label>
          ))}
          {otherRestriction && (
            <input
              type="text"
              {...register('section6.behavioralRestrictions.otherText')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="ציין הגבלה אחרת..."
            />
          )}
        </div>
      </div>

      {/* 6.5 Escalation Rules */}
      <div>
        <label htmlFor="escalationRules" className="block text-sm font-medium text-gray-700 mb-2">
          6.5 כללי העברה לנציג אנושי <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-2">מתי ואיך הסוכן צריך להעביר את השיחה לנציג אנושי</p>
        <textarea
          id="escalationRules"
          {...register('section6.escalationRules')}
          rows={4}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none ${
            errors.section6?.escalationRules ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="לדוגמה: להעביר לנציג אנושי כאשר: 1) הלקוח מבקש זאת במפורש, 2) הבעיה מורכבת ודורשת החלטה ניהולית, 3) הלקוח מתוסכל אחרי 3 ניסיונות, 4) יש צורך במידע שהסוכן לא יכול לגשת אליו"
        />
        {errors.section6?.escalationRules && (
          <p className="mt-2 text-sm text-red-600">{errors.section6.escalationRules.message}</p>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">🔒 אבטחה ואחריות:</h3>
        <p className="text-sm text-blue-800">
          הגדרת גבולות ברורים עוזרת להגן על העסק שלך, על הלקוחות ועל הסוכן עצמו. חשוב להיות ספציפי ככל
          האפשר כדי למנוע אי-הבנות או חשיפת מידע לא מורשית.
        </p>
      </div>
    </div>
  );
};

export default Section6;
