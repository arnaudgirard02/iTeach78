import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import type { Course } from '../../types/course';

export const COURSES_COLLECTION = 'courses';

export const saveCourse = async (data: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, COURSES_COLLECTION), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving course:', error);
    throw error;
  }
};

export const getUserCourses = async (userId: string): Promise<Course[]> => {
  try {
    const q = query(
      collection(db, COURSES_COLLECTION),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    })) as Course[];
  } catch (error) {
    console.error('Error getting user courses:', error);
    throw error;
  }
};

export const updateCourse = async (id: string, data: Partial<Course>) => {
  try {
    const docRef = doc(db, COURSES_COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

export const deleteCourse = async (id: string) => {
  try {
    const docRef = doc(db, COURSES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};