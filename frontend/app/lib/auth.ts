import {
    UserCredential,
    signInWithEmailAndPassword,
    signOut,
  } from 'firebase/auth';
  import { auth } from './firebase';
  
  export const login = (email: string, password: string): Promise<UserCredential> => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  
  export const logout = (): Promise<void> => {
    return signOut(auth);
  };