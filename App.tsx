import React, { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { generateSummary } from './services/geminiService';
import { Language, ProficiencyLevel, WordCount } from './types';
import { SelectionCard } from './components/SelectionCard';
import {
  BookOpen,
  FileText,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  AlertCircle,
  Moon,
  Sun,
  Printer
} from 'lucide-react';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(Language.PERSIAN);
  const [detectedLanguage, setDetectedLanguage] = useState<Language | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<ProficiencyLevel>(ProficiencyLevel.B2);
  const [selectedWordCount, setSelectedWordCount] = useState<WordCount>(WordCount.MEDIUM);
  
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize Dark Mode
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Simple heuristic language detection
  const detectLanguage = useCallback((text: string) => {
    if (!text || text.length < 10) return;

    const sample = text.substring(0, 100);
    const persianRegex = /[\u0600-\u06FF]/;
    const germanRegex = /[äöüßÄÖÜ]/;

    let detected = Language.ENGLISH; // Default fallback
    
    if (persianRegex.test(sample)) {
      detected = Language.PERSIAN;
    } else if (germanRegex.test(sample)) {
      detected = Language.GERMAN;
    } else {
      // Check for common German words if no special chars
      const germanWords = ['der', 'die', 'das', 'und', 'ist', 'ich'];
      const words = sample.toLowerCase().split(/\s+/);
      if (words.some(w => germanWords.includes(w))) {
        detected = Language.GERMAN;
      }
    }

    setDetectedLanguage(detected);
    setSelectedLanguage(detected);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      detectLanguage(inputText);
    }, 500);
    return () => clearTimeout(timer);
  }, [inputText, detectLanguage]);

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      setError('لطفا متن زیرنویس را وارد کنید.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setOutput('');

    try {
      const result = await generateSummary({
        text: inputText,
        language: selectedLanguage,
        level: selectedLevel,
        wordCount: selectedWordCount
      });
      setOutput(result);
    } catch (err: any) {
      setError(err.message || 'خطایی رخ داد.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getLanguageLabel = (lang: Language) => {
    const baseLabel = lang === Language.PERSIAN ? 'فارسی' : lang === Language.ENGLISH ? 'English' : 'Deutsch';
    if (detectedLanguage === lang) {
      return `پیش‌فرض (${baseLabel})`;
    }
    return baseLabel;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4 md:px-8 transition-colors duration-300 print:p-0 print:bg-white" dir="rtl">
      <div className="max-w-4xl mx-auto print:max-w-none print:mx-0">
        {/* Header - Hidden on Print */}
        <header className="mb-8 relative print:hidden">
          <button 
            onClick={toggleDarkMode}
            className="absolute left-0 top-2 p-2 rounded-full bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all"
            title={isDarkMode ? 'حالت روشن' : 'حالت تاریک'}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className="text-center">
            <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm mb-4 transition-colors">
              <Sparkles className="w-8 h-8 text-primary-500 ml-2" />
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                بازنویسی هوشمند <span className="text-primary-600 dark:text-primary-400">زیرنویس</span>
              </h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-lg mx-auto">
              متن زیرنویس یوتیوب را وارد کنید تا با کمک هوش مصنوعی، متنی روان و مناسب سطح زبان شما تولید شود.
            </p>
          </div>
        </header>

        <main className="space-y-6 print:space-y-0">
          {/* Input Section - Hidden on Print */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors print:hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-400" />
              <h2 className="font-semibold text-slate-700 dark:text-slate-200">متن ورودی</h2>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="متن زیرنویس خود را اینجا پیست کنید..."
              className="w-full h-48 p-4 resize-y focus:outline-none focus:bg-slate-50 dark:focus:bg-slate-900/50 transition-colors text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 leading-relaxed bg-transparent"
              dir="auto"
            />
          </div>

          {/* Configuration Section - Hidden on Print */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 transition-colors print:hidden">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="w-5 h-5 text-primary-500" />
              <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">تنظیمات خروجی</h2>
            </div>

            <SelectionCard
              title="زبان مقصد"
              selectedValue={selectedLanguage}
              onChange={setSelectedLanguage}
              disabled={isLoading}
              options={[
                { value: Language.PERSIAN, label: getLanguageLabel(Language.PERSIAN) },
                { value: Language.ENGLISH, label: getLanguageLabel(Language.ENGLISH) },
                { value: Language.GERMAN, label: getLanguageLabel(Language.GERMAN) },
              ]}
            />

            <SelectionCard
              title="سطح زبان (CEFR)"
              selectedValue={selectedLevel}
              onChange={setSelectedLevel}
              disabled={isLoading}
              options={[
                { value: ProficiencyLevel.B1, label: 'B1', subLabel: 'متوسط' },
                { value: ProficiencyLevel.B2, label: 'B2', subLabel: 'متوسط رو به بالا' },
                { value: ProficiencyLevel.C1, label: 'C1', subLabel: 'پیشرفته' },
              ]}
            />

            <SelectionCard
              title="حجم متن"
              selectedValue={selectedWordCount}
              onChange={setSelectedWordCount}
              disabled={isLoading}
              options={[
                { value: WordCount.SHORT, label: '۱۰۰ کلمه', subLabel: 'خلاصه کوتاه' },
                { value: WordCount.MEDIUM, label: '۳۰۰ کلمه', subLabel: 'استاندارد' },
                { value: WordCount.LONG, label: '۶۰۰ کلمه', subLabel: 'جامع' },
              ]}
            />

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-2 text-sm border border-red-100 dark:border-red-800/30">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isLoading || !inputText}
              className={`
                w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform active:scale-[0.99]
                ${isLoading 
                  ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-wait' 
                  : 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 hover:-translate-y-0.5'
                }
              `}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  <span>در حال پردازش...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>ایجاد متن هوشمند</span>
                </>
              )}
            </button>
          </div>

          {/* Result Section */}
          {output && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-primary-100 dark:border-primary-900/50 overflow-hidden animate-fade-in-up transition-colors print:shadow-none print:border-0 print:rounded-none print:dark:bg-white">
               {/* Toolbar - Hidden on Print */}
               <div className="p-4 bg-primary-50 dark:bg-primary-900/20 border-b border-primary-100 dark:border-primary-900/30 flex items-center justify-between print:hidden">
                  <div className="flex items-center gap-2 text-primary-800 dark:text-primary-300">
                    <Check className="w-5 h-5" />
                    <h2 className="font-bold">متن تولید شده</h2>
                  </div>
                  <div className="flex gap-2">
                     <button 
                      onClick={handlePrint}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600"
                      title="چاپ / PDF"
                     >
                       <Printer className="w-4 h-4" />
                       <span className="hidden sm:inline">چاپ PDF</span>
                     </button>
                     <button 
                      onClick={() => setOutput('')}
                      className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-colors"
                      title="شروع مجدد"
                     >
                       <RotateCcw className="w-4 h-4" />
                     </button>
                     <button 
                      onClick={copyToClipboard}
                      className={`
                        flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                        ${isCopied 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-white text-primary-700 hover:bg-primary-100 dark:bg-slate-700 dark:text-primary-300 dark:hover:bg-slate-600'
                        }
                      `}
                     >
                       {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                       {isCopied ? 'کپی شد' : 'کپی متن'}
                     </button>
                  </div>
               </div>
               
               {/* Content Area */}
               <div className="p-6 bg-white dark:bg-slate-800 min-h-[200px] print:p-0 print:bg-white print:dark:bg-white print:text-black">
                 <article 
                  className="prose prose-slate dark:prose-invert max-w-none leading-8 print:prose-headings:text-black print:prose-p:text-black print:text-black"
                  dir={selectedLanguage === Language.PERSIAN ? 'rtl' : 'ltr'}
                 >
                   <ReactMarkdown>{output}</ReactMarkdown>
                 </article>
               </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;