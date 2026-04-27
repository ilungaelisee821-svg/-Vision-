import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Wand2, MessageSquare, CheckCircle2, RefreshCw, Layout } from 'lucide-react';
import { Thesis } from '../types';

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 ${className}`}>
    {children}
  </div>
);

export const Editor = ({ selectedThesis, onUpdate, onImproveWriting, onRestructure, aiLoading }: { 
  selectedThesis: Thesis | null, 
  onUpdate: (updates: Partial<Thesis>) => void,
  onImproveWriting: () => void,
  onRestructure: () => void,
  aiLoading: boolean
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col"
    >
      <div className="flex-1 flex gap-8">
        <div className="flex-1 overflow-y-auto pb-20">
          <div className="academic-page">
            <textarea
              value={selectedThesis?.content || ''}
              onChange={(e) => onUpdate({ content: e.target.value })}
              placeholder="Commencez à rédiger votre thèse ici..."
              className="w-full h-full min-h-[800px] border-none focus:ring-0 resize-none academic-text p-0 outline-none"
              style={{ 
                fontFamily: 'Times New Roman, serif', 
                fontSize: '12pt',
                lineHeight: '1.5',
                textAlign: 'justify'
              }}
            />
          </div>
        </div>

        <div className="w-80 space-y-6">
          <Card className="space-y-4 sticky top-0">
            <h3 className="font-bold flex items-center gap-2">
              <Sparkles size={18} className="text-indigo-600" />
              Assistant d'Écriture
            </h3>
            <div className="space-y-2">
              <button 
                onClick={onRestructure}
                disabled={aiLoading}
                className="w-full flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {aiLoading ? <RefreshCw size={16} className="animate-spin" /> : <Layout size={16} />}
                Restructurer & Formater
              </button>
              <button 
                onClick={onImproveWriting}
                disabled={aiLoading}
                className="w-full flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50"
              >
                {aiLoading ? <RefreshCw size={16} className="animate-spin" /> : <Wand2 size={16} />}
                Améliorer le style
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors">
                <MessageSquare size={16} />
                Simplifier les phrases
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors">
                <CheckCircle2 size={16} />
                Correction Grammaticale
              </button>
            </div>
            <div className="pt-4 border-t border-neutral-100">
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Suggestions</h4>
              <p className="text-xs text-neutral-500 italic">
                "Considérez l'utilisation de termes plus techniques pour renforcer votre argumentation dans le chapitre 1."
              </p>
            </div>
          </Card>

          <Card className="space-y-4">
            <h3 className="font-bold">Formatage Rapide</h3>
            <div className="grid grid-cols-2 gap-2">
              <button className="text-xs py-1.5 px-2 rounded-lg border border-neutral-200 hover:bg-neutral-50">Titre 1</button>
              <button className="text-xs py-1.5 px-2 rounded-lg border border-neutral-200 hover:bg-neutral-50">Titre 2</button>
              <button className="text-xs py-1.5 px-2 rounded-lg border border-neutral-200 hover:bg-neutral-50">Citation</button>
              <button className="text-xs py-1.5 px-2 rounded-lg border border-neutral-200 hover:bg-neutral-50">Liste</button>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};
