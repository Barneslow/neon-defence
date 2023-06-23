import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { firebaseAuth, firebaseDB } from "./config/firebase";

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(firebaseAuth, provider);
    const user = result.user;

    createUserDocumentFromAuth(user);
    alert("You have signed in with Google successfully!");
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode + errorMessage);
  }
};

export const createUserDocumentFromAuth = async (userAuth) => {
  if (!userAuth) return;

  const userDocRef = doc(firebaseDB, "users", userAuth.uid);

  const userSnapShot = await getDoc(userDocRef);

  if (!userSnapShot.exists()) {
    const { email, displayName, name } = userAuth;

    const createAt = new Date();

    const newUser = {
      createAt,
      email,
      name: displayName || name,
      userName: displayName,
      highScore: 0,
    };

    try {
      await setDoc(userDocRef, newUser);
    } catch (err) {
      console.log(`error creating user`, err.message);
    }
  }

  return userSnapShot;
};
export const checkAuthState = async () => {
  onAuthStateChanged(firebaseAuth, (user) => {
    if (user) {
      const menu = document.querySelector(".menu-content");
      const signInBtn = document.getElementById("signin-btn");

      if (!signInBtn) return;
      signInBtn.style.display = "none";
      const userTitle = document.createElement("h2");
      userTitle.textContent = `${user.displayName}`;
      userTitle.style.color = "white";

      const existingChild = menu.children[1];

      menu.insertBefore(userTitle, existingChild);
    } else {
      console.log("user is not logged in");
    }
  });
};

checkAuthState();
