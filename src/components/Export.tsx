import React from 'react';
import { motion } from 'motion/react';
import { Download, FileText, Layout, GraduationCap, RefreshCw, HelpCircle } from 'lucide-react';
import { Thesis } from '../types';

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 ${className}`}>
    {children}
  </div>
);

export const Export = ({ selectedThesis, onGenerateDefensePrep, onExport, aiLoading }: { 
  selectedThesis: Thesis | null,
  onGenerateDefensePrep: () => void,
  onExport: (format: 'pdf' | 'docx' | 'latex') => void,
  aiLoading: boolean
}) => {
  const defensePrep = selectedThesis?.defensePrep;
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <Card className="space-y-6">
        <h3 className="text-2xl font-bold">Exportation & Soutenance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            onClick={() => onExport('pdf')}
            className="p-6 border border-neutral-200 rounded-2xl hover:border-indigo-600 transition-colors cursor-pointer group"
          >
            <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-50 transition-colors">
              <Download size={24} className="text-neutral-600 group-hover:text-indigo-600" />
            </div>
            <h4 className="font-bold mb-1">Format PDF</h4>
            <p className="text-xs text-neutral-500">Prêt pour l'impression et la soumission.</p>
          </div>
          <div 
            onClick={() => onExport('docx')}
            className="p-6 border border-neutral-200 rounded-2xl hover:border-indigo-600 transition-colors cursor-pointer group"
          >
            <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-50 transition-colors">
              <FileText size={24} className="text-neutral-600 group-hover:text-indigo-600" />
            </div>
            <h4 className="font-bold mb-1">Format DOCX</h4>
            <p className="text-xs text-neutral-500">Pour des modifications finales sur Word.</p>
          </div>
          <div 
            onClick={() => onExport('latex')}
            className="p-6 border border-neutral-200 rounded-2xl hover:border-indigo-600 transition-colors cursor-pointer group"
          >
            <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-50 transition-colors">
              <Layout size={24} className="text-neutral-600 group-hover:text-indigo-600" />
            </div>
            <h4 className="font-bold mb-1">LaTeX</h4>
            <p className="text-xs text-neutral-500">Pour les thèses scientifiques complexes.</p>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-100 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <GraduationCap size={24} className="text-indigo-600" />
              Préparation à la Soutenance
            </h3>
            <button 
              onClick={onGenerateDefensePrep}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              disabled={aiLoading || !selectedThesis?.content}
            >
              {aiLoading && <RefreshCw size={14} className="animate-spin" />}
              Générer la Préparation
            </button>
          </div>

          {defensePrep ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-neutral-50 border-none space-y-4">
                <h4 className="font-bold flex items-center gap-2">
                  <HelpCircle size={18} className="text-indigo-600" />
                  Questions Probables
                </h4>
                <div className="space-y-4">
                  {defensePrep.juryQuestions.map((q, i) => (
                    <div key={i} className="space-y-1">
                      <p className="text-sm font-bold">"{q.question}"</p>
                      <p className="text-xs text-neutral-500 italic">Suggestion: {q.answer}</p>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="bg-neutral-50 border-none space-y-4">
                <h4 className="font-bold flex items-center gap-2">
                  <Layout size={18} className="text-indigo-600" />
                  Plan de Présentation
                </h4>
                <ul className="space-y-2 text-sm">
                  {defensePrep.presentationOutline.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">{i+1}</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          ) : (
            <div className="py-12 text-center border-2 border-dashed border-neutral-200 rounded-2xl">
              <p className="text-neutral-500">Cliquez sur "Générer la Préparation" pour obtenir des conseils personnalisés pour votre soutenance.</p>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};
