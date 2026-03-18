import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export const addVisitLog = async (visitData: {
  userId: string;
  email: string;
  displayName: string;
  purposeOfVisit: string;
  college: string;
  employeeType: "student" | "faculty" | "staff";
}) => {
  await addDoc(collection(db, "visits"), {
    ...visitData,
    timestamp: serverTimestamp(),
  });
};

export const getAllVisits = async () => {
  const snapshot = await getDocs(collection(db, "visits"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};