import { encode, decode } from 'gpt-tokenizer';

const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const MAX_TOKENS = 4000;

const validateApiKey = () => {
  if (!API_KEY) {
    throw new Error('Clé API OpenAI non configurée');
  }
  return API_KEY;
};

const truncateContent = (content: string): string => {
  const tokens = encode(content);
  if (tokens.length > MAX_TOKENS) {
    const truncatedTokens = tokens.slice(0, MAX_TOKENS);
    return decode(truncatedTokens);
  }
  return content;
};

const callOpenAI = async (prompt: string, maxTokens: number = 800) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${validateApiKey()}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: maxTokens
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Erreur API OpenAI');
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
};

export const generateExerciseSuggestions = async (
  classe: string,
  objectifs: string,
  duree: string,
  format?: string,
  sujetsPrefs?: string
): Promise<string[]> => {
  try {
    const prompt = `En tant que professeur de français pour une classe de ${classe}, proposez 3 sujets d'évaluation différents.

Objectifs pédagogiques: ${objectifs}
Durée prévue: ${duree}
${format ? `Format souhaité: ${format}` : ''}
${sujetsPrefs ? `Centres d'intérêt des élèves: ${sujetsPrefs}` : ''}

Format de réponse souhaité:
- Proposez exactement 3 sujets
- Chaque sujet doit être concis et clair
- Adaptez le niveau de difficulté à la classe
- Assurez-vous que les sujets permettent d'évaluer les objectifs pédagogiques`;

    const response = await callOpenAI(prompt, 1000);
    return response.split('\n').filter(line => line.trim().length > 0 && !line.startsWith('-'));
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    throw new Error(error.message || 'Erreur lors de la génération des suggestions');
  }
};

export const generateBaremeSuggestion = async (
  classe: string,
  sujet: string,
  totalPoints: number
): Promise<Array<{ id: string; description: string; points: number }>> => {
  try {
    const prompt = `En tant que professeur de français pour une classe de ${classe}, proposez un barème détaillé pour le sujet suivant:

Sujet: ${sujet}
Points totaux: ${totalPoints}

Format de réponse souhaité:
- Listez les critères d'évaluation
- Pour chaque critère, indiquez les points attribués
- Le total des points doit être exactement ${totalPoints}
- Adaptez les critères au niveau de la classe
- Format: Critère: X points`;

    const response = await callOpenAI(prompt, 800);
    const lines = response.split('\n').filter(line => line.includes(':'));
    
    return lines.map(line => {
      const [description, pointsStr] = line.split(':').map(s => s.trim());
      const points = parseInt(pointsStr);
      return {
        id: crypto.randomUUID(),
        description,
        points: isNaN(points) ? 0 : points
      };
    });
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    throw new Error(error.message || 'Erreur lors de la génération du barème');
  }
};

export const getCorrectionFeedback = async (
  classe: string,
  sujet: string,
  bareme: string,
  file: File
): Promise<string> => {
  try {
    const content = await file.text();
    if (!content) {
      throw new Error('Contenu du fichier vide');
    }

    const truncatedContent = truncateContent(content);
    const prompt = `En tant que professeur de français d'élèves en ${classe}, évaluez cette copie de manière concise.

Sujet: ${sujet}
Barème: ${bareme}

Copie à évaluer:
${truncatedContent}

Format de réponse souhaité:
1. Note finale (sur le total du barème)
2. Bref commentaire général (1-2 phrases)
3. Points par critère (liste simple)`;

    return await callOpenAI(prompt, 800);
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    throw new Error(error.message || 'Erreur lors de la correction');
  }
};