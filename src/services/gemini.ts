import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const generateThesisStructure = async (topic: string, field: string, level: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Génère une structure complète de thèse pour le sujet suivant: "${topic}" dans le domaine "${field}" pour un niveau "${level}".
    La réponse doit être en français et structurée en JSON selon ce format:
    {
      "coverPage": "Texte de la page de garde",
      "dedication": "Exemple de dédicace",
      "acknowledgements": "Exemple de remerciements",
      "abstract": "Résumé",
      "tableOfContents": ["Section 1", "Section 2"],
      "introduction": "Introduction générale",
      "chapters": [
        { "title": "Chapitre 1", "content": "Contenu suggéré", "sections": [{ "title": "1.1...", "content": "..." }] }
      ],
      "conclusion": "Conclusion générale",
      "bibliography": ["Source 1", "Source 2"],
      "appendices": ["Annexe 1"]
    }`,
    config: {
      responseMimeType: "application/json"
    }
  });
  return JSON.parse(response.text);
};

export const improveAcademicWriting = async (text: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Améliore le style académique de ce texte en français. Corrige la grammaire, utilise un ton formel, simplifie les phrases complexes et élimine les répétitions:
    "${text}"`,
  });
  return response.text;
};

export const analyzeScientificQuality = async (thesisContent: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Analyse la qualité scientifique de cette thèse. Évalue la clarté de la problématique, la cohérence de la méthodologie et la logique des chapitres.
    Donne un score sur 100 et des recommandations précises en français.
    Format JSON: { "score": number, "analysis": string, "recommendations": string[] }`,
    config: {
      responseMimeType: "application/json"
    }
  });
  return JSON.parse(response.text);
};

export const generateCitations = async (rawInput: string, style: 'APA' | 'MLA' | 'Chicago') => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Génère des citations au format ${style} pour les sources suivantes:
    "${rawInput}"
    Réponds en JSON: { "citations": string[] }`,
    config: {
      responseMimeType: "application/json"
    }
  });
  return JSON.parse(response.text);
};

export const generateDefensePrep = async (thesisSummary: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Prépare la soutenance pour cette thèse. Génère un plan de présentation, des questions probables du jury et des suggestions de réponses.
    Format JSON: { "presentationOutline": string[], "juryQuestions": { "question": string, "answer": string }[] }`,
    config: {
      responseMimeType: "application/json"
    }
  });
  return JSON.parse(response.text);
};

export const restructureAndFormatDocument = async (rawText: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Prends ce texte brut et non structuré d'une thèse et réorganise-le de manière logique et académique. 
    Ajoute des titres (Markdown #, ##, ###), structure les paragraphes, et assure une mise en forme cohérente.
    Le résultat doit être un texte Markdown complet prêt à être utilisé.
    
    Texte brut:
    "${rawText}"`,
  });
  return response.text;
};
