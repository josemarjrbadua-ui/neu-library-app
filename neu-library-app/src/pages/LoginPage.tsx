import { useNavigate } from "react-router-dom";
import type { CSSProperties } from "react";
import { loginWithGoogle } from "../services/authService";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await loginWithGoogle();

      if (result.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/check-in");
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay}>
        <div style={styles.leftPanel}>
          <div style={styles.leftOverlay}>
            <div style={styles.brandBadge}>NEU Library</div>

            <h1 style={styles.heroTitle}>
              Visitor Management
              <br />
              System
            </h1>

            <p style={styles.heroText}>
              A secure and simple system for recording, monitoring, and managing
              library visitors using institutional Google accounts.
            </p>

            <div style={styles.featureList}>
              <div style={styles.featureItem}>Secure NEU Google Login</div>
              <div style={styles.featureItem}>Visitor Check-In Logging</div>
              <div style={styles.featureItem}>Admin Dashboard and Reports</div>
              <div style={styles.featureItem}>Block and Unblock Users</div>
            </div>
          </div>
        </div>

        <div style={styles.rightPanel}>
          <div style={styles.card}>
            <img
              src="/neu-logo.jpg"
              alt="New Era University Logo"
              style={styles.logoImage}
            />

            <h2 style={styles.cardTitle}>Welcome Back</h2>
            <p style={styles.cardText}>
              Sign in using your official NEU Google account to continue.
            </p>

            <button onClick={handleLogin} style={styles.button}>
              Sign in with Google
            </button>

            <p style={styles.footerText}>
              Only authorized institutional accounts are allowed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 45%, #60a5fa 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
  },
  overlay: {
    width: "100%",
    maxWidth: "1280px",
    minHeight: "720px",
    borderRadius: "30px",
    overflow: "hidden",
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    boxShadow: "0 25px 70px rgba(0,0,0,0.28)",
    background: "#ffffff",
  },
  leftPanel: {
    position: "relative",
    backgroundImage: 'url("/neu-building.png")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "720px",
    display: "flex",
  },
  leftOverlay: {
    width: "100%",
    minHeight: "100%",
    background: "linear-gradient(135deg, rgba(15,23,42,0.60), rgba(37,99,235,0.45))",
    padding: "56px 60px",
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  brandBadge: {
    display: "inline-block",
    width: "fit-content",
    background: "rgba(255,255,255,0.16)",
    border: "1px solid rgba(255,255,255,0.28)",
    color: "#ffffff",
    padding: "10px 16px",
    borderRadius: "999px",
    fontWeight: 700,
    marginBottom: "26px",
    backdropFilter: "blur(6px)",
  },
  heroTitle: {
    fontSize: "58px",
    lineHeight: 1.02,
    margin: 0,
    marginBottom: "22px",
    fontWeight: 900,
    textShadow: "0 10px 30px rgba(0,0,0,0.22)",
  },
  heroText: {
    fontSize: "20px",
    lineHeight: 1.7,
    maxWidth: "620px",
    color: "rgba(255,255,255,0.94)",
    marginBottom: "30px",
    textShadow: "0 6px 18px rgba(0,0,0,0.18)",
  },
  featureList: {
    display: "grid",
    gap: "14px",
    maxWidth: "560px",
  },
  featureItem: {
    background: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.22)",
    padding: "16px 18px",
    borderRadius: "16px",
    fontWeight: 700,
    fontSize: "18px",
    backdropFilter: "blur(8px)",
    boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
  },
  rightPanel: {
    background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "42px",
  },
  card: {
    width: "100%",
    maxWidth: "430px",
    textAlign: "center",
    padding: "18px 8px",
  },
  logoImage: {
    width: "120px",
    height: "120px",
    objectFit: "contain",
    display: "block",
    margin: "0 auto 22px auto",
    filter: "drop-shadow(0 14px 24px rgba(37,99,235,0.20))",
  },
  cardTitle: {
    fontSize: "44px",
    margin: 0,
    marginBottom: "14px",
    color: "#0f172a",
    fontWeight: 900,
    letterSpacing: "-0.02em",
  },
  cardText: {
    color: "#64748b",
    lineHeight: 1.7,
    marginBottom: "30px",
    fontSize: "19px",
  },
  button: {
    width: "100%",
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "#ffffff",
    border: "none",
    padding: "16px 22px",
    borderRadius: "16px",
    cursor: "pointer",
    fontSize: "20px",
    fontWeight: 800,
    boxShadow: "0 16px 28px rgba(37,99,235,0.26)",
  },
  footerText: {
    marginTop: "18px",
    color: "#94a3b8",
    fontSize: "14px",
  },
};