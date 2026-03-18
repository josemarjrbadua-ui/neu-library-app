import { signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, provider, db } from "../firebase";

const ALLOWED_DOMAIN = "@neu.edu.ph";

export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  if (!user.email || !user.email.endsWith(ALLOWED_DOMAIN)) {
    await signOut(auth);
    throw new Error("Only NEU email accounts are allowed.");
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

export const logoutUser = async () => {
  await signOut(auth);
};