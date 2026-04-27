import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  ShieldCheck, 
  ListOrdered, 
  FileSearch, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Wand2, 
  Search 
} from 'lucide-react';
import { Thesis, UserProfile } from '../types';

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 ${className}`}>
    {children}
  </div>
);

const StatCard = ({ icon: Icon, value, label, colorClass }: { icon: any, value: string | number, label: string, colorClass: string }) => (
  <Card className="flex flex-col items-center text-center space-y-2">
    <div className={`w-12 h-12 ${colorClass} rounded-full flex items-center justify-center`}>
      <Icon size={24} />
    </div>
    <span className="text-3xl font-bold">{value}</span>
    <span className="text-sm text-neutral-500 font-medium uppercase tracking-wider">{label}</span>
  </Card>
);

export const Dashboard = ({ profile, selectedThesis, onNavigateToEditor }: { 
  profile: UserProfile | null, 
  selectedThesis: Thesis | null,
  onNavigateToEditor: () => void
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8 max-w-6xl mx-auto"
    >
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-neutral-900">Bienvenue, {profile?.displayName}</h2>
          <p className="text-neutral-500">Voici l'état d'avancement de votre thèse.</p>
        </div>
        <button 
          onClick={onNavigateToEditor}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
        >
          Continuer la rédaction
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={BarChart3} value={`${selectedThesis?.progress || 0}%`} label="Progression" colorClass="bg-indigo-100 text-indigo-600" />
        <StatCard icon={ShieldCheck} value={`${selectedThesis?.qualityScore || 0}/100`} label="Qualité Académique" colorClass="bg-emerald-100 text-emerald-600" />
        <StatCard icon={ListOrdered} value={selectedThesis?.structure ? 'Prêt' : 'À faire'} label="Structure" colorClass="bg-amber-100 text-amber-600" />
        <StatCard icon={FileSearch} value="0%" label="Plagiat" colorClass="bg-rose-100 text-rose-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-600" />
            Conseils du Superviseur IA
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 flex gap-3">
              <AlertCircle size={18} className="text-indigo-600 shrink-0 mt-0.5" />
              <p className="text-sm text-indigo-900">Votre revue de littérature semble un peu courte. Pensez à ajouter au moins 3 sources récentes.</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex gap-3">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-900">La structure de votre introduction est excellente et respecte les standards.</p>
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <h3 className="text-lg font-bold">Actions Rapides</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-neutral-50 hover:bg-neutral-100 rounded-2xl text-left transition-colors border border-neutral-200 group">
              <Wand2 size={20} className="text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="block font-bold text-sm">Fix My Thesis</span>
              <span className="text-xs text-neutral-500">Correction automatique globale</span>
            </button>
            <button className="p-4 bg-neutral-50 hover:bg-neutral-100 rounded-2xl text-left transition-colors border border-neutral-200 group">
              <Search size={20} className="text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
              <span className="block font-bold text-sm">Analyse Plagiat</span>
              <span className="text-xs text-neutral-500">Vérifier l'originalité</span>
            </button>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};
