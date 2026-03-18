import {
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, provider, db } from "../firebase";

const ALLOWED_DOMAIN = "@neu.edu.ph";

const isAllowedNeuEmail = (email: string) => {
  return email.toLowerCase().endsWith(ALLOWED_DOMAIN);
};

export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  if (!user.email || !isAllowedNeuEmail(user.email)) {
    await signOut(auth);
    throw new Error("Only NEU institutional email accounts are allowed.");
  }

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "",
      role: "user",
      college: "",
      isBlocked: false,
      employeeType: "student",
      authProvider: "google",
    });

    return {
      user,
      role: "user",
    };
  } else {
    const existingUser = userSnap.data();

    if (existingUser.isBlocked) {
      await signOut(auth);
      throw new Error("Your account has been blocked by the admin.");
    }

    return {
      user,
      role: existingUser.role || "user",
    };
  }
};

export const registerWithEmailPassword = async (data: {
  name: string;
  email: string;
  password: string;
  college: string;
  employeeType: "student" | "faculty" | "staff";
}) => {
  if (!isAllowedNeuEmail(data.email)) {
    throw new Error("Only @neu.edu.ph email accounts are allowed.");
  }

  const result = await createUserWithEmailAndPassword(auth, data.email, data.password);
  const user = result.user;

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: data.email,
    displayName: data.name,
    role: "user",
    college: data.college,
    isBlocked: false,
    employeeType: data.employeeType,
    authProvider: "email",
  });

  return {
    user,
    role: "user",
  };
};

export const loginWithEmailPassword = async (email: string, password: string) => {
  if (!isAllowedNeuEmail(email)) {
    throw new Error("Only @neu.edu.ph email accounts are allowed.");
  }

  const result = await signInWithEmailAndPassword(auth, email, password);
  const user = result.user;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error("User record not found.");
  }

  const existingUser = userSnap.data();

  if (existingUser.isBlocked) {
    await signOut(auth);
    throw new Error("Your account has been blocked by the admin.");
  }

  return {
    user,
    role: existingUser.role || "user",
  };
};

export const logoutUser = async () => {
  await signOut(auth);
};