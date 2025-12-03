import React, { useState } from 'react';
import { PremiumCard } from './ui/premium/Card';
import { PremiumButton } from './ui/premium/Button';
import { PremiumInput } from './ui/premium/Input';
import { User as UserIcon, Building, CreditCard, Settings, LogOut, Check, Shield } from 'lucide-react';
import { Reveal } from './ui/premium/Reveal';
import { User } from '../types';

interface ClientAreaProps {
    user: User;
    onLogout: () => void;
    onShowToast: (message: string) => void;
}

export const ClientArea: React.FC<ClientAreaProps> = ({ user, onLogout, onShowToast }) => {
    const [activeTab, setActiveTab] = useState<'profile' | 'subscription' | 'branding'>('profile');
    const [isLoading, setIsLoading] = useState(false);

    // Mock state for profile form
    const [profile, setProfile] = useState({
        name: user?.name || '',
        email: user?.email || '',
        company: user?.companyName || '',
        phone: '',
        nif: ''
    });

    // Mock state for branding
    const [branding, setBranding] = useState({
        primaryColor: '#3B82F6',
        logoUrl: ''
    });

    const handleSaveProfile = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
        onShowToast('Perfil atualizado com sucesso');
    };

    const handleSaveBranding = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
        onShowToast('Branding atualizado com sucesso');
    };

    const handleManageSubscription = () => {
        onShowToast('Redirecionando para o portal de pagamentos...');
        setTimeout(() => {
            window.open('https://billing.stripe.com/p/login/test', '_blank');
        }, 1500);
    };

    if (!user) return null;

    return (
        <div className="min-h-screen pt-4 pb-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 animate-fade-in-up">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Área de Cliente</h1>
                    <p className="text-slate-500 dark:text-slate-400">Gerencie sua conta, subscrição e preferências.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <PremiumCard className="p-2 space-y-1">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === 'profile'
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <UserIcon className="w-5 h-5" />
                                <span className="font-medium">Perfil</span>
                            </button>

                            <button
                                onClick={() => setActiveTab('subscription')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === 'subscription'
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <CreditCard className="w-5 h-5" />
                                <span className="font-medium">Subscrição</span>
                            </button>

                            <button
                                onClick={() => setActiveTab('branding')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === 'branding'
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <Settings className="w-5 h-5" />
                                <span className="font-medium">Branding</span>
                            </button>

                            <div className="h-px bg-slate-200 dark:bg-slate-700 my-2 mx-2"></div>

                            <button
                                onClick={onLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-300 transition-all duration-200"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium">Sair</span>
                            </button>
                        </PremiumCard>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <Reveal key={activeTab}>
                            {activeTab === 'profile' && (
                                <div className="space-y-6">
                                    <PremiumCard className="p-6">
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                            <UserIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            Dados Pessoais
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <PremiumInput
                                                label="Nome Completo"
                                                value={profile.name}
                                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                            />
                                            <PremiumInput
                                                label="Email"
                                                value={profile.email}
                                                disabled
                                                className="opacity-50 cursor-not-allowed"
                                            />
                                            <PremiumInput
                                                label="Telefone"
                                                value={profile.phone}
                                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                                placeholder="+351 912 345 678"
                                            />
                                            <PremiumInput
                                                label="NIF"
                                                value={profile.nif}
                                                onChange={(e) => setProfile({ ...profile, nif: e.target.value })}
                                                placeholder="123 456 789"
                                            />
                                        </div>
                                    </PremiumCard>

                                    <PremiumCard className="p-6">
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                            <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            Dados da Empresa
                                        </h2>
                                        <div className="grid grid-cols-1 gap-6">
                                            <PremiumInput
                                                label="Nome da Empresa"
                                                value={profile.company}
                                                onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                                                placeholder="Ex: Imobiliária Silva & Santos"
                                            />
                                        </div>
                                    </PremiumCard>

                                    <div className="flex justify-end">
                                        <PremiumButton
                                            onClick={handleSaveProfile}
                                            variant="primary"
                                            className="w-full sm:w-auto px-8"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                                        </PremiumButton>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'subscription' && (
                                <div className="space-y-6">
                                    <PremiumCard className="p-6 bg-gradient-to-br from-white to-blue-50 dark:from-slate-900 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                            <div>
                                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Plano Atual</h2>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 capitalize">{user.plan}</span>
                                                    {user.plan !== 'free' && (
                                                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                                                            ATIVO
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <PremiumButton
                                                onClick={handleManageSubscription}
                                                variant="outline"
                                                className="w-full sm:w-auto"
                                            >
                                                Gerir Subscrição
                                            </PremiumButton>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                                            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Próxima Cobrança</p>
                                                <p className="text-lg font-medium text-slate-900 dark:text-white">26 Dez, 2024</p>
                                            </div>
                                            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Valor</p>
                                                <p className="text-lg font-medium text-slate-900 dark:text-white">€ {user.plan === 'premium' ? '19.00' : user.plan === 'pro' ? '9.90' : '0.00'}</p>
                                            </div>
                                            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Método</p>
                                                <div className="flex items-center gap-2">
                                                    <CreditCard className="w-4 h-4 text-slate-400" />
                                                    <p className="text-lg font-medium text-slate-900 dark:text-white">•••• 4242</p>
                                                </div>
                                            </div>
                                        </div>
                                    </PremiumCard>

                                    <PremiumCard className="p-6">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Funcionalidades Incluídas</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {[
                                                'Cálculos Ilimitados',
                                                'Relatórios PDF Profissionais',
                                                'Acesso ao IMOVALUE AI',
                                                'Comparador de Imóveis',
                                                'Histórico de Análises',
                                                'Suporte Prioritário'
                                            ].map((feature, i) => (
                                                <div key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                                                    <Check className="w-4 h-4 text-emerald-500" />
                                                    <span>{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </PremiumCard>
                                </div>
                            )}

                            {activeTab === 'branding' && (
                                <div className="space-y-6">
                                    <PremiumCard className="p-6">
                                        <div className="flex items-start justify-between mb-6">
                                            <div>
                                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                                    <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                    Personalização da Marca
                                                </h2>
                                                <p className="text-slate-500 dark:text-slate-400 text-sm">
                                                    Personalize os relatórios PDF com a identidade visual da sua empresa.
                                                </p>
                                            </div>
                                            {user.plan === 'free' && (
                                                <div className="px-3 py-1 rounded bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-1">
                                                    <Shield className="w-3 h-3" />
                                                    PREMIUM
                                                </div>
                                            )}
                                        </div>

                                        <div className={`space-y-6 ${user.plan === 'free' ? 'opacity-50 pointer-events-none' : ''}`}>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Cor Primária</label>
                                                <div className="flex items-center gap-4">
                                                    <input
                                                        type="color"
                                                        value={branding.primaryColor}
                                                        onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                                                        className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0"
                                                    />
                                                    <div className="flex-1">
                                                        <PremiumInput
                                                            value={branding.primaryColor}
                                                            onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                                                            placeholder="#000000"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Logo da Empresa</label>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex-1">
                                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                <svg className="w-8 h-8 mb-4 text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                                </svg>
                                                                <p className="mb-2 text-sm text-slate-500 dark:text-slate-400"><span className="font-semibold">Clique para enviar</span> ou arraste</p>
                                                                <p className="text-xs text-slate-400 dark:text-slate-500">SVG, PNG, JPG ou GIF (MAX. 2MB)</p>
                                                            </div>
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) {
                                                                        const reader = new FileReader();
                                                                        reader.onloadend = () => {
                                                                            setBranding({ ...branding, logoUrl: reader.result as string });
                                                                        };
                                                                        reader.readAsDataURL(file);
                                                                    }
                                                                }}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                                <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">Pré-visualização</h4>
                                                <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-slate-200">
                                                    {branding.logoUrl ? (
                                                        <img src={branding.logoUrl} alt="Logo Preview" className="h-8 object-contain" />
                                                    ) : (
                                                        <div className="h-8 w-24 bg-slate-200 rounded flex items-center justify-center text-xs text-slate-500">
                                                            Seu Logo
                                                        </div>
                                                    )}
                                                    <div className="h-8 w-px bg-slate-300"></div>
                                                    <div className="text-sm font-bold" style={{ color: branding.primaryColor }}>
                                                        Título do Relatório
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </PremiumCard>

                                    <div className="flex justify-end">
                                        <PremiumButton
                                            onClick={handleSaveBranding}
                                            variant="primary"
                                            className="w-full sm:w-auto px-8"
                                            disabled={isLoading || user.plan === 'free'}
                                        >
                                            {isLoading ? 'Salvando...' : 'Salvar Preferências'}
                                        </PremiumButton>
                                    </div>
                                </div>
                            )}
                        </Reveal>
                    </div>
                </div>
            </div>
        </div>
    );
};
