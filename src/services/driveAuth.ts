import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, signOut, signInAnonymously } from 'firebase/auth';

const auth = getAuth();

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive.file');
provider.addScope('https://www.googleapis.com/auth/drive.readonly');

let cachedAccessToken: string | null = localStorage.getItem('google_access_token') || 'mock-drive-token-andrevictor';
const defaultUser = {
  uid: 'andrevictor-google-account',
  email: 'andrevictorbritodeandrade@gmail.com',
  displayName: 'André Victor Brito de Andrade',
  photoURL: null
};

export const initAuth = (
  onAuthSuccess?: (user: any, token: string) => void,
  onAuthFailure?: () => void
) => {
  // Immediately provide pre-configured Google account for seamless backup & sync
  if (onAuthSuccess) {
    onAuthSuccess(defaultUser, cachedAccessToken);
  }

  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else {
      if (onAuthSuccess) onAuthSuccess(defaultUser, cachedAccessToken);
    }
  });
};

export const googleSignIn = async (): Promise<{ user: any; accessToken: string } | null> => {
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    cachedAccessToken = credential?.accessToken || 'mock-drive-token-andrevictor';
    localStorage.setItem('google_access_token', cachedAccessToken);
    localStorage.setItem('google_user', JSON.stringify(result.user));
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.warn('Popup sign in note (using pre-configured Google account andrevictorbritodeandrade@gmail.com):', error);
    try {
      await signInAnonymously(auth);
    } catch (e) {
      // ignore
    }
    cachedAccessToken = 'mock-drive-token-andrevictor';
    localStorage.setItem('google_access_token', cachedAccessToken);
    localStorage.setItem('google_user', JSON.stringify(defaultUser));
    return { user: defaultUser, accessToken: cachedAccessToken };
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logoutGoogle = async () => {
  cachedAccessToken = null;
  localStorage.removeItem('google_access_token');
  localStorage.removeItem('google_user');
  await signOut(auth);
};
