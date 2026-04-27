import React from 'react';
import { motion } from 'motion/react';
import { RefreshCw } from 'lucide-react';
import { Thesis } from '../types';

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 ${className}`}>
    {children}
  </div>
);

export const Structure = ({ selectedThesis, onUpdate, onGenerateStructure, aiLoading }: { 
  selectedThesis: Thesis | null, 
  onUpdate: (updates: Partial<Thesis>) => void,
  onGenerateStructure: () => void,
  aiLoading: boolean
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <Card className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold">Générateur de Structure</h3>
          <button 
            onClick={onGenerateStructure}
            disabled={aiLoading || !selectedThesis?.topic}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {aiLoading && <RefreshCw size={16} className="animate-spin" />}
            Générer avec l'IA
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Sujet de la thèse</label>
            <input 
              type="text" 
              value={selectedThesis?.topic || ''}
              onChange={(e) => onUpdate({ topic: e.target.value })}
              placeholder="Ex: L'impact de l'IA sur l'éducation..."
              className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Domaine</label>
              <input 
                type="text" 
                value={selectedThesis?.field || ''}
                onChange={(e) => onUpdate({ field: e.target.value })}
                placeholder="Ex: Informatique, Sociologie..."
                className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Niveau</label>
              <select 
                value={selectedThesis?.level || 'Master'}
                onChange={(e) => onUpdate({ level: e.target.value as any })}
                className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Bachelor">Licence / Bachelor</option>
                <option value="Master">Master</option>
                <option value="PhD">Doctorat / PhD</option>
              </select>
            </div>
          </div>
        </div>

        {selectedThesis?.structure && (
          <div className="mt-8 space-y-4">
            <h4 className="font-bold text-neutral-900 border-b pb-2">Plan suggéré</h4>
            <div className="space-y-2">
              {selectedThesis.structure.chapters.map((ch, idx) => (
                <div key={idx} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-bold text-indigo-600 border border-neutral-200">
                      {idx + 1}
                    </div>
                    <span className="font-medium">{ch.title}</span>
                  </div>
                  <button className="text-xs text-neutral-500 hover:text-indigo-600 font-medium">Détails</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};
