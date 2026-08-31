import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import AuthPage from "./pages/Auth/AuthPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import CompleteProfilePage from "./pages/CompleteProfile/CompleteProfilePage";
import ManageTeamPage from "./pages/ManageTeam/ManageTeamPage";
import ProtectedRoute from "./components/ProtectedRoute";
import './App.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/signup" element={<Navigate to="/auth" replace />} />
          <Route path="/login" element={<Navigate to="/auth" replace />} />
          <Route path="/verify-email" element={<Navigate to="/auth" replace />} />
          <Route
            path="/complete-profile"
            element={
              <ProtectedRoute requireProfile={false}>
                <CompleteProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/:teamId/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/:teamId/manage"
            element={
              <ProtectedRoute minRole="CAPTAIN">
                <ManageTeamPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
