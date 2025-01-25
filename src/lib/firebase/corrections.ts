import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import type { CorrectionProject, CorrectionCopy } from '../../types/correction';

export const CORRECTIONS_COLLECTION = 'corrections';

// Maximum size for a single Firestore document (1MB)
const MAX_DOCUMENT_SIZE = 1000000;

// Convert timestamps to dates and back
const convertTimestamps = (data: any): any => {
  if (data instanceof Timestamp) {
    return data.toDate();
  }
  if (Array.isArray(data)) {
    return data.map(convertTimestamps);
  }
  if (data && typeof data === 'object') {
    return Object.keys(data).reduce((result, key) => ({
      ...result,
      [key]: convertTimestamps(data[key])
    }), {});
  }
  return data;
};

// Validate and prepare data for Firestore
const prepareForFirestore = (data: any): any => {
  if (data === null || data === undefined) {
    return null;
  }

  // Convert Date objects to Timestamps
  if (data instanceof Date) {
    return Timestamp.fromDate(data);
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map(prepareForFirestore);
  }

  // Handle objects
  if (typeof data === 'object') {
    const prepared: { [key: string]: any } = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null) {
        prepared[key] = prepareForFirestore(value);
      }
    }
    return prepared;
  }

  // Handle strings (truncate if too long)
  if (typeof data === 'string' && data.length > MAX_DOCUMENT_SIZE) {
    return data.substring(0, MAX_DOCUMENT_SIZE);
  }

  return data;
};

// Split content into chunks if needed
const splitContent = (content: string): { mainContent: string, chunks: string[] } => {
  if (!content) {
    return { mainContent: '', chunks: [] };
  }

  const chunkSize = MAX_DOCUMENT_SIZE / 2; // Leave room for other fields
  const chunks: string[] = [];
  
  if (content.length > chunkSize) {
    let remaining = content;
    const mainContent = remaining.substring(0, chunkSize);
    remaining = remaining.substring(chunkSize);

    while (remaining.length > 0) {
      chunks.push(remaining.substring(0, chunkSize));
      remaining = remaining.substring(chunkSize);
    }

    return { mainContent, chunks };
  }

  return { mainContent: content, chunks: [] };
};

export const saveCorrection = async (data: Omit<CorrectionProject, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    // Process copies to handle large content
    const processedCopies = data.copies.map(copy => {
      const { mainContent, chunks } = splitContent(copy.content);
      return {
        ...copy,
        content: mainContent,
        contentChunks: chunks,
        createdAt: copy.createdAt
      };
    });

    // Prepare the document data
    const docData = prepareForFirestore({
      ...data,
      copies: processedCopies,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    const docRef = await addDoc(collection(db, CORRECTIONS_COLLECTION), docData);
    return docRef.id;
  } catch (error) {
    console.error('Error saving correction:', error);
    throw error;
  }
};

export const getCorrection = async (id: string): Promise<CorrectionProject | null> => {
  try {
    const docRef = doc(db, CORRECTIONS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // Merge content chunks for copies
      if (data.copies) {
        data.copies = data.copies.map((copy: any) => ({
          ...copy,
          content: copy.contentChunks ? 
            [copy.content, ...(copy.contentChunks || [])].join('') : 
            copy.content
        }));
      }

      return {
        id: docSnap.id,
        ...convertTimestamps(data)
      } as CorrectionProject;
    }
    return null;
  } catch (error) {
    console.error('Error getting correction:', error);
    throw error;
  }
};

export const getUserCorrections = async (userId: string): Promise<CorrectionProject[]> => {
  try {
    const q = query(
      collection(db, CORRECTIONS_COLLECTION),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestamps(doc.data())
    })) as CorrectionProject[];
  } catch (error) {
    console.error('Error getting user corrections:', error);
    throw error;
  }
};

export const updateCorrection = async (id: string, data: Partial<CorrectionProject>) => {
  try {
    const docRef = doc(db, CORRECTIONS_COLLECTION, id);
    
    // Process copies if they exist in the update
    const processedData = { ...data };
    if (data.copies) {
      processedData.copies = data.copies.map(copy => {
        const { mainContent, chunks } = splitContent(copy.content);
        return {
          ...copy,
          content: mainContent,
          contentChunks: chunks,
          createdAt: copy.createdAt instanceof Date ? copy.createdAt : new Date(copy.createdAt)
        };
      });
    }

    // Prepare the update data
    const updateData = prepareForFirestore({
      ...processedData,
      updatedAt: Timestamp.now()
    });

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating correction:', error);
    throw error;
  }
};

export const deleteCorrection = async (id: string) => {
  try {
    const docRef = doc(db, CORRECTIONS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting correction:', error);
    throw error;
  }
};