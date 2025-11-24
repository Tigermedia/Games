import React, { useState, useEffect } from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { FormData } from '../types/form';

interface Section3Props {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  watch: UseFormWatch<FormData>;
  setValue: UseFormSetValue<FormData>;
}

const roleOptions = [
  'נציג שירות לקוחות',
  'יועץ מכירות',
  'מתאם פגישות',
  'מומחה טכני',
  'מנהל קשרי לקוחות',
  'נציג תמיכה',
  'יועץ פיננסי',
  'מנהל חשבון',
];

const personalityPresets = [
  {
    value: 'helpful-patient',
    label: 'עוזר וסבלני',
    traits: 'סבלני, מקשיב בקפידה, מסביר בבהירות, מעודד, מכבד את זמן הלקוח, נחוש למצוא פתרונות',
  },
  {
    value: 'professional-efficient',
    label: 'מקצועי ויעיל',
    traits: 'ממוקד, יעיל, עניני, מדויק, מקצועי, מסודר בעבודה, מספק מידע רלוונטי בלבד',
  },
  {
    value: 'friendly-warm',
    label: 'חברותי וחם',
    traits: 'חברי, חם, נגיש, אופטימי, יוצר קשר אישי, משתמש בהומור במידה, מעורר אמון',
  },
  {
    value: 'expert-confident',
    label: 'מומחה ובטוח',
    traits: 'בטוח בעצמו, מקצועי ברמה גבוהה, בעל ידע רחב, מסוגל להתמודד עם אתגרים, מעביר ביטחון',
  },
  {
    value: 'empathetic-caring',
    label: 'אמפתי ואכפתי',
    traits: 'אמפתי, אכפתי, מבין צרכים רגשיים, תומך, מרגיע, מראה הבנה אמיתית, מתחשב ברגשות',
  },
  {
    value: 'custom',
    label: 'מותאם אישית',
    traits: '',
  },
];

const Section3: React.FC<Section3Props> = ({ register, errors, watch, setValue }) => {
  const selectedLanguage = watch('section3.responseStyle.language');
  const selectedPersonality = watch('section3.personalityTraitsPreset');
  const responsibilities = watch('section3.responsibilities') || [''];

  const [roleInput, setRoleInput] = useState('');

  // Initialize responsibilities array if empty
  useEffect(() => {
    if (!responsibilities || responsibilities.length === 0) {
      setValue('section3.responsibilities', ['']);
    }
  }, [responsibilities, setValue]);

  const addResponsibility = () => {
    setValue('section3.responsibilities', [...responsibilities, '']);
  };

  const removeResponsibility = (index: number) => {
    if (responsibilities.length > 1) {
      const newResponsibilities = responsibilities.filter((_, i) => i !== index);
      setValue('section3.responsibilities', newResponsibilities);
    }
  };

  const handleRoleSelect = (role: string) => {
    setValue('section3.role', role);
    setRoleInput(role);
  };

  const handlePersonalitySelect = (preset: typeof personalityPresets[0]) => {
    setValue('section3.personalityTraitsPreset', preset.value);
    if (preset.value !== 'custom') {
      setValue('section3.personalityTraitsCustom', preset.traits);
    } else {
      setValue('section3.personalityTraitsCustom', '');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">פרסונה ותפקיד</h2>
        <p className="text-gray-600 mb-6">הגדר את האופי, התפקיד וסגנון התקשורת של הסוכן</p>
      </div>

      {/* 3.1 Role with preset options */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">3.1 תפקיד</h3>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          מהו התפקיד העיקרי של הסוכן? <span className="text-red-500">*</span>
        </label>

        {/* Preset role buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {roleOptions.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => handleRoleSelect(role)}
              className={`px-4 py-2 text-sm border rounded-lg transition-all ${
                watch('section3.role') === role
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400 hover:bg-primary-50'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Custom role input */}
        <input
          type="text"
          {...register('section3.role')}
          value={roleInput}
          onChange={(e) => {
            setRoleInput(e.target.value);
            setValue('section3.role', e.target.value);
          }}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
            errors.section3?.role ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder='בחר מהאפשרויות למעלה או הקלד תפקיד אחר...'
        />
        {errors.section3?.role && (
          <p className="mt-2 text-sm text-red-600">{errors.section3.role.message}</p>
        )}
      </div>

      {/* 3.2 Dynamic Key Responsibilities */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">3.2 אחריות עיקרית</h3>
        <p className="text-sm text-gray-600 mb-4">הוסף לפחות אחריות אחת. ניתן להוסיף עד 10 אחריות.</p>

        <div className="space-y-3">
          {responsibilities.map((_, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                {...register(`section3.responsibilities.${index}` as any)}
                className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  errors.section3?.responsibilities?.[index]
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder={`אחריות ${index + 1} - לדוגמה: "מענה על שאלות לגבי מוצרים"`}
              />
              {responsibilities.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeResponsibility(index)}
                  className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  title="מחק אחריות"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {responsibilities.length < 10 && (
          <button
            type="button"
            onClick={addResponsibility}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
          >
            <Plus className="w-5 h-5" />
            הוסף אחריות נוספת
          </button>
        )}

        {errors.section3?.responsibilities && typeof errors.section3.responsibilities === 'object' && 'message' in errors.section3.responsibilities && (
          <p className="mt-2 text-sm text-red-600">{errors.section3.responsibilities.message as string}</p>
        )}
      </div>

      {/* 3.3 Response Style */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">3.3 סגנון תגובה</h3>
        <div className="space-y-6">
          {/* Communication Tone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              טון תקשורת <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { value: 'formal', label: 'רשמי' },
                { value: 'professional', label: 'מקצועי' },
                { value: 'friendly', label: 'חברי' },
                { value: 'familial', label: 'משפחתי' },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="radio"
                    {...register('section3.responseStyle.tone')}
                    value={option.value}
                    className="ml-3 h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-gray-900">{option.label}</span>
                </label>
              ))}
            </div>
            {errors.section3?.responseStyle?.tone && (
              <p className="mt-2 text-sm text-red-600">{errors.section3.responseStyle.tone.message}</p>
            )}
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              שפה <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: 'hebrew', label: 'עברית' },
                { value: 'english', label: 'אנגלית' },
                { value: 'arabic', label: 'ערבית' },
                { value: 'other', label: 'אחר' },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="radio"
                    {...register('section3.responseStyle.language')}
                    value={option.value}
                    className="ml-3 h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-gray-900">{option.label}</span>
                </label>
              ))}
            </div>
            {selectedLanguage === 'other' && (
              <input
                type="text"
                {...register('section3.responseStyle.otherLanguage')}
                className="mt-3 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="ציין שפה..."
              />
            )}
            {errors.section3?.responseStyle?.language && (
              <p className="mt-2 text-sm text-red-600">{errors.section3.responseStyle.language.message}</p>
            )}
          </div>

          {/* Emoji Usage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              שימוש באימוג'י <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { value: 'many', label: 'כן, הרבה 😊🎉✨' },
                { value: 'sometimes', label: 'מדי פעם 😊' },
                { value: 'never', label: 'אף פעם' },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="radio"
                    {...register('section3.responseStyle.emojiUsage')}
                    value={option.value}
                    className="ml-3 h-4 w-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-gray-900">{option.label}</span>
                </label>
              ))}
            </div>
            {errors.section3?.responseStyle?.emojiUsage && (
              <p className="mt-2 text-sm text-red-600">{errors.section3.responseStyle.emojiUsage.message}</p>
            )}
          </div>

          {/* Response Length */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              אורך תגובה <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { value: 'short', label: 'קצר ותמציתי', desc: '1-2 משפטים' },
                { value: 'medium', label: 'בינוני', desc: '2-4 משפטים' },
                { value: 'detailed', label: 'מפורט', desc: '4+ משפטים' },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex flex-col p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      {...register('section3.responseStyle.responseLength')}
                      value={option.value}
                      className="ml-3 h-4 w-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-gray-900 font-medium">{option.label}</span>
                  </div>
                  <span className="text-sm text-gray-600 mr-7">{option.desc}</span>
                </label>
              ))}
            </div>
            {errors.section3?.responseStyle?.responseLength && (
              <p className="mt-2 text-sm text-red-600">{errors.section3.responseStyle.responseLength.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* 3.4 Personality Traits with presets */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">3.4 תכונות אישיות</h3>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          בחר פרופיל אישיות או הגדר תכונות מותאמות אישית <span className="text-red-500">*</span>
        </label>

        {/* Personality preset buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {personalityPresets.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => handlePersonalitySelect(preset)}
              className={`p-4 text-right border rounded-lg transition-all ${
                selectedPersonality === preset.value
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400 hover:bg-primary-50'
              }`}
            >
              <div className="font-semibold mb-1">{preset.label}</div>
              {preset.traits && (
                <div className={`text-sm ${selectedPersonality === preset.value ? 'text-primary-100' : 'text-gray-600'}`}>
                  {preset.traits}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Custom traits input - shown when custom is selected */}
        {selectedPersonality === 'custom' && (
          <div>
            <label htmlFor="personalityTraitsCustom" className="block text-sm font-medium text-gray-700 mb-2">
              תאר את תכונות האישיות של הסוכן
            </label>
            <textarea
              id="personalityTraitsCustom"
              {...register('section3.personalityTraitsCustom')}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none ${
                errors.section3?.personalityTraitsCustom ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="לדוגמה: סבלני, מקשיב, מסביר בבהירות, אופטימי, נחוש למצוא פתרונות, מכבד את זמן הלקוח"
            />
            {errors.section3?.personalityTraitsCustom && (
              <p className="mt-2 text-sm text-red-600">{errors.section3.personalityTraitsCustom.message}</p>
            )}
          </div>
        )}

        {/* Hidden field for preset */}
        <input type="hidden" {...register('section3.personalityTraitsPreset')} />
      </div>
    </div>
  );
};

export default Section3;
