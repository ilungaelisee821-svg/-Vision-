import React from 'react';
import { motion } from 'motion/react';
import { Users, MessageSquare, UserPlus, Shield } from 'lucide-react';
import { Thesis } from '../types';

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-2xl border border-neutral-200 shadow-sm p-6 ${className}`}>
    {children}
  </div>
);

export const Collaboration = ({ 
  selectedThesis, 
  comments, 
  onAddComment 
}: { 
  selectedThesis: Thesis | null,
  comments: any[],
  onAddComment: (text: string) => Promise<void>
}) => {
  const [newComment, setNewComment] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    try {
      await onAddComment(newComment);
      setNewComment('');
    } finally {
      setIsSubmitting(false);
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
          <h3 className="text-2xl font-bold">Collaboration & Commentaires</h3>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <UserPlus size={18} />
            Inviter un collaborateur
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 space-y-4">
            <h4 className="font-bold flex items-center gap-2">
              <MessageSquare size={18} className="text-indigo-600" />
              Commentaires récents
            </h4>
            
            <form onSubmit={handleSubmit} className="space-y-2">
              <textarea 
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Ajouter un commentaire..."
                className="w-full p-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm min-h-[80px]"
              />
              <button 
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                Commenter
              </button>
            </form>

            <div className="space-y-4 pt-4 border-t border-neutral-100">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0">
                    {comment.author.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{comment.author}</span>
                      <span className="text-[10px] text-neutral-400">{new Date(comment.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <div className="text-center py-8 text-neutral-400 italic text-sm">
                  Aucun commentaire pour le moment.
                </div>
              )}
            </div>
          </Card>

          <Card className="space-y-4">
            <h4 className="font-bold flex items-center gap-2">
              <Users size={18} className="text-indigo-600" />
              Collaborateurs
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">
                    ME
                  </div>
                  <span className="text-sm font-medium">Moi (Propriétaire)</span>
                </div>
                <Shield size={14} className="text-indigo-600" />
              </div>
            </div>
          </Card>
        </div>
      </Card>
    </motion.div>
  );
};
