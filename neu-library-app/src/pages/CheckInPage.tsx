import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { addVisitLog } from "../services/visitService";
import { logoutUser } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";

const collegeOptions = [
  "College of Communication",
  "College of Information Communication and Science",
  "College of Business Administration",
  "College of Education",
  "College of Engineering",
  "College of Nursing",
  "College of Arts and Sciences",
  "Senior High School",
  "Junior High School",
  "Elementary",
  "Administrative Office",
  "Faculty Office",
  "Other Department",
];

export default function CheckInPage() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [purposeOfVisit, setPurposeOfVisit] = useState("");
  const [college, setCollege] = useState("");
  const [employeeType, setEmployeeType] = useState<"student" | "faculty" | "staff">("student");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/", { replace: true });
        return;
      }

      setCurrentUser(user);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      alert("No user logged in.");
      return;
    }

    if (!purposeOfVisit || !college || !employeeType) {
      alert("Please complete the form.");
      return;
    }

    try {
      await addVisitLog({
        userId: currentUser.uid,
        email: currentUser.email || "",
        displayName: currentUser.displayName || "",
        purposeOfVisit,
        college,
        employeeType,
      });

      setSuccess(true);
      setPurposeOfVisit("");
      setCollege("");
      setEmployeeType("student");
    } catch (error) {
      console.error(error);
      alert("Failed to save visit log.");
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
      alert("Failed to logout.");
    }
  };

  if (authLoading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingCard}>
          <h2 style={styles.loadingText}>Loading user session...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <div style={styles.badge}>User Portal</div>
            <h1 style={styles.title}>NEU Library Visitor Log</h1>
            <p style={styles.subtitle}>
              Record your visit using the form below.
            </p>
          </div>

          <div style={styles.headerActions}>
            <Link to="/admin" style={styles.adminLink}>
              Admin Dashboard
            </Link>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>

        <div style={styles.mainGrid}>
          <div style={styles.infoCard}>
            <h2 style={styles.sectionTitle}>Account Information</h2>

            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Name</span>
              <span style={styles.infoValue}>
                {currentUser?.displayName || "No Name"}
              </span>
            </div>

            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Email</span>
              <span style={styles.infoValue}>
                {currentUser?.email || "No Email"}
              </span>
            </div>

            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Status</span>
              <span style={styles.infoValue}>Active User</span>
            </div>
          </div>

          <div style={styles.formCard}>
            <h2 style={styles.sectionTitle}>Visit Form</h2>

            <form onSubmit={handleSubmit}>
              <label style={styles.label}>Reason for Visiting</label>
              <select
                value={purposeOfVisit}
                onChange={(e) => setPurposeOfVisit(e.target.value)}
                style={styles.input}
                required
              >
                <option value="">Select reason</option>
                <option value="Study">Study</option>
                <option value="Research">Research</option>
                <option value="Borrow Books">Borrow Books</option>
                <option value="Use Computer">Use Computer</option>
                <option value="Return Books">Return Books</option>
                <option value="Others">Others</option>
              </select>

              <label style={styles.label}>College / Department</label>
              <select
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                style={styles.input}
                required
              >
                <option value="">Select your college / department</option>
                {collegeOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <label style={styles.label}>User Type</label>
              <select
                value={employeeType}
                onChange={(e) =>
                  setEmployeeType(e.target.value as "student" | "faculty" | "staff")
                }
                style={styles.input}
                required
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="staff">Staff</option>
              </select>

              <button type="submit" style={styles.submitButton}>
                Submit Visit Log
              </button>
            </form>

            {success && (
              <div style={styles.success}>Welcome to NEU Library!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  loadingPage: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
  },
  loadingCard: {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "18px",
    boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
  },
  loadingText: {
    margin: 0,
    color: "#1e3a8a",
  },
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%)",
    padding: "32px 20px",
  },
  container: {
    maxWidth: "1150px",
    margin: "0 auto",
  },
  header: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "28px 30px",
    boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "24px",
  },
  badge: {
    display: "inline-block",
    background: "#dbeafe",
    color: "#1d4ed8",
    fontWeight: 700,
    padding: "8px 14px",
    borderRadius: "999px",
    marginBottom: "12px",
  },
  title: {
    margin: 0,
    color: "#0f172a",
    fontSize: "34px",
    fontWeight: 800,
  },
  subtitle: {
    marginTop: "10px",
    marginBottom: 0,
    color: "#64748b",
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  adminLink: {
    textDecoration: "none",
    color: "#2563eb",
    fontWeight: 700,
    background: "#eff6ff",
    padding: "12px 16px",
    borderRadius: "12px",
  },
  logoutButton: {
    background: "#dc2626",
    color: "#ffffff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: 700,
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "0.9fr 1.1fr",
    gap: "24px",
  },
  infoCard: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "26px",
    boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
    alignSelf: "start",
  },
  formCard: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "26px",
    boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
  },
  sectionTitle: {
    marginTop: 0,
    marginBottom: "18px",
    color: "#0f172a",
    fontSize: "24px",
    fontWeight: 800,
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    padding: "14px 0",
    borderBottom: "1px solid #e5e7eb",
  },
  infoLabel: {
    color: "#64748b",
    fontWeight: 600,
  },
  infoValue: {
    color: "#0f172a",
    fontWeight: 700,
    textAlign: "right",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    marginTop: "14px",
    fontWeight: 700,
    color: "#1e293b",
  },
  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    background: "#f8fafc",
    fontSize: "15px",
  },
  submitButton: {
    width: "100%",
    marginTop: "18px",
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "#ffffff",
    border: "none",
    padding: "14px",
    borderRadius: "14px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: 800,
    boxShadow: "0 12px 24px rgba(37,99,235,0.20)",
  },
  success: {
    marginTop: "20px",
    padding: "14px",
    borderRadius: "14px",
    background: "#dcfce7",
    color: "#166534",
    textAlign: "center",
    fontWeight: 800,
  },
};