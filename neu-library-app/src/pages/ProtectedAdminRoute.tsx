import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

type Props = {
  children: ReactNode;
};

export default function ProtectedAdminRoute({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsLoggedIn(false);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setIsLoggedIn(true);

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setIsAdmin(userData.role === "admin");
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error checking admin role:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <h2 style={{ padding: "20px" }}>Loading...</h2>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) {
    return (
      <div style={{ padding: "24px", fontFamily: "Arial, sans-serif" }}>
        <h2 style={{ color: "red" }}>Access denied. Admins only.</h2>
      </div>
    );
  }

  return <>{children}</>;
}