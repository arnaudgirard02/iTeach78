import { collection, doc, getDoc, getDocs, setDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import type { ClassAnalytics, StudentProgress } from '../../types/analytics';

export const ANALYTICS_COLLECTION = 'analytics';

export const updateClassAnalytics = async (classAnalytics: ClassAnalytics) => {
  try {
    const docRef = doc(db, ANALYTICS_COLLECTION, `${classAnalytics.userId}_${classAnalytics.classe}`);
    await setDoc(docRef, {
      ...classAnalytics,
      updatedAt: Timestamp.now()
    }, { merge: true });
  } catch (error) {
    console.error('Error updating analytics:', error);
    throw error;
  }
};

export const getClassAnalytics = async (userId: string, classe: string): Promise<ClassAnalytics | null> => {
  try {
    const docRef = doc(db, ANALYTICS_COLLECTION, `${userId}_${classe}`);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        ...docSnap.data(),
        updatedAt: docSnap.data().updatedAt.toDate()
      } as ClassAnalytics;
    }
    return null;
  } catch (error) {
    console.error('Error getting class analytics:', error);
    throw error;
  }
};

export const getAllUserAnalytics = async (userId: string): Promise<ClassAnalytics[]> => {
  try {
    const q = query(
      collection(db, ANALYTICS_COLLECTION),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      updatedAt: doc.data().updatedAt.toDate()
    })) as ClassAnalytics[];
  } catch (error) {
    console.error('Error getting user analytics:', error);
    throw error;
  }
};