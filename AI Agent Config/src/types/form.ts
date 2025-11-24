import { z } from 'zod';

// Section 1: Agent Name
export const section1Schema = z.object({
  agentName: z.string().min(1, 'שם הסוכן הוא שדה חובה'),
});

// Section 2: Agent Description
export const section2Schema = z.object({
  agentDescription: z.string()
    .min(20, 'התיאור חייב להכיל לפחות 20 תווים')
    .max(500, 'התיאור לא יכול להכיל יותר מ-500 תווים'),
});

// Section 3: Persona & Role
export const section3Schema = z.object({
  role: z.string().min(1, 'תפקיד הסוכן הוא שדה חובה'),
  responsibilities: z.array(z.string().min(1, 'אחריות לא יכולה להיות ריקה')).min(1, 'יש להוסיף לפחות אחריות אחת'),
  responseStyle: z.object({
    tone: z.enum(['formal', 'professional', 'friendly', 'familial'], {
      required_error: 'יש לבחור טון תקשורת',
    }),
    language: z.string().min(1, 'יש לבחור שפה'),
    otherLanguage: z.string().optional(),
    emojiUsage: z.enum(['many', 'sometimes', 'never'], {
      required_error: 'יש לבחור שימוש באימוג\'י',
    }),
    responseLength: z.enum(['short', 'medium', 'detailed'], {
      required_error: 'יש לבחור אורך תגובה',
    }),
  }),
  personalityTraitsPreset: z.string().optional(),
  personalityTraitsCustom: z.string().optional(),
}).refine(
  (data) => data.personalityTraitsPreset === 'custom' ? (data.personalityTraitsCustom && data.personalityTraitsCustom.length >= 10) : !!data.personalityTraitsPreset,
  {
    message: 'יש לבחור תכונות אישיות או להזין תכונות מותאמות אישית',
    path: ['personalityTraitsCustom'],
  }
);

// Section 4: Skills
export const section4Schema = z.object({
  coreCapabilities: z.object({
    faq: z.boolean(),
    leadGeneration: z.boolean(),
    orderProcessing: z.boolean(),
    productRecommendations: z.boolean(),
    technicalSupport: z.boolean(),
    scheduling: z.boolean(),
    humanEscalation: z.boolean(),
    other: z.boolean(),
    otherText: z.string().optional(),
  }),
  workflows: z.object({
    greeting: z.string().min(10, 'תרחיש ברכת פתיחה הוא שדה חובה'),
    helpRequest: z.string().min(10, 'תרחיש עזרה הוא שדה חובה'),
    cannotHelp: z.string().min(10, 'תרחיש אי-יכולת לעזור הוא שדה חובה'),
    frustrated: z.string().min(10, 'תרחיש תסכול הוא שדה חובה'),
    additional: z.string().optional(),
  }),
});

// Section 5: Product & Service Information
export const section5Schema = z.object({
  aboutBusiness: z.string().optional(),
  aboutBusinessUrl: z.string().url('כתובת URL לא תקינה').optional().or(z.literal('')),
  productsOverview: z.string().min(20, 'סקירת מוצרים ושירותים היא שדה חובה'),
  specifications: z.string().optional(),
  pricing: z.string().optional(),
  bookingOptions: z.string().optional(),
  references: z.array(z.string().url('כתובת URL לא תקינה').or(z.literal(''))).optional(),
  separateDocumentation: z.boolean().default(false),
});

// Section 6: Constraints & Limitations
export const section6Schema = z.object({
  shouldDiscuss: z.string().min(10, 'נושאים שהסוכן צריך לדון בהם הוא שדה חובה'),
  shouldNotDiscuss: z.string().min(10, 'נושאים שהסוכן לא צריך לדון בהם הוא שדה חובה'),
  confidentialInfo: z.string().optional(),
  behavioralRestrictions: z.object({
    noDeliveryPromises: z.boolean(),
    noLegalMedicalFinancialAdvice: z.boolean(),
    noCompetitorDiscussion: z.boolean(),
    noPricingWithoutApproval: z.boolean(),
    other: z.boolean(),
    otherText: z.string().optional(),
  }),
  escalationRules: z.string().min(10, 'כללי העברה לנציג אנושי הם שדה חובה'),
});

// Contact Information
export const contactSchema = z.object({
  fullName: z.string().min(2, 'שם מלא הוא שדה חובה'),
  email: z.string().email('כתובת אימייל לא תקינה'),
  phone: z.string().min(9, 'מספר טלפון לא תקין'),
  companyName: z.string().min(2, 'שם החברה הוא שדה חובה'),
});

// Complete Form Schema
export const formSchema = z.object({
  section1: section1Schema,
  section2: section2Schema,
  section3: section3Schema,
  section4: section4Schema,
  section5: section5Schema,
  section6: section6Schema,
  contact: contactSchema,
});

export type FormData = z.infer<typeof formSchema>;
export type Section1Data = z.infer<typeof section1Schema>;
export type Section2Data = z.infer<typeof section2Schema>;
export type Section3Data = z.infer<typeof section3Schema>;
export type Section4Data = z.infer<typeof section4Schema>;
export type Section5Data = z.infer<typeof section5Schema>;
export type Section6Data = z.infer<typeof section6Schema>;
export type ContactData = z.infer<typeof contactSchema>;
