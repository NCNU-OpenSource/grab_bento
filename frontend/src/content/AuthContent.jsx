import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { update_jwt } from "../api/server";
import { useHistory } from "react-router-dom";

const AuthContent = React.createContext();

export function useAuth() {
  return useContext(AuthContent);
}

export { AuthContent };

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(undefined);

  function signup(email, passwd) {
    return auth.createUserWithEmailAndPassword(email, passwd);
  }
  function signin(email, passwd) {
    return auth.signInWithEmailAndPassword(email, passwd);
  }

  function logout() {
    return auth.signOut();
  }
  function resetPasswd(email) {
    return auth.sendPasswordResetEmail(email);
  }

  useEffect(async () => {
    const unSubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      }
    });
    return unSubscribe;
  }, []);

  useEffect(async () => {
    if (currentUser) {
      await update_jwt("Bearer " + (await currentUser.getIdToken(true)));
    }
  }, [currentUser]);
  const value = {
    currentUser,
    signup,
    signin,
    logout,
    resetPasswd,
  };
  return <AuthContent.Provider value={value}>{children}</AuthContent.Provider>;
}
