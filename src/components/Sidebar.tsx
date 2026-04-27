import React from 'react';
import { 
  BarChart3, 
  FileText, 
  Layout, 
  ShieldCheck, 
  BookOpen, 
  Users, 
  History, 
  Download, 
  Settings, 
  LogOut,
  GraduationCap
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: any, 
  label: string, 
  active: boolean, 
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200",
      active 
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
        : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
    )}
  >
    <Icon size={20} />
    <span className="font-medium text-sm">{label}</span>
  </button>
);

export const Sidebar = ({ activeTab, setActiveTab, onLogout }: { 
  activeTab: string, 
  setActiveTab: (tab: string) => void,
  onLogout: () => void
}) => {
  return (
    <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col p-4 h-full">
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
          <GraduationCap size={24} className="text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">ThesisAI</span>
      </div>

      <nav className="flex-1 space-y-1">
        <SidebarItem icon={BarChart3} label="Tableau de bord" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <SidebarItem icon={FileText} label="Éditeur Académique" active={activeTab === 'editor'} onClick={() => setActiveTab('editor')} />
        <SidebarItem icon={Layout} label="Structure & Plan" active={activeTab === 'structure'} onClick={() => setActiveTab('structure')} />
        <SidebarItem icon={ShieldCheck} label="Analyse Scientifique" active={activeTab === 'analysis'} onClick={() => setActiveTab('analysis')} />
        <SidebarItem icon={BookOpen} label="Bibliographie" active={activeTab === 'bibliography'} onClick={() => setActiveTab('bibliography')} />
        <SidebarItem icon={Users} label="Collaboration" active={activeTab === 'collaboration'} onClick={() => setActiveTab('collaboration')} />
        <SidebarItem icon={History} label="Versions" active={activeTab === 'versions'} onClick={() => setActiveTab('versions')} />
        <SidebarItem icon={Download} label="Export & Soutenance" active={activeTab === 'export'} onClick={() => setActiveTab('export')} />
      </nav>

      <div className="pt-4 border-t border-neutral-100 space-y-1">
        <SidebarItem icon={Settings} label="Paramètres" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium text-sm">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};
