import { useState, useEffect } from 'react';
import firebase from 'firebase';

export default function useAuth() {
  const [user, setUser] = useState(null);

  const signin = (email ,password) => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        setUser(response.user);
        return response.user;
      });
  };

  const signup = (email, password) => {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        setUser(response.user);
        firebase.firestore().collection("users").doc(response.user.uid).set({
            email:response.user.email,
            displayName: response.user.displayName?response.user.displayName:"Ideafi Rookie",
            photoURL: response.user.photoURL ?response.user.photoURL : "/pic.jpg",
            verified: false,
            github: "",
            about: "Nothing to see here",
            fullname: response.user.displayName?response.user.displayName:"Ideafi Rookie"
        })
        return response.user;
      });
  };

  const signout = () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(false);
      });
  };

  const sendPasswordResetEmail = (email) => {
    return firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        return true;
      });
  };

  const confirmPasswordReset = (password, code) => {
    return firebase
      .auth()
      .confirmPasswordReset(code, password)
      .then(() => {
        return true;
      });
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    userId: user && user.uid,
    signin,
    signup,
    signout,
    sendPasswordResetEmail,
    confirmPasswordReset,
  };
};

