import React, {useState} from 'react';
import { verifyEmail } from '../../services/authService';
import { useLocation, useNavigate } from 'react-router-dom';

type VerifyEmailLocationState = {
    email?: string;
};

const VerifyEmailPage = () => {
    const location = useLocation();
    const state = location.state as VerifyEmailLocationState | null;

    const [form, setForm] = useState({
        email: state?.email ?? "",
        code: ""
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value})
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try{
            await verifyEmail({email: form.email, code: form.code});
            navigate("/login")
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message: "Verify email failed");
        }
    }

    return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2>Email Verificaiton Code</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="code" placeholder="Enter Verification code" value={form.code} onChange={handleChange} required />
        <br />
        <button type="submit">Verify</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default VerifyEmailPage;