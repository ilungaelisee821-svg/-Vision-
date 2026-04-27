import React from 'react';
import { motion } from 'motion/react';
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Globe, RefreshCw } from 'lucide-react';
import { UserProfile } from '../types';

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 ${className}`}>
    {children}
  </div>
);

export const Settings = ({ 
  profile, 
  onUpdate 
}: { 
  profile: UserProfile | null,
  onUpdate: (updates: Partial<UserProfile>) => Promise<void>
}) => {
  const [displayName, setDisplayName] = React.useState(profile?.displayName || '');
  const [universityTemplate, setUniversityTemplate] = React.useState(profile?.universityTemplate || 'International');
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate({ displayName, universityTemplate });
    } catch (error) {
      console.error(error);
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
      <Card className="space-y-8">
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <SettingsIcon size={24} className="text-indigo-600" />
          Paramètres
        </h3>

        <div className="space-y-6">
          <div className="flex items-center gap-6 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
              <User size={32} />
            </div>
            <div className="flex-1 space-y-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-400 uppercase">Nom d'affichage</label>
                <input 
                  type="text" 
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <p className="text-sm text-neutral-500">{profile?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h5 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Préférences Académiques</h5>
              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-500 uppercase">Modèle d'Université</label>
                  <select 
                    value={universityTemplate}
                    onChange={e => setUniversityTemplate(e.target.value as any)}
                    className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="African">Africain</option>
                    <option value="European">Européen</option>
                    <option value="International">International</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-100 flex justify-end gap-4">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving && <RefreshCw size={16} className="animate-spin" />}
            Sauvegarder les modifications
          </button>
        </div>
      </Card>
    </motion.div>
  );
};
