import React, { useState, useEffect } from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { Plus, Trash2, Link as LinkIcon } from 'lucide-react';
import { FormData } from '../types/form';

interface Section5Props {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  watch: UseFormWatch<FormData>;
  setValue: UseFormSetValue<FormData>;
}

const Section5: React.FC<Section5Props> = ({ register, errors, watch, setValue }) => {
  const references = watch('section5.references') || [''];
  const [aboutInputMode, setAboutInputMode] = useState<'text' | 'url'>('text');

  // Initialize references array if empty
  useEffect(() => {
    if (!references || references.length === 0) {
      setValue('section5.references', ['']);
    }
  }, [references, setValue]);

  const addReference = () => {
    if (references.length < 10) {
      setValue('section5.references', [...references, '']);
    }
  };

  const removeReference = (index: number) => {
    if (references.length > 1) {
      const newReferences = references.filter((_, i) => i !== index);
      setValue('section5.references', newReferences);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">מידע על מוצרים ושירותים</h2>
        <p className="text-gray-600 mb-6">ספק מידע מפורט על המוצרים והשירותים שהסוכן יציג ללקוחות</p>
      </div>

      {/* Important to Know Box - Moved to top */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-900 mb-2">📌 חשוב לדעת:</h3>
        <p className="text-sm text-yellow-800">
          ככל שתספק יותר מידע מפורט ומדויק, הסוכן יוכל לתת מענה טוב יותר ללקוחות שלך. בכל שדה ניתן להזין
          תוכן ישירות או לספק קישור למקור המידע. אם יש לך מידע רב, שקול לסמן "אספק תיעוד נוסף בנפרד" ולשלוח
          אותו אחרי הגשת הטופס.
        </p>
      </div>

      {/* New: About Business */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">אודות העסק</h3>
        <p className="text-sm text-gray-600 mb-4">
          ספר על העסק שלך - מי אתם, מה אתם עושים, מה המומחיות שלכם
        </p>

        {/* Toggle between text and URL */}
        <div className="flex gap-3 mb-4">
          <button
            type="button"
            onClick={() => setAboutInputMode('text')}
            className={`flex-1 px-4 py-2 rounded-lg border transition-all ${
              aboutInputMode === 'text'
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'
            }`}
          >
            כתוב תוכן
          </button>
          <button
            type="button"
            onClick={() => setAboutInputMode('url')}
            className={`flex-1 px-4 py-2 rounded-lg border transition-all ${
              aboutInputMode === 'url'
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <LinkIcon className="w-4 h-4" />
              <span>הוסף קישור</span>
            </div>
          </button>
        </div>

        {aboutInputMode === 'text' ? (
          <textarea
            {...register('section5.aboutBusiness')}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
            placeholder="לדוגמה: אנחנו חברה מובילה בתחום הטכנולוגיה עם למעלה מ-10 שנות ניסיון. אנחנו מתמחים בפתרונות AI ואוטומציה לעסקים קטנים ובינוניים..."
          />
        ) : (
          <div className="flex gap-2 items-start">
            <LinkIcon className="w-5 h-5 text-gray-400 mt-3" />
            <input
              type="url"
              {...register('section5.aboutBusinessUrl')}
              className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                errors.section5?.aboutBusinessUrl ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="https://example.com/about-us"
            />
          </div>
        )}
        {errors.section5?.aboutBusinessUrl && (
          <p className="mt-2 text-sm text-red-600">{errors.section5.aboutBusinessUrl.message}</p>
        )}
      </div>

      {/* 5.1 Products Overview */}
      <div>
        <label htmlFor="productsOverview" className="block text-sm font-medium text-gray-700 mb-2">
          5.1 סקירה כללית על מוצרים ושירותים <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-2">תאר את המוצרים/שירותים העיקריים שלך (או הוסף קישור למקור)</p>
        <textarea
          id="productsOverview"
          {...register('section5.productsOverview')}
          rows={5}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none ${
            errors.section5?.productsOverview ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="לדוגמה: אנחנו מוכרים מוצרי אלקטרוניקה כולל: סמארטפונים, מחשבים ניידים, טאבלטים, אביזרים. כל המוצרים באחריות שנתיים ומשלוח חינם מעל 200 ש״ח. או: https://example.com/products"
        />
        {errors.section5?.productsOverview && (
          <p className="mt-2 text-sm text-red-600">{errors.section5.productsOverview.message}</p>
        )}
      </div>

      {/* 5.2 Specifications */}
      <div>
        <label htmlFor="specifications" className="block text-sm font-medium text-gray-700 mb-2">
          5.2 מפרט טכני ופרטים נוספים (אופציונלי)
        </label>
        <p className="text-xs text-gray-500 mb-2">מפרטים טכניים, גדלים, צבעים, מאפיינים מיוחדים (או קישור)</p>
        <textarea
          id="specifications"
          {...register('section5.specifications')}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
          placeholder="לדוגמה: כל המוצרים זמינים בצבעים שונים, יש אפשרות לבחור בין מודלים שונים עם זיכרון 64GB/128GB/256GB. או: https://example.com/specs"
        />
      </div>

      {/* 5.3 Pricing */}
      <div>
        <label htmlFor="pricing" className="block text-sm font-medium text-gray-700 mb-2">
          5.3 מידע על מחירים והנחות (אופציונלי)
        </label>
        <p className="text-xs text-gray-500 mb-2">מחירון, מבצעים, הנחות, תנאי תשלום (או קישור)</p>
        <textarea
          id="pricing"
          {...register('section5.pricing')}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
          placeholder="לדוגמה: מחירים החל מ-1,000 ש״ח. יש לנו מבצע חודשי עד 20% הנחה. אפשרות לתשלום ב-3 תשלומים ללא ריבית. או: https://example.com/pricing"
        />
      </div>

      {/* 5.4 Booking Options */}
      <div>
        <label htmlFor="bookingOptions" className="block text-sm font-medium text-gray-700 mb-2">
          5.4 אפשרויות הזמנה ורכישה (אופציונלי)
        </label>
        <p className="text-xs text-gray-500 mb-2">איך לקוחות יכולים להזמין/לקנות, זמני אספקה, משלוחים (או קישור)</p>
        <textarea
          id="bookingOptions"
          {...register('section5.bookingOptions')}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
          placeholder="לדוגמה: ניתן להזמין דרך האתר, בטלפון או בוואטסאפ. משלוחים תוך 2-4 ימי עסקים. איסוף עצמי זמין בסניפים שלנו. או: https://example.com/order"
        />
      </div>

      {/* 5.5 References - Now Dynamic URL Fields */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">5.5 קישורים למקורות עזר</h3>
        <p className="text-sm text-gray-600 mb-4">
          הוסף קישורים לאתר, מדריכים, שאלות נפוצות, קטלוגים וכל מקור מידע רלוונטי נוסף
        </p>

        <div className="space-y-3">
          {references.map((_, index) => (
            <div key={index} className="flex gap-2">
              <LinkIcon className="w-5 h-5 text-gray-400 mt-3 flex-shrink-0" />
              <input
                type="url"
                {...register(`section5.references.${index}` as any)}
                className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  errors.section5?.references?.[index]
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder={`קישור ${index + 1} - לדוגמה: https://example.com/faq`}
              />
              {references.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeReference(index)}
                  className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex-shrink-0"
                  title="מחק קישור"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {references.length < 10 && (
          <button
            type="button"
            onClick={addReference}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
          >
            <Plus className="w-5 h-5" />
            הוסף קישור נוסף
          </button>
        )}

        {errors.section5?.references && typeof errors.section5.references === 'object' && 'message' in errors.section5.references && (
          <p className="mt-2 text-sm text-red-600">{errors.section5.references.message as string}</p>
        )}
      </div>

      {/* Separate Documentation */}
      <div>
        <label className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <input
            type="checkbox"
            {...register('section5.separateDocumentation')}
            className="mt-1 ml-3 h-4 w-4 text-primary-600 focus:ring-primary-500 rounded"
          />
          <div>
            <span className="text-gray-900 font-medium">אספק תיעוד נוסף בנפרד</span>
            <p className="text-sm text-gray-600 mt-1">
              סמן אם יש לך קבצים או מסמכים נוספים (PDF, Excel, Word) שתרצה לספק בנפרד
            </p>
          </div>
        </label>
      </div>
    </div>
  );
};

export default Section5;
