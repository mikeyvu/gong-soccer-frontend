import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUpPage from "./pages/SignUp/SignUpPage";
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUpPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        {/* <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/complete-profile" element={<CompleteProfilePage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App
