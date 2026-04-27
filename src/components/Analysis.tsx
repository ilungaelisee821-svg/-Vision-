import React from 'react';
import { motion } from 'motion/react';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { Thesis } from '../types';

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 ${className}`}>
    {children}
  </div>
);

export const Analysis = ({ selectedThesis, onAnalyze, aiLoading }: { 
  selectedThesis: Thesis | null, 
  onAnalyze: () => void,
  aiLoading: boolean
}) => {
  const analysis = selectedThesis?.analysis;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <Card className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold">Analyse Scientifique</h3>
          <button 
            onClick={onAnalyze}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            disabled={aiLoading || !selectedThesis?.content}
          >
            {aiLoading && <RefreshCw size={16} className="animate-spin" />}
            Lancer l'Analyse
          </button>
        </div>

        {analysis ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-indigo-50 rounded-2xl text-center">
                <span className="block text-3xl font-bold text-indigo-600">{analysis.score}%</span>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Score Global</span>
              </div>
              <div className="p-6 bg-emerald-50 rounded-2xl text-center md:col-span-2">
                <p className="text-sm text-neutral-700 text-left italic">
                  "{analysis.analysis}"
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {analysis.strengths && analysis.strengths.length > 0 && (
                <>
                  <h4 className="font-bold">Points Forts</h4>
                  <ul className="space-y-2">
                    {analysis.strengths.map((s, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-neutral-600">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <h4 className="font-bold text-rose-600">Recommandations</h4>
              <ul className="space-y-2">
                {analysis.recommendations.map((r, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-neutral-600">
                    <AlertCircle size={16} className="text-rose-500" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-neutral-400">
              <AlertCircle size={32} />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-neutral-900">Aucune analyse disponible</p>
              <p className="text-sm text-neutral-500">Cliquez sur le bouton ci-dessus pour analyser votre contenu.</p>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};
