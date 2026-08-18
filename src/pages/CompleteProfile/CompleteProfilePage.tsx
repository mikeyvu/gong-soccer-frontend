import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { completeProfile } from "@/services/profileService";
import { useAuth } from "@/context/AuthContext";

export default function CompleteProfilePage() {
  const navigate = useNavigate();
  const { auth, setProfileComplete } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [form, setForm] = useState({ fullName: "", dateOfBirth: "", phone: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fullName.trim()) {
      setError("Full name is required.");
      return;
    }
    setLoading(true);
    try {
      const user = await completeProfile(
        { fullName: form.fullName, phone: form.phone, dateOfBirth: form.dateOfBirth },
        avatar ?? undefined
      );
      setProfileComplete(user);
      const teamId = auth.workspace?.activeMembership?.teamId;
      navigate(teamId ? `/${teamId}/dashboard` : "/auth");
    } catch {
      setError("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full px-4 py-3 h-auto rounded-xl bg-white/10 border border-white/25 text-white placeholder:text-white/40 focus-visible:ring-white/40 focus-visible:border-transparent";
  const labelClass = "text-white/80 text-sm font-medium mb-1.5";

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center"
      style={{ background: "#0a1a0f" }}
    >
      <img
        src="/soccer-background.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        style={{ filter: "blur(4px) brightness(0.72)" }}
      />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/15 border border-white/30 mb-3">
            <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" />
              <path
                d="M12 2a10 10 0 0 1 6.32 17.85L14 14l2-4-4-1-4 1 2 4-4.32 5.85A10 10 0 0 1 12 2z"
                fill="white"
                opacity="0.85"
              />
            </svg>
          </div>
          <h1 className="text-white text-2xl font-bold tracking-tight">GongSoccer</h1>
          <p className="text-white/60 text-sm mt-1">Almost there!</p>
        </div>

        <div className="rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md p-8 shadow-2xl">
          <h2 className="text-white text-xl font-semibold mb-1">Complete your profile</h2>
          <p className="text-white/50 text-sm mb-6">
            This helps your captain and teammates recognise you.
          </p>

          {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Avatar upload */}
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-full bg-white/10 border-2 border-dashed border-white/30 hover:border-white/60 flex items-center justify-center overflow-hidden transition-colors"
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    className="w-8 h-8 text-white/40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />
                    <path d="M21 21a9 9 0 1 0-18 0" />
                  </svg>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <span className="text-white/40 text-xs">
                {avatarPreview ? "Tap to change photo" : "Upload profile photo"}
              </span>
            </div>

            <div>
              <Label htmlFor="fullName" className={labelClass}>
                Full Name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Your full name"
                value={form.fullName}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <Label htmlFor="dateOfBirth" className={labelClass}>Date of Birth</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={form.dateOfBirth}
                onChange={handleChange}
                className={`${inputClass} [color-scheme:dark]`}
              />
            </div>

            <div>
              <Label htmlFor="phone" className={labelClass}>Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 234 567 8900"
                value={form.phone}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 h-auto rounded-xl bg-green-500 hover:bg-green-400 text-white font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-green-500/30 active:scale-[0.98]"
            >
              {loading ? "Saving…" : "Save & Continue"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}