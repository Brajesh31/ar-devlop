import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Settings, Check } from 'lucide-react';
import { Button } from './button';
import { Link } from 'react-router-dom';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

const COOKIE_CONSENT_KEY = 'bharatxr_cookie_consent';

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Delay showing popup for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(allAccepted));
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(onlyNecessary));
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(preferences));
    setIsVisible(false);
    setShowPreferences(false);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Can't toggle necessary cookies
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const PreferenceItem = ({ 
    label, 
    description, 
    cookieKey, 
    disabled = false 
  }: { 
    label: string; 
    description: string; 
    cookieKey: keyof CookiePreferences;
    disabled?: boolean;
  }) => (
    <div className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0">
      <button
        onClick={() => togglePreference(cookieKey)}
        disabled={disabled}
        className={`mt-0.5 w-10 h-6 rounded-full flex items-center transition-colors ${
          preferences[cookieKey] 
            ? 'bg-primary justify-end' 
            : 'bg-muted justify-start'
        } ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span className={`w-5 h-5 rounded-full bg-white shadow-sm mx-0.5 transition-transform flex items-center justify-center`}>
          {preferences[cookieKey] && <Check className="w-3 h-3 text-primary" />}
        </span>
      </button>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
        >
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="p-5 pb-4 border-b border-border/50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Cookie className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {showPreferences ? 'Cookie Preferences' : 'Accept the use of cookies'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsVisible(false)}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {showPreferences ? (
                  <div className="space-y-1">
                    <PreferenceItem
                      label="Necessary Cookies"
                      description="Essential for the website to function. Cannot be disabled."
                      cookieKey="necessary"
                      disabled
                    />
                    <PreferenceItem
                      label="Analytics Cookies"
                      description="Help us understand how visitors interact with our website."
                      cookieKey="analytics"
                    />
                    <PreferenceItem
                      label="Marketing Cookies"
                      description="Used to deliver personalized advertisements."
                      cookieKey="marketing"
                    />
                    <PreferenceItem
                      label="Preference Cookies"
                      description="Remember your settings and preferences for a better experience."
                      cookieKey="preferences"
                    />
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We use cookies to improve your browsing experience, serve personalized content, and analyze our traffic. 
                    By clicking <strong className="text-foreground">Accept All Cookies</strong>, you agree to the storing of cookies on your device. 
                    You can customize your settings by clicking <strong className="text-foreground">Manage Preferences</strong>. 
                    For more information, please review our{' '}
                    <Link to="/cookie-policy" className="text-primary hover:underline">Cookie Policy</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="p-5 pt-0 flex flex-col sm:flex-row gap-3">
                {showPreferences ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setShowPreferences(false)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleSavePreferences}
                      className="flex-1"
                    >
                      Save Preferences
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleRejectAll}
                      className="flex-1 sm:flex-none"
                    >
                      Reject All
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowPreferences(true)}
                      className="flex-1 sm:flex-none gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Manage Preferences
                    </Button>
                    <Button
                      onClick={handleAcceptAll}
                      className="flex-1"
                    >
                      Accept All Cookies
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
