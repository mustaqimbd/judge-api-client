import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
export const AuthContext = createContext(null);
const auth = getAuth(app);
import { GoogleAuthProvider } from "firebase/auth";
import app from "./firebase.config";
import useAxios from "./UseAxios";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [instance] = useAxios();

  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };
  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };
  const googleProvider = new GoogleAuthProvider();
  const googleSignIn = () => {
    return signInWithPopup(auth, googleProvider);
  };
  const loginUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  const logOut = () => {
    return signOut(auth);
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        instance
          .post(`/jwt-token`, { email: user.email, username: user.displayName })
          .then((res) => {
            localStorage.setItem("AUTH_TOKEN", res.data.token);
          })
          .catch((err) => console.log("Server error,Server is not running now"));
      } else {
        localStorage.removeItem("AUTH_TOKEN");
      }
    });
    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    createUser,
    updateUserProfile,
    googleSignIn,
    loginUser,
    logOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
