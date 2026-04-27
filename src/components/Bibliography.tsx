import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Plus, Search, Trash2, ExternalLink } from 'lucide-react';
import { Citation, Thesis } from '../types';

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 ${className}`}>
    {children}
  </div>
);

export const Bibliography = ({ 
  selectedThesis, 
  citations, 
  onAddCitation, 
  onDeleteCitation 
}: { 
  selectedThesis: Thesis | null,
  citations: Citation[],
  onAddCitation: (citation: Omit<Citation, 'id'>) => Promise<void>,
  onDeleteCitation: (id: string) => Promise<void>
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCitation, setNewCitation] = useState<Omit<Citation, 'id'>>({
    title: '',
    author: '',
    year: new Date().getFullYear().toString(),
    publisher: '',
    type: 'APA',
    url: ''
  });

  const filteredCitations = citations.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddCitation(newCitation);
    setShowAddForm(false);
    setNewCitation({
      title: '',
      author: '',
      year: new Date().getFullYear().toString(),
      publisher: '',
      type: 'APA',
      url: ''
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <Card className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold">Gestionnaire de Bibliographie</h3>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            {showAddForm ? 'Annuler' : 'Ajouter une source'}
          </button>
        </div>

        {showAddForm && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            onSubmit={handleSubmit}
            className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-500 uppercase">Titre</label>
                <input 
                  required
                  type="text" 
                  value={newCitation.title}
                  onChange={e => setNewCitation({...newCitation, title: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-500 uppercase">Auteur(s)</label>
                <input 
                  required
                  type="text" 
                  value={newCitation.author}
                  onChange={e => setNewCitation({...newCitation, author: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-500 uppercase">Année</label>
                <input 
                  required
                  type="text" 
                  value={newCitation.year}
                  onChange={e => setNewCitation({...newCitation, year: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-500 uppercase">Éditeur / Source</label>
                <input 
                  type="text" 
                  value={newCitation.publisher}
                  onChange={e => setNewCitation({...newCitation, publisher: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-500 uppercase">Style</label>
                <select 
                  value={newCitation.type}
                  onChange={e => setNewCitation({...newCitation, type: e.target.value as any})}
                  className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="APA">APA</option>
                  <option value="MLA">MLA</option>
                  <option value="Chicago">Chicago</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-500 uppercase">URL (Optionnel)</label>
                <input 
                  type="url" 
                  value={newCitation.url}
                  onChange={e => setNewCitation({...newCitation, url: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
              Enregistrer la source
            </button>
          </motion.form>
        )}

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher dans vos sources..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="space-y-3">
          {filteredCitations.map((citation) => (
            <div key={citation.id} className="p-4 border border-neutral-200 rounded-2xl hover:bg-neutral-50 transition-colors group">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="font-bold text-neutral-900">{citation.title}</h4>
                  <p className="text-sm text-neutral-500">
                    {citation.author} ({citation.year}). <span className="italic">{citation.publisher}</span>
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded text-[10px] font-bold uppercase tracking-wider">
                      {citation.type}
                    </span>
                    {citation.url && (
                      <a href={citation.url} target="_blank" rel="noreferrer" className="text-[10px] text-indigo-600 font-bold flex items-center gap-1 hover:underline">
                        <ExternalLink size={10} />
                        Lien
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onDeleteCitation(citation.id)}
                    className="p-2 text-neutral-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredCitations.length === 0 && (
            <div className="py-12 text-center text-neutral-400 italic">
              Aucune source trouvée.
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-neutral-100">
          <h4 className="font-bold mb-4">Générer une citation rapide</h4>
          <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
            <p className="text-sm text-indigo-900 italic">
              "Collez un lien ou un DOI ici pour que l'IA génère automatiquement la référence au format APA, MLA ou Chicago."
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
