import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  LogOut, 
  User,
  RefreshCw,
  GraduationCap,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db } from './firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  orderBy
} from 'firebase/firestore';
import { 
  restructureAndFormatDocument,
  generateThesisStructure, 
  improveAcademicWriting,
  analyzeScientificQuality,
  generateDefensePrep
} from './services/gemini';
import { Thesis, UserProfile, Citation } from './types';
import { Notification } from './components/Notification';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
};

// Components
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Editor } from './components/Editor';
import { Structure } from './components/Structure';
import { Analysis } from './components/Analysis';
import { Export } from './components/Export';
import { Bibliography } from './components/Bibliography';
import { Collaboration } from './components/Collaboration';
import { Versions } from './components/Versions';
import { Settings } from './components/Settings';

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theses, setTheses] = useState<Thesis[]>([]);
  const [selectedThesis, setSelectedThesis] = useState<Thesis | null>(null);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [versions, setVersions] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const docRef = doc(db, 'users', u.uid);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            const newProfile: UserProfile = {
              uid: u.uid,
              email: u.email || '',
              displayName: u.displayName || 'Étudiant',
              universityTemplate: 'International',
              createdAt: new Date().toISOString()
            };
            await setDoc(docRef, newProfile);
            setProfile(newProfile);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${u.uid}`);
        }
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'theses'), where('userId', '==', user.uid), orderBy('updatedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Thesis));
      setTheses(docs);
      
      if (docs.length > 0) {
        if (!selectedThesis) {
          setSelectedThesis(docs[0]);
        } else {
          // Keep selected thesis in sync with the list
          const updated = docs.find(t => t.id === selectedThesis.id);
          if (updated) {
            setSelectedThesis(updated);
          }
        }
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'theses');
    });
    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!selectedThesis) {
      setCitations([]);
      return;
    }
    const q = query(collection(db, 'theses', selectedThesis.id, 'citations'), orderBy('year', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Citation));
      setCitations(docs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `theses/${selectedThesis.id}/citations`);
    });
    return unsubscribe;
  }, [selectedThesis]);

  useEffect(() => {
    if (!selectedThesis) {
      setVersions([]);
      return;
    }
    const q = query(collection(db, 'theses', selectedThesis.id, 'versions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setVersions(docs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `theses/${selectedThesis.id}/versions`);
    });
    return unsubscribe;
  }, [selectedThesis]);

  useEffect(() => {
    if (!selectedThesis) {
      setComments([]);
      return;
    }
    const q = query(collection(db, 'theses', selectedThesis.id, 'comments'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setComments(docs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `theses/${selectedThesis.id}/comments`);
    });
    return unsubscribe;
  }, [selectedThesis]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const handleLogout = () => signOut(auth);

  const createNewThesis = async () => {
    if (!user) return;
    const newThesis: Partial<Thesis> = {
      userId: user.uid,
      title: "Nouvelle Thèse",
      content: "",
      progress: 0,
      qualityScore: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    try {
      const docRef = await addDoc(collection(db, 'theses'), newThesis);
      setSelectedThesis({ id: docRef.id, ...newThesis } as Thesis);
      setActiveTab('editor');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'theses');
    }
  };

  const updateThesis = async (updates: Partial<Thesis>) => {
    if (!selectedThesis) return;
    const docRef = doc(db, 'theses', selectedThesis.id);
    try {
      await updateDoc(docRef, { ...updates, updatedAt: new Date().toISOString() });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `theses/${selectedThesis.id}`);
    }
  };

  const handleGenerateStructure = async () => {
    if (!selectedThesis || !selectedThesis.topic) return;
    setAiLoading(true);
    try {
      const structure = await generateThesisStructure(
        selectedThesis.topic, 
        selectedThesis.field || 'Général', 
        selectedThesis.level || 'Master'
      );
      await updateThesis({ structure });
    } catch (error) {
      console.error(error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleImproveWriting = async () => {
    if (!selectedThesis) return;
    setAiLoading(true);
    try {
      const improved = await improveAcademicWriting(selectedThesis.content);
      await updateThesis({ content: improved });
    } catch (error) {
      console.error(error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleRestructure = async () => {
    if (!selectedThesis || !selectedThesis.content) {
      setNotification({ message: "Veuillez d'abord saisir du texte à restructurer.", type: 'error' });
      return;
    }
    setAiLoading(true);
    try {
      const restructured = await restructureAndFormatDocument(selectedThesis.content);
      if (restructured) {
        await updateThesis({ content: restructured });
        setNotification({ message: "Document restructuré avec succès !", type: 'success' });
      } else {
        throw new Error("L'IA n'a pas pu générer de contenu.");
      }
    } catch (error) {
      console.error(error);
      setNotification({ message: "Une erreur est survenue lors de la restructuration.", type: 'error' });
    } finally {
      setAiLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedThesis || !selectedThesis.content) return;
    setAiLoading(true);
    try {
      const analysis = await analyzeScientificQuality(selectedThesis.content);
      await updateThesis({ 
        analysis,
        qualityScore: analysis.score
      });
    } catch (error) {
      console.error(error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleDefensePrep = async () => {
    if (!selectedThesis || !selectedThesis.content) return;
    setAiLoading(true);
    try {
      const defensePrep = await generateDefensePrep(selectedThesis.content);
      await updateThesis({ defensePrep });
    } catch (error) {
      console.error(error);
    } finally {
      setAiLoading(false);
    }
  };

  const addCitation = async (citation: Omit<Citation, 'id'>) => {
    if (!selectedThesis) return;
    try {
      await addDoc(collection(db, 'theses', selectedThesis.id, 'citations'), citation);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `theses/${selectedThesis.id}/citations`);
    }
  };

  const deleteCitation = async (citationId: string) => {
    if (!selectedThesis) return;
    try {
      await deleteDoc(doc(db, 'theses', selectedThesis.id, 'citations', citationId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `theses/${selectedThesis.id}/citations/${citationId}`);
    }
  };

  const handleUpdateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(docRef, updates);
      setProfile(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const saveVersion = async (name: string) => {
    if (!selectedThesis) return;
    try {
      await addDoc(collection(db, 'theses', selectedThesis.id, 'versions'), {
        name,
        content: selectedThesis.content,
        author: profile?.displayName || 'Moi',
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `theses/${selectedThesis.id}/versions`);
    }
  };

  const restoreVersion = async (version: any) => {
    if (!selectedThesis) return;
    await updateThesis({ content: version.content });
  };

  const addComment = async (text: string) => {
    if (!selectedThesis || !user) return;
    try {
      await addDoc(collection(db, 'theses', selectedThesis.id, 'comments'), {
        text,
        author: profile?.displayName || 'Moi',
        authorId: user.uid,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `theses/${selectedThesis.id}/comments`);
    }
  };

  const handleExport = (format: 'pdf' | 'docx' | 'latex') => {
    if (!selectedThesis) return;
    
    if (format === 'pdf') {
      window.print();
      return;
    }

    const content = `
TITRE: ${selectedThesis.title}
SUJET: ${selectedThesis.topic}
DOMAINE: ${selectedThesis.field}
NIVEAU: ${selectedThesis.level}

--- CONTENU ---

${selectedThesis.content}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedThesis.title.replace(/\s+/g, '_')}.${format === 'latex' ? 'tex' : format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw size={40} className="text-indigo-600 animate-spin" />
          <p className="text-neutral-500 font-medium">Chargement de ThesisAI...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-neutral-50 p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-200">
              <GraduationCap size={40} className="text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-900">ThesisAI</h1>
            <p className="text-neutral-500 text-lg">Votre assistant académique intelligent pour thèses et mémoires.</p>
          </div>
          <button 
            onClick={handleLogin} 
            className="w-full py-4 text-lg bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            Se connecter avec Google
          </button>
          <p className="text-xs text-neutral-400">
            En vous connectant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-neutral-50 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-neutral-200 px-8 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-4">
            <select 
              value={selectedThesis?.id || ''} 
              onChange={(e) => setSelectedThesis(theses.find(t => t.id === e.target.value) || null)}
              className="bg-neutral-100 border-none rounded-lg px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {theses.map(t => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
              {theses.length === 0 && <option value="">Aucune thèse</option>}
            </select>
            <button 
              onClick={createNewThesis} 
              className="flex items-center gap-2 px-4 py-1.5 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors text-sm"
            >
              <Plus size={16} />
              Nouveau
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">
              <CheckCircle2 size={14} />
              Sauvegardé
            </div>
            <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden border border-neutral-300">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={18} className="text-neutral-500" />
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <Dashboard 
                profile={profile} 
                selectedThesis={selectedThesis} 
                onNavigateToEditor={() => setActiveTab('editor')} 
              />
            )}
            {activeTab === 'editor' && (
              <Editor 
                selectedThesis={selectedThesis} 
                onUpdate={updateThesis} 
                onImproveWriting={handleImproveWriting} 
                onRestructure={handleRestructure}
                aiLoading={aiLoading} 
              />
            )}
            {activeTab === 'structure' && (
              <Structure 
                selectedThesis={selectedThesis} 
                onUpdate={updateThesis} 
                onGenerateStructure={handleGenerateStructure} 
                aiLoading={aiLoading} 
              />
            )}
            {activeTab === 'analysis' && (
              <Analysis 
                selectedThesis={selectedThesis} 
                onAnalyze={handleAnalyze} 
                aiLoading={aiLoading} 
              />
            )}
            {activeTab === 'bibliography' && (
              <Bibliography 
                selectedThesis={selectedThesis} 
                citations={citations}
                onAddCitation={addCitation}
                onDeleteCitation={deleteCitation}
              />
            )}
            {activeTab === 'collaboration' && (
              <Collaboration 
                selectedThesis={selectedThesis} 
                comments={comments}
                onAddComment={addComment}
              />
            )}
            {activeTab === 'versions' && (
              <Versions 
                selectedThesis={selectedThesis} 
                versions={versions}
                onSaveVersion={saveVersion}
                onRestoreVersion={restoreVersion}
              />
            )}
            {activeTab === 'export' && (
              <Export 
                selectedThesis={selectedThesis} 
                onGenerateDefensePrep={handleDefensePrep} 
                onExport={handleExport}
                aiLoading={aiLoading} 
              />
            )}
            {activeTab === 'settings' && (
              <Settings profile={profile} onUpdate={handleUpdateProfile} />
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {notification && (
            <Notification 
              message={notification.message} 
              type={notification.type} 
              onClose={() => setNotification(null)} 
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
