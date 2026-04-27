export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  universityTemplate: 'African' | 'European' | 'International';
  createdAt: string;
}

export interface ThesisStructure {
  coverPage: string;
  dedication: string;
  acknowledgements: string;
  abstract: string;
  tableOfContents: string[];
  listOfFigures: string[];
  listOfTables: string[];
  introduction: string;
  chapters: {
    title: string;
    content: string;
    sections: { title: string; content: string }[];
  }[];
  conclusion: string;
  bibliography: string[];
  appendices: string[];
}

export interface ThesisFormatting {
  font: string;
  fontSize: number;
  lineSpacing: number;
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  paragraphIndentation: number;
}

export interface Thesis {
  id: string;
  userId: string;
  title: string;
  topic?: string;
  field?: string;
  level?: 'Bachelor' | 'Master' | 'PhD';
  content: string;
  structure?: ThesisStructure;
  formatting?: ThesisFormatting;
  analysis?: {
    score: number;
    analysis: string;
    recommendations: string[];
    strengths?: string[];
  };
  defensePrep?: {
    presentationOutline: string[];
    juryQuestions: { question: string, answer: string }[];
  };
  progress: number;
  qualityScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface Citation {
  id: string;
  type: 'APA' | 'MLA' | 'Chicago';
  author: string;
  title: string;
  year: string;
  publisher?: string;
  url?: string;
  doi?: string;
}
