import { useState } from "react";
import type { CSSProperties } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerWithEmailPassword } from "../services/authService";

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

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [employeeType, setEmployeeType] = useState<"student" | "faculty" | "staff">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !college || !employeeType || !email || !password || !confirmPassword) {
      alert("Please complete the form.");
      return;
    }

    if (!email.toLowerCase().endsWith("@neu.edu.ph")) {
      alert("Only @neu.edu.ph email accounts are allowed.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      await registerWithEmailPassword({
        name,
        email,
        password,
        college,
        employeeType,
      });

      alert("Registration successful.");
      navigate("/check-in");
    } catch (error: any) {
      alert(error.message || "Registration failed.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create an Account</h1>
        <p style={styles.subtitle}>
          Register using your official <strong>@neu.edu.ph</strong> email account.
        </p>

        <form onSubmit={handleRegister}>
          <label style={styles.label}>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            placeholder="Enter your full name"
            required
          />

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
            onChange={(e) => setEmployeeType(e.target.value as "student" | "faculty" | "staff")}
            style={styles.input}
            required
          >
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="staff">Staff</option>
          </select>

          <label style={styles.label}>NEU Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            placeholder="Enter your @neu.edu.ph email"
            required
          />

          <label style={styles.label}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            placeholder="Enter password"
            required
          />

          <label style={styles.label}>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
            placeholder="Confirm password"
            required
          />

          <button type="submit" style={styles.button}>
            Register
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account?{" "}
          <Link to="/" style={styles.link}>
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
  },
  card: {
    width: "100%",
    maxWidth: "540px",
    background: "#ffffff",
    borderRadius: "24px",
    padding: "32px",
    boxShadow: "0 16px 40px rgba(15,23,42,0.10)",
  },
  title: {
    margin: 0,
    marginBottom: "10px",
    fontSize: "32px",
    fontWeight: 800,
    color: "#0f172a",
  },
  subtitle: {
    marginTop: 0,
    marginBottom: "20px",
    color: "#64748b",
    lineHeight: 1.6,
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
  button: {
    width: "100%",
    marginTop: "20px",
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "#ffffff",
    border: "none",
    padding: "14px",
    borderRadius: "14px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: 800,
  },
  footerText: {
    marginTop: "18px",
    textAlign: "center",
    color: "#64748b",
  },
  link: {
    color: "#2563eb",
    fontWeight: 700,
    textDecoration: "none",
  },
};