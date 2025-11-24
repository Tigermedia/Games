import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { FormData } from '../types/form';

interface ContactSectionProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

const ContactSection: React.FC<ContactSectionProps> = ({ register, errors }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">פרטי יצירת קשר</h2>
        <p className="text-gray-600 mb-6">נא למלא את פרטיך כדי שנוכל ליצור איתך קשר</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            שם מלא <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            {...register('contact.fullName')}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
              errors.contact?.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="ישראל ישראלי"
          />
          {errors.contact?.fullName && (
            <p className="mt-2 text-sm text-red-600">{errors.contact.fullName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            אימייל <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            {...register('contact.email')}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
              errors.contact?.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="email@example.com"
          />
          {errors.contact?.email && (
            <p className="mt-2 text-sm text-red-600">{errors.contact.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            טלפון <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            {...register('contact.phone')}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
              errors.contact?.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="050-1234567"
          />
          {errors.contact?.phone && (
            <p className="mt-2 text-sm text-red-600">{errors.contact.phone.message}</p>
          )}
        </div>

        {/* Company Name */}
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
            שם החברה <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="companyName"
            {...register('contact.companyName')}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
              errors.contact?.companyName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="שם החברה שלך"
          />
          {errors.contact?.companyName && (
            <p className="mt-2 text-sm text-red-600">{errors.contact.companyName.message}</p>
          )}
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          🔒 <strong>פרטיותך חשובה לנו.</strong> המידע ישמש אך ורק ליצירת קשר איתך לגבי הגדרת הסוכן.
          לא נשתף את הפרטים עם גורמים שלישיים.
        </p>
      </div>
    </div>
  );
};

export default ContactSection;
