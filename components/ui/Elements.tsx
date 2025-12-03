import React from 'react';
import { Info } from 'lucide-react';

export const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`glass-panel rounded-2xl p-6 shadow-xl glass-card-hover ${className}`}>
    {children}
  </div>
);

export const InputGroup = ({ label, prefix, suffix, value, onChange, type = "number", tooltip, placeholder }: any) => (
  <div className="flex flex-col gap-1.5 mb-4 group/input">
    <div className="flex items-center gap-2">
      <label className="text-xs font-medium text-gray-400 uppercase tracking-wide group-focus-within/input:text-brand-blue transition-colors duration-300">{label}</label>
      {tooltip && (
        <div className="group relative">
          <Info className="w-3.5 h-3.5 text-gray-500 hover:text-brand-blue cursor-help transition-colors" />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-3 bg-brand-surface/90 backdrop-blur-md border border-white/10 rounded-xl text-xs text-gray-300 shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100 pointer-events-none z-10 text-center leading-relaxed">
            {tooltip}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-brand-surface/90"></div>
          </div>
        </div>
      )}
    </div>
    <div className="relative flex items-center">
      {prefix && (typeof prefix === 'string' ? <span className="absolute left-3 text-gray-500 text-sm">{prefix}</span> : <span className="absolute left-3 text-gray-500">{prefix}</span>)}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-brand-black/40 border border-white/10 rounded-xl py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all duration-300 ${prefix ? 'pl-10' : 'pl-4'} ${suffix ? 'pr-10' : 'pr-4'}`}
      />
      {suffix && <span className="absolute right-3 text-gray-500 text-sm">{suffix}</span>}
    </div>
  </div>
);

export const Button = ({ children, onClick, variant = 'primary', className = "", disabled = false, icon: Icon }: any) => {
  const base = "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group select-none";
  
  const variants = {
    primary: "bg-brand-blue hover:bg-blue-600 text-white shadow-lg shadow-brand-blue/20 hover:shadow-brand-blue/40",
    secondary: "bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20",
    outline: "border border-brand-blue text-brand-blue hover:bg-brand-blue/10",
    danger: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant as keyof typeof variants] || variants.primary} ${className}`}>
      {/* Button Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out pointer-events-none"></div>
      
      {Icon && <Icon className="w-4 h-4 relative z-10 shrink-0" />}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export const Metric = ({ label, value, subtext, color = "text-white" }: any) => (
  <div>
    <p className="text-xs text-gray-400 mb-1 tracking-wide">{label}</p>
    <p className={`text-3xl font-bold font-display tracking-tight ${color === 'text-white' ? 'text-gradient' : color} drop-shadow-sm`}>{value}</p>
    {subtext && <p className="text-xs text-gray-500 mt-1 font-medium">{subtext}</p>}
  </div>
);
