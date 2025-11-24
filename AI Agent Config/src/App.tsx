import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'convex/react';
import { Save, Download, Mail, Trash2, FileText, CheckCircle, Menu, X } from 'lucide-react';
import { FormData, formSchema } from './types/form';
import { saveToLocalStorage, loadFromLocalStorage, clearLocalStorage } from './utils/storage';
import { exportToJSON, openEmailClient, copyToClipboard, generateEmailBody } from './utils/export';
import ProgressIndicator from './components/ProgressIndicator';
import Navigation from './components/Navigation';
import Section1 from './components/Section1';
import Section2 from './components/Section2';
import Section3 from './components/Section3';
import Section4 from './components/Section4';
import Section5 from './components/Section5';
import Section6 from './components/Section6';
import ContactSection from './components/ContactSection';
import { api } from '../convex/_generated/api';

const AUTOSAVE_INTERVAL = 30000; // 30 seconds

function App() {
  const [currentSection, setCurrentSection] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const submitFormMutation = useMutation(api.formSubmissions.submitForm);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
  });

  const totalSections = 7;

  // Load saved data on mount
  useEffect(() => {
    const savedData = loadFromLocalStorage();
    if (savedData) {
      Object.entries(savedData).forEach(([key, value]) => {
        setValue(key as any, value as any);
      });
    }
  }, [setValue]);

  // Auto-save functionality
  useEffect(() => {
    const interval = setInterval(() => {
      const formData = watch();
      if (Object.keys(formData).length > 0) {
        saveToLocalStorage(formData);
        setLastSaved(new Date());
      }
    }, AUTOSAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [watch]);

  const onSubmit = async (data: FormData) => {
    try {
      console.log('Form submitted:', data);

      // Submit to Convex (saves to DB and sends to webhook)
      const result = await submitFormMutation(data);

      console.log('Submission result:', result);

      if (result.webhookError) {
        console.warn('Webhook failed:', result.webhookError);
        // Still show success since data was saved
      }

      setShowSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Submission failed:', error);
      alert('שגיאה בשליחת הטופס. אנא נסה שוב.');
    }
  };

  const handleNext = () => {
    if (currentSection < totalSections - 1) {
      setCurrentSection(currentSection + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavigate = (section: number) => {
    setCurrentSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setShowSidebar(false);
  };

  const handleClearForm = () => {
    if (window.confirm('האם אתה בטוח שברצונך לנקות את כל הטופס? פעולה זו לא ניתנת לביטול.')) {
      reset();
      clearLocalStorage();
      setCurrentSection(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleExportJSON = () => {
    const formData = watch() as FormData;
    exportToJSON(formData);
  };

  const handleEmailExport = () => {
    const formData = watch() as FormData;
    openEmailClient(formData);
  };

  const handleCopyToClipboard = async () => {
    const formData = watch() as FormData;
    const text = generateEmailBody(formData);
    const success = await copyToClipboard(text);
    if (success) {
      alert('התוכן הועתק ללוח! 📋');
    } else {
      alert('שגיאה בהעתקה. נסה שוב.');
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return <ContactSection register={register} errors={errors} />;
      case 1:
        return <Section1 register={register} errors={errors} />;
      case 2:
        return <Section2 register={register} errors={errors} watch={watch} />;
      case 3:
        return <Section3 register={register} errors={errors} watch={watch} setValue={setValue} />;
      case 4:
        return <Section4 register={register} errors={errors} watch={watch} />;
      case 5:
        return <Section5 register={register} errors={errors} watch={watch} setValue={setValue} />;
      case 6:
        return <Section6 register={register} errors={errors} watch={watch} />;
      default:
        return null;
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">הטופס נשלח בהצלחה! 🎉</h1>
            <p className="text-lg text-gray-600 mb-8">
              תודה על מילוי טופס הגדרת הסוכן. נצור איתך קשר בקרוב כדי להתחיל בבניית הסוכן שלך.
            </p>

            <div className="space-y-4 mb-8">
              <button
                onClick={handleExportJSON}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                הורד כקובץ JSON
              </button>
              <button
                onClick={handleEmailExport}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Mail className="w-5 h-5" />
                שלח באימייל
              </button>
              <button
                onClick={handleCopyToClipboard}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                <FileText className="w-5 h-5" />
                העתק ללוח
              </button>
            </div>

            <button
              onClick={() => {
                setShowSuccess(false);
                handleClearForm();
              }}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              חזור לטופס
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {showSidebar ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">טופס הגדרת סוכן AI</h1>
            </div>
            <div className="flex items-center gap-2">
              {lastSaved && (
                <span className="text-xs text-gray-500 hidden sm:block">
                  נשמר: {lastSaved.toLocaleTimeString('he-IL')}
                </span>
              )}
              <button
                onClick={() => {
                  const formData = watch();
                  saveToLocalStorage(formData);
                  setLastSaved(new Date());
                  alert('הטופס נשמר! 💾');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">שמור</span>
              </button>
              <button
                onClick={handleClearForm}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">נקה</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {showSidebar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setShowSidebar(false)}>
          <div className="bg-white w-64 h-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">ניווט</h2>
            <nav className="space-y-2">
              {['פרטי קשר', 'שם הסוכן', 'תיאור', 'פרסונה ותפקיד', 'מיומנויות', 'מוצרים ושירותים', 'אילוצים'].map(
                (section, index) => (
                  <button
                    key={index}
                    onClick={() => handleNavigate(index)}
                    className={`w-full text-right px-4 py-2 rounded-lg transition-colors ${
                      currentSection === index
                        ? 'bg-primary-600 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {index + 1}. {section}
                  </button>
                )
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <ProgressIndicator
            currentSection={currentSection}
            totalSections={totalSections}
            onNavigate={handleNavigate}
          />

          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
            {renderSection()}
          </div>

          <Navigation
            currentSection={currentSection}
            totalSections={totalSections}
            onPrevious={handlePrevious}
            onNext={handleNext}
            isFirstSection={currentSection === 0}
            isLastSection={currentSection === totalSections - 1}
          />
        </form>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-6 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600">
          <p>© 2025 טופס הגדרת סוכן AI | כל הזכויות שמורות</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
