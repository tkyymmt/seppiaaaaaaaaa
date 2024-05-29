import {
  UserCredential,
  signInWithEmailAndPassword,
  signOut,
  getIdToken,
  User,
} from 'firebase/auth';
import { auth } from './firebase';


export const login = (email: string, password: string): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const getToken = async (): Promise<string> => {
  if (!auth.currentUser) return '';

  return await getIdToken(auth.currentUser);
}

export const logout = (): Promise<void> => {
  return signOut(auth);
};