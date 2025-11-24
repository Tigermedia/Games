import { FormData } from '../types/form';

export const exportToJSON = (data: FormData, filename: string = 'agent-config.json'): void => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const generateEmailBody = (data: FormData): string => {
  const sections = [
    '=== הגדרות סוכן AI ===\n',
    '\n--- שם הסוכן ---',
    `${data.section1.agentName}\n`,
    '\n--- תיאור הסוכן ---',
    `${data.section2.agentDescription}\n`,
    '\n--- פרסונה ותפקיד ---',
    `תפקיד: ${data.section3.role}`,
    '\nאחריות עיקרית:',
    ...data.section3.responsibilities.map((resp, index) => `${index + 1}. ${resp}`),
    '\nסגנון תגובה:',
    `טון: ${getToneLabel(data.section3.responseStyle.tone)}`,
    `שפה: ${data.section3.responseStyle.language}${data.section3.responseStyle.otherLanguage ? ` (${data.section3.responseStyle.otherLanguage})` : ''}`,
    `שימוש באימוג'י: ${getEmojiLabel(data.section3.responseStyle.emojiUsage)}`,
    `אורך תגובה: ${getLengthLabel(data.section3.responseStyle.responseLength)}`,
    `\nתכונות אישיות: ${data.section3.personalityTraitsPreset === 'custom' ? data.section3.personalityTraitsCustom : getPersonalityLabel(data.section3.personalityTraitsPreset || '')}\n`,
    '\n--- מיומנויות ---',
    'יכולות ליבה:',
    ...Object.entries(data.section4.coreCapabilities)
      .filter(([key, value]) => value && key !== 'otherText')
      .map(([key]) => `- ${getCapabilityLabel(key)}`),
    data.section4.coreCapabilities.other && data.section4.coreCapabilities.otherText
      ? `- ${data.section4.coreCapabilities.otherText}`
      : '',
    '\nתרחישי עבודה:',
    `ברכת פתיחה: ${data.section4.workflows.greeting}`,
    `עזרה למשתמש: ${data.section4.workflows.helpRequest}`,
    `אי-יכולת לעזור: ${data.section4.workflows.cannotHelp}`,
    `משתמש מתוסכל: ${data.section4.workflows.frustrated}`,
    data.section4.workflows.additional ? `תרחישים נוספים: ${data.section4.workflows.additional}` : '',
    '\n--- מידע על מוצרים ושירותים ---',
    data.section5.aboutBusiness ? `אודות העסק: ${data.section5.aboutBusiness}` : '',
    data.section5.aboutBusinessUrl ? `קישור אודות: ${data.section5.aboutBusinessUrl}` : '',
    `\nסקירת מוצרים: ${data.section5.productsOverview}`,
    data.section5.specifications ? `\nמפרט: ${data.section5.specifications}` : '',
    data.section5.pricing ? `\nמחירון: ${data.section5.pricing}` : '',
    data.section5.bookingOptions ? `\nהזמנות: ${data.section5.bookingOptions}` : '',
    data.section5.references && data.section5.references.length > 0 ? '\nקישורים למקורות:' : '',
    ...(data.section5.references || []).filter(ref => ref).map((ref, index) => `${index + 1}. ${ref}`),
    data.section5.separateDocumentation ? '\n[מסומן: תיעוד נוסף יסופק בנפרד]' : '',
    '\n--- אילוצים ומגבלות ---',
    `נושאים לדיון: ${data.section6.shouldDiscuss}`,
    `נושאים לא לדיון: ${data.section6.shouldNotDiscuss}`,
    data.section6.confidentialInfo ? `מידע סודי: ${data.section6.confidentialInfo}` : '',
    '\nהגבלות התנהגות:',
    ...Object.entries(data.section6.behavioralRestrictions)
      .filter(([key, value]) => value && key !== 'otherText')
      .map(([key]) => `- ${getRestrictionLabel(key)}`),
    data.section6.behavioralRestrictions.other && data.section6.behavioralRestrictions.otherText
      ? `- ${data.section6.behavioralRestrictions.otherText}`
      : '',
    `\nכללי העברה: ${data.section6.escalationRules}`,
    '\n--- פרטי יצירת קשר ---',
    `שם: ${data.contact.fullName}`,
    `אימייל: ${data.contact.email}`,
    `טלפון: ${data.contact.phone}`,
    `חברה: ${data.contact.companyName}`,
  ];

  return sections.filter(Boolean).join('\n');
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

export const openEmailClient = (data: FormData): void => {
  const subject = encodeURIComponent(`הגדרות סוכן AI - ${data.section1.agentName}`);
  const body = encodeURIComponent(generateEmailBody(data));
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
};

// Helper functions for labels
const getToneLabel = (tone: string): string => {
  const labels: Record<string, string> = {
    formal: 'רשמי',
    professional: 'מקצועי',
    friendly: 'חברי',
    familial: 'משפחתי',
  };
  return labels[tone] || tone;
};

const getEmojiLabel = (usage: string): string => {
  const labels: Record<string, string> = {
    many: 'כן, הרבה',
    sometimes: 'מדי פעם',
    never: 'אף פעם',
  };
  return labels[usage] || usage;
};

const getLengthLabel = (length: string): string => {
  const labels: Record<string, string> = {
    short: 'קצר ותמציתי',
    medium: 'בינוני',
    detailed: 'מפורט',
  };
  return labels[length] || length;
};

const getCapabilityLabel = (key: string): string => {
  const labels: Record<string, string> = {
    faq: 'מענה על שאלות נפוצות',
    leadGeneration: 'איסוף מידע על משתמשים (יצירת לידים)',
    orderProcessing: 'עיבוד הזמנות/הזמנות תורים',
    productRecommendations: 'מתן המלצות על מוצרים',
    technicalSupport: 'פתרון בעיות טכניות',
    scheduling: 'קביעת פגישות',
    humanEscalation: 'העברה לנציג אנושי',
  };
  return labels[key] || key;
};

const getRestrictionLabel = (key: string): string => {
  const labels: Record<string, string> = {
    noDeliveryPromises: 'לעולם לא להבטיח זמני אספקה',
    noLegalMedicalFinancialAdvice: 'לעולם לא לתת ייעוץ משפטי/רפואי/פיננסי',
    noCompetitorDiscussion: 'לעולם לא לדבר על מתחרים',
    noPricingWithoutApproval: 'לעולם לא לשתף מחירים/הנחות פנימיות ללא אישור',
  };
  return labels[key] || key;
};

const getPersonalityLabel = (preset: string): string => {
  const labels: Record<string, string> = {
    'helpful-patient': 'עוזר וסבלני - סבלני, מקשיב בקפידה, מסביר בבהירות, מעודד, מכבד את זמן הלקוח, נחוש למצוא פתרונות',
    'professional-efficient': 'מקצועי ויעיל - ממוקד, יעיל, עניני, מדויק, מקצועי, מסודר בעבודה, מספק מידע רלוונטי בלבד',
    'friendly-warm': 'חברותי וחם - חברי, חם, נגיש, אופטימי, יוצר קשר אישי, משתמש בהומור במידה, מעורר אמון',
    'expert-confident': 'מומחה ובטוח - בטוח בעצמו, מקצועי ברמה גבוהה, בעל ידע רחב, מסוגל להתמודד עם אתגרים, מעביר ביטחון',
    'empathetic-caring': 'אמפתי ואכפתי - אמפתי, אכפתי, מבין צרכים רגשיים, תומך, מרגיע, מראה הבנה אמיתית, מתחשב ברגשות',
  };
  return labels[preset] || preset;
};
