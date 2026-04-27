import React from 'react';
import { motion } from 'motion/react';
import { History, RotateCcw, Save, Clock } from 'lucide-react';
import { Thesis } from '../types';

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 ${className}`}>
    {children}
  </div>
);

export const Versions = ({ 
  selectedThesis, 
  versions, 
  onSaveVersion, 
  onRestoreVersion 
}: { 
  selectedThesis: Thesis | null,
  versions: any[],
  onSaveVersion: (name: string) => Promise<void>,
  onRestoreVersion: (version: any) => Promise<void>
}) => {
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    const name = prompt('Nom de la version :');
    if (!name) return;
    setIsSaving(true);
    try {
      await onSaveVersion(name);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <Card className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold">Historique des Versions</h3>
          <button 
            onClick={handleSave}
            disabled={isSaving || !selectedThesis}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={18} />
            Sauvegarder une version
          </button>
        </div>

        <div className="space-y-4">
          {versions.map((v) => (
            <div key={v.id} className="p-4 border border-neutral-200 rounded-2xl hover:bg-neutral-50 transition-colors flex justify-between items-center group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">{v.name}</h4>
                  <p className="text-xs text-neutral-500">Par {v.author} • {new Date(v.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => onRestoreVersion(v)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-bold hover:bg-white transition-colors"
                >
                  <RotateCcw size={14} />
                  Restaurer
                </button>
              </div>
            </div>
          ))}
          {versions.length === 0 && (
            <div className="py-12 text-center text-neutral-400 italic">
              Aucune version sauvegardée.
            </div>
          )}
        </div>

        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
          <History size={20} className="text-amber-600 shrink-0" />
          <p className="text-sm text-amber-900">
            <strong>Note:</strong> Les versions sauvegardées manuellement sont conservées indéfiniment. Les sauvegardes automatiques sont conservées pendant 30 jours.
          </p>
        </div>
      </Card>
    </motion.div>
  );
};
