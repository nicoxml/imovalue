
import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/ui/Layout';
import { Dashboard } from './components/Dashboard';
import { BuyerCalculator } from './components/calculators/BuyerCalculator';
import { RentalCalculator } from './components/calculators/RentalCalculator';
import { SellerCalculator } from './components/calculators/SellerCalculator';
import { FlipCalculator } from './components/calculators/FlipCalculator';
import { ComparisonView } from './components/tools/ComparisonView';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/auth/AuthPage';
import { SavedProperty, User, HistoryItem, CalculationType } from './types';
import { Toast } from './components/ui/Toast';
import { UpsellModal } from './components/ui/UpsellModal';
import { DemoLimitModal } from './components/ui/DemoLimitModal';
import { getCurrentUser } from './services/authService';
import { getUserHistory, saveHistoryItem, incrementUserCredits, getDemoUsage, incrementDemoUsage } from './services/db.ts';
import { getBrowserFingerprint } from './services/fingerprint';
import { PremiumBackground } from './components/ui/premium/Background';
import { SubscriptionManager } from './components/SubscriptionManager';
import { ClientArea } from './components/ClientArea';

const AppContent = () => {
  const [viewState, setViewState] = useState<'landing' | 'auth' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>([]);
  const [dashboardHistory, setDashboardHistory] = useState<HistoryItem[]>([]);
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' });
  const [user, setUser] = useState<User | null>(null);

  // Security State
  const [fingerprint, setFingerprint] = useState<string>('');

  // Upsell State
  const [showUpsell, setShowUpsell] = useState(false);
  const [showDemoLimit, setShowDemoLimit] = useState(false);

  // Initialize & Security Check
  useEffect(() => {
    const init = async () => {
      // 1. Generate Security Fingerprint
      const fp = await getBrowserFingerprint();
      setFingerprint(fp);

      // 2. Load User
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        const history = await getUserHistory(currentUser.id);
        setDashboardHistory(history);
        setViewState('app');
      }
    };
    init();
  }, []);

  const handleSaveToComparison = (property: SavedProperty) => {
    setSavedProperties(prev => [...prev, property]);
    setToast({ visible: true, message: `${property.name} adicionado ao comparador.` });
  };

  const handleRemoveFromComparison = (id: string) => {
    setSavedProperties(prev => prev.filter(p => p.id !== id));
  };

  const handleLoginSuccess = async (loggedInUser: User) => {
    setUser(loggedInUser);
    const history = await getUserHistory(loggedInUser.id);
    setDashboardHistory(history);
    setViewState('app');
  };

  const handleLogout = () => {
    setUser(null);
    setViewState('landing');
    setDashboardHistory([]);
    setSavedProperties([]);
  };

  const handleUpdatePlan = async (newPlan: 'free' | 'pro' | 'premium') => {
    if (!user) return;

    // Update in Supabase first
    const { updateUserPlan } = await import('./services/planService');
    const success = await updateUserPlan(user.id, newPlan);

    if (!success) {
      alert('❌ Erro ao atualizar plano. Tente novamente.');
      return;
    }

    // Update local state
    const updatedUser: User = {
      ...user,
      plan: newPlan,
      maxCredits: newPlan === 'free' ? 5 : -1,
    };

    setUser(updatedUser);

    // Success message
    alert(`✅ Plano atualizado para ${newPlan.toUpperCase()}!`);
  };

  const handleEnterDemo = () => {
    if (!fingerprint) return; // Wait for security check

    // Check usage based on Hardware Fingerprint
    const currentUsage = getDemoUsage(fingerprint);

    // Create temporary demo user reflecting REAL usage
    const demoUser: User = {
      id: `demo_${fingerprint.substring(0, 8)}`,
      name: 'Utilizador Demo',
      email: 'demo@imovalue.pt',
      plan: 'free',
      creditsUsed: currentUsage, // Load from DB using fingerprint
      maxCredits: 2,
      isDemo: true,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo'
    };

    setUser(demoUser);
    setDashboardHistory([]); // Start empty for demo
    setViewState('app');

    if (currentUsage < 2) {
      setActiveTab('buyer');
    } else {
      setActiveTab('dashboard');
      setShowDemoLimit(true);
    }
  };

  const handleDemoConversion = () => {
    setShowDemoLimit(false);
    handleLogout(); // Clear demo state
    setViewState('auth'); // Go to register
  };

  // Central Credit Consumption Logic
  const consumeCredit = async (): Promise<boolean> => {
    if (!user) return false;

    // Demo Logic Protected by Fingerprint
    if (user.isDemo) {
      if (!fingerprint) return false;

      const currentUsage = getDemoUsage(fingerprint);

      if (currentUsage >= 2) {
        setShowDemoLimit(true);
        setUser(prev => prev ? ({ ...prev, creditsUsed: currentUsage }) : null);
        return false;
      }

      const newUsage = incrementDemoUsage(fingerprint);

      setUser(prev => prev ? ({ ...prev, creditsUsed: newUsage }) : null);
      return true;
    }

    // Normal User Logic
    const updatedUser = await incrementUserCredits(user.id);

    if (updatedUser) {
      setUser(updatedUser);
      return true;
    } else {
      setShowUpsell(true);
      return false;
    }
  };

  const handleNewCalculation = (type: CalculationType, summary: string, displayValue: string, numericValue: number) => {
    if (!user) return;

    const newItem: HistoryItem = {
      id: Date.now().toString(),
      type,
      date: new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      summary,
      value: displayValue,
      numericValue
    };

    // Only save to DB if real user
    if (!user.isDemo) {
      saveHistoryItem(user.id, newItem);
    }
    setDashboardHistory(prev => [newItem, ...prev]);
  };

  const renderContent = () => {
    // Wrap calculators with credit check
    const withCreditCheck = (
      CalculatComponent: any,
      type: CalculationType
    ) => (
      <CalculatComponent
        onSave={handleSaveToComparison}
        onCalculate={(val: string, label: string, numVal: number) => handleNewCalculation(type, label, val, numVal)}
        onAttemptCalculate={consumeCredit}
        user={user!}
      />
    );

    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            onChangeTab={setActiveTab}
            user={user!}
            history={dashboardHistory}
          />
        );
      case 'subscription':
        return (
          <SubscriptionManager
            user={user!}
            onUpdatePlan={handleUpdatePlan}
          />
        );
      case 'comparison':
        return (
          <ComparisonView
            items={savedProperties}
            onRemove={handleRemoveFromComparison}
            onNavigate={setActiveTab}
          />
        );
      case 'buyer':
        return withCreditCheck(BuyerCalculator, CalculationType.BUYER);
      case 'rental':
        return withCreditCheck(RentalCalculator, CalculationType.RENTAL);
      case 'seller':
        return withCreditCheck(SellerCalculator, CalculationType.SELLER);
      case 'flip':
        return withCreditCheck(FlipCalculator, CalculationType.FLIP);
      case 'client-area':
        return <ClientArea user={user!} onLogout={handleLogout} onShowToast={(msg) => setToast({ visible: true, message: msg })} />;
      default:
        return <Dashboard onChangeTab={setActiveTab} user={user!} history={dashboardHistory} />;
    }
  };

  if (viewState === 'landing') {
    return <LandingPage onEnterApp={() => setViewState('auth')} onEnterDemo={handleEnterDemo} />;
  }

  if (viewState === 'auth') {
    return <AuthPage onSuccess={handleLoginSuccess} />;
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} user={user!} onLogout={handleLogout}>
      <PremiumBackground />

      {renderContent()}

      <Toast
        message={toast.message}
        isVisible={toast.visible}
        onClose={() => setToast(prev => ({ ...prev, visible: false }))}
      />

      <UpsellModal
        isOpen={showUpsell}
        onClose={() => setShowUpsell(false)}
        currentPlan={user?.plan || 'free'}
      />

      <DemoLimitModal
        isOpen={showDemoLimit}
        onClose={() => setShowDemoLimit(false)}
        onConvertToSignUp={handleDemoConversion}
      />
    </Layout>
  );
};

import { ThemeProvider } from './components/ui/ThemeContext';

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
