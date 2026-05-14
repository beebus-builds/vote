'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '../../lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    tu_registration_number: '',
    faculty: '',
    year: '',
    password: '',
    cpw: ''
  });
  const [fileName, setFileName] = useState('Click to upload JPG, PNG or PDF (max 5 MB)');
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [idCardFile, setIdCardFile] = useState<File | null>(null);

  function updateField(key: string, value: string) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    if (!file) return;
    setIdCardFile(file);
    setFileName(file.name);
    if (file.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password.length < 8) {
      setError('Minimum 8 characters for password');
      return;
    }
    if (formData.password !== formData.cpw) {
      setError('Passwords do not match');
      return;
    }
    if (!idCardFile) {
      setError('Please upload your college ID card');
      return;
    }
    if (idCardFile.size > 5 * 1024 * 1024) {
      setError('File must be smaller than 5 MB');
      return;
    }

    const payload = new FormData();
    payload.append('email', formData.email.trim());
    payload.append('full_name', formData.full_name.trim());
    payload.append('tu_registration_number', formData.tu_registration_number.trim());
    payload.append('faculty', formData.faculty);
    payload.append('year', formData.year);
    payload.append('password', formData.password);
    payload.append('id_card', idCardFile);

    setLoading(true);
    try {
      await register(payload);
      setSuccess('Registration successful! Your account is pending verification by the Election Head. You will be notified once approved.');
      setTimeout(() => router.push('/'), 3500);
    } catch (err: any) {
      setError(err?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-left">
        <div className="auth-brand">iVote</div>
        <p className="auth-tagline">Register to participate in your campus democratic process.</p>
        <div className="auth-features">
          <div className="auth-feat">Submit your TU registration number</div>
          <div className="auth-feat">Upload your college ID card</div>
          <div className="auth-feat">Wait for Election Head verification</div>
          <div className="auth-feat">Vote or run for a position!</div>
        </div>
      </div>
      <div className="auth-right" style={{ alignItems: 'flex-start' }}>
        <div className="auth-card" style={{ maxWidth: 480 }}>
          <h1>Student Registration</h1>
          <p className="sub">Create your account to participate</p>
          {error ? (
            <div className="alert alert-danger">
              <span>✕</span>
              <span>{error}</span>
            </div>
          ) : null}
          {success ? (
            <div className="alert alert-success">
              <span>✓</span>
              <span>{success}</span>
            </div>
          ) : null}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name <span className="req">*</span></label>
              <input type="text" className="form-control" value={formData.full_name} onChange={(e) => updateField('full_name', e.target.value)} placeholder="Ram Prasad Sharma" />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Email <span className="req">*</span></label>
                <input type="email" className="form-control" value={formData.email} onChange={(e) => updateField('email', e.target.value)} placeholder="you@example.com" />
              </div>
              <div className="form-group">
                <label className="form-label">TU Reg. Number <span className="req">*</span></label>
                <input type="text" className="form-control" value={formData.tu_registration_number} onChange={(e) => updateField('tu_registration_number', e.target.value)} placeholder="e.g. 2-2-0101-234-2021" />
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Faculty <span className="req">*</span></label>
                <select className="form-control" value={formData.faculty} onChange={(e) => updateField('faculty', e.target.value)}>
                  <option value="">Select Faculty</option>
                  <option>Science & Technology</option>
                  <option>Management</option>
                  <option>Humanities & Social Sciences</option>
                  <option>Education</option>
                  <option>Law</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Year <span className="req">*</span></label>
                <select className="form-control" value={formData.year} onChange={(e) => updateField('year', e.target.value)}>
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                  <option value="5">5th Year</option>
                </select>
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Password <span className="req">*</span></label>
                <input type="password" className="form-control" value={formData.password} onChange={(e) => updateField('password', e.target.value)} placeholder="Min. 8 characters" />
                <span className="form-error" id="pw-err" />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password <span className="req">*</span></label>
                <input type="password" className="form-control" value={formData.cpw} onChange={(e) => updateField('cpw', e.target.value)} placeholder="Re-enter password" />
                <span className="form-error" id="cpw-err" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">College ID Card <span className="req">*</span></label>
              <label className="file-zone" htmlFor="id_card">
                <input type="file" id="id_card" accept="image/jpeg,image/png,application/pdf" onChange={onFileChange} />
                <div className="file-zone-text" id="fz-text">{fileName}</div>
                {previewUrl ? <img id="id-preview" src={previewUrl} alt="Preview" style={{ display: 'block', maxWidth: 160, margin: '12px auto 0', borderRadius: 8, border: '2px solid var(--g200)' }} /> : null}
              </label>
            </div>
            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
          <div className="auth-footer">Already have an account? <a href="/">Login here</a></div>
        </div>
      </div>
    </div>
  );
}
