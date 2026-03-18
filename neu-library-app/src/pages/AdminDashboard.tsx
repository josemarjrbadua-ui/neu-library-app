import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import { logoutUser } from "../services/authService";

type UserItem = {
  id: string;
  uid?: string;
  email?: string;
  displayName?: string;
  role?: string;
  college?: string;
  isBlocked?: boolean;
  employeeType?: string;
};

type VisitItem = {
  id: string;
  userId?: string;
  email?: string;
  displayName?: string;
  purposeOfVisit?: string;
  college?: string;
  employeeType?: string;
  timestamp?: any;
};

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [visits, setVisits] = useState<VisitItem[]>([]);
  const [search, setSearch] = useState("");
  const [purposeFilter, setPurposeFilter] = useState("");
  const [collegeFilter, setCollegeFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchData = async () => {
    const userSnapshot = await getDocs(collection(db, "users"));
    const visitSnapshot = await getDocs(collection(db, "visits"));

    const userData = userSnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as UserItem[];

    const visitData = visitSnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as VisitItem[];

    setUsers(userData);
    setVisits(visitData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleBlock = async (userId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        isBlocked: !currentStatus,
      });
      fetchData();
    } catch (error) {
      alert("Failed to update user status.");
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      alert("Failed to logout.");
    }
  };

  const today = new Date();

  const getVisitDate = (dateValue: any) => {
    if (!dateValue?.seconds) return null;
    return new Date(dateValue.seconds * 1000);
  };

  const isSameDay = (dateValue: any) => {
    const date = getVisitDate(dateValue);
    if (!date) return false;

    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isThisWeek = (dateValue: any) => {
    const date = getVisitDate(dateValue);
    if (!date) return false;

    const now = new Date();
    const firstDay = new Date(now);
    firstDay.setDate(now.getDate() - now.getDay());
    firstDay.setHours(0, 0, 0, 0);

    const lastDay = new Date(firstDay);
    lastDay.setDate(firstDay.getDate() + 6);
    lastDay.setHours(23, 59, 59, 999);

    return date >= firstDay && date <= lastDay;
  };

  const matchesDateRange = (dateValue: any) => {
    const date = getVisitDate(dateValue);
    if (!date) return false;

    const visitDateOnly = new Date(date);
    visitDateOnly.setHours(0, 0, 0, 0);

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      if (visitDateOnly < start) return false;
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (date > end) return false;
    }

    return true;
  };

  const filteredVisits = useMemo(() => {
    return visits.filter((visit) => {
      const matchPurpose = purposeFilter ? visit.purposeOfVisit === purposeFilter : true;
      const matchCollege = collegeFilter
        ? (visit.college || "").toLowerCase().includes(collegeFilter.toLowerCase())
        : true;
      const matchType = typeFilter ? visit.employeeType === typeFilter : true;
      const matchDateRange = matchesDateRange(visit.timestamp);

      return matchPurpose && matchCollege && matchType && matchDateRange;
    });
  }, [visits, purposeFilter, collegeFilter, typeFilter, startDate, endDate]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const term = search.toLowerCase();
      return (
        (user.displayName || "").toLowerCase().includes(term) ||
        (user.email || "").toLowerCase().includes(term)
      );
    });
  }, [users, search]);

  const totalToday = filteredVisits.filter((visit) => isSameDay(visit.timestamp)).length;
  const totalThisWeek = filteredVisits.filter((visit) => isThisWeek(visit.timestamp)).length;
  const totalFiltered = filteredVisits.length;

  const clearFilters = () => {
    setPurposeFilter("");
    setCollegeFilter("");
    setTypeFilter("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.title}>NEU Library Admin Dashboard</h1>
            <p style={styles.subtitle}>Monitor visitors, manage users, and review visit logs.</p>
          </div>

          <div style={styles.headerActions}>
            <Link to="/check-in" style={styles.link}>
              Back to Check-in
            </Link>

            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>

        <div style={styles.cardGrid}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Visitors Today</h3>
            <p style={styles.cardNumber}>{totalToday}</p>
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Visitors This Week</h3>
            <p style={styles.cardNumber}>{totalThisWeek}</p>
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Filtered Visits</h3>
            <p style={styles.cardNumber}>{totalFiltered}</p>
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Visit Filters</h2>
            <button onClick={clearFilters} style={styles.clearButton}>
              Clear Filters
            </button>
          </div>

          <div style={styles.filterGrid}>
            <select
              value={purposeFilter}
              onChange={(e) => setPurposeFilter(e.target.value)}
              style={styles.input}
            >
              <option value="">All Reasons</option>
              <option value="Study">Study</option>
              <option value="Research">Research</option>
              <option value="Borrow Books">Borrow Books</option>
              <option value="Use Computer">Use Computer</option>
              <option value="Return Books">Return Books</option>
              <option value="Others">Others</option>
            </select>

            <input
              type="text"
              placeholder="Filter by college"
              value={collegeFilter}
              onChange={(e) => setCollegeFilter(e.target.value)}
              style={styles.input}
            />

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={styles.input}
            >
              <option value="">All User Types</option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="staff">Staff</option>
            </select>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={styles.input}
            />

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Reason</th>
                  <th style={styles.th}>College</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Date and Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisits.length > 0 ? (
                  filteredVisits.map((visit) => {
                    const visitDate = getVisitDate(visit.timestamp);

                    return (
                      <tr key={visit.id}>
                        <td style={styles.td}>{visit.displayName || "-"}</td>
                        <td style={styles.td}>{visit.email || "-"}</td>
                        <td style={styles.td}>{visit.purposeOfVisit || "-"}</td>
                        <td style={styles.td}>{visit.college || "-"}</td>
                        <td style={styles.td}>{visit.employeeType || "-"}</td>
                        <td style={styles.td}>
                          {visitDate ? visitDate.toLocaleString() : "-"}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td style={styles.td} colSpan={6}>
                      No visit records found for the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>User Management</h2>

          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.input}
          />

          <div style={styles.userList}>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div key={user.id} style={styles.userCard}>
                  <div>
                    <div style={styles.userName}>{user.displayName || "No Name"}</div>
                    <div style={styles.userEmail}>{user.email || "No Email"}</div>
                    <div style={styles.userRole}>
                      Role: {user.role || "user"} | Status: {user.isBlocked ? "Blocked" : "Active"}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleBlock(user.id, !!user.isBlocked)}
                    style={{
                      ...styles.blockButton,
                      background: user.isBlocked ? "#16a34a" : "#dc2626",
                    }}
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                </div>
              ))
            ) : (
              <div style={styles.emptyText}>No users found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f3f4f6",
    padding: "24px",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  title: {
    margin: 0,
    color: "#1d4ed8",
  },
  subtitle: {
    marginTop: "8px",
    marginBottom: 0,
    color: "#6b7280",
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  link: {
    textDecoration: "none",
    color: "#2563eb",
    fontWeight: 600,
  },
  logoutButton: {
    background: "#dc2626",
    color: "#ffffff",
    border: "none",
    padding: "10px 14px",
    borderRadius: "10px",
    cursor: "pointer",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  },
  cardTitle: {
    margin: 0,
    marginBottom: "12px",
    color: "#374151",
  },
  cardNumber: {
    margin: 0,
    fontSize: "32px",
    fontWeight: 700,
    color: "#111827",
  },
  section: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    marginBottom: "24px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  sectionTitle: {
    margin: 0,
  },
  clearButton: {
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    padding: "10px 14px",
    borderRadius: "10px",
    cursor: "pointer",
  },
  filterGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
    marginBottom: "16px",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    marginBottom: "12px",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
    background: "#f9fafb",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
  },
  userList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  userCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "14px",
  },
  userName: {
    fontWeight: 700,
    color: "#111827",
  },
  userEmail: {
    color: "#6b7280",
    fontSize: "14px",
    marginTop: "4px",
  },
  userRole: {
    color: "#4b5563",
    fontSize: "13px",
    marginTop: "6px",
  },
  blockButton: {
    color: "#ffffff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    minWidth: "100px",
  },
  emptyText: {
    color: "#6b7280",
    padding: "8px 0",
  },
};