import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="page" style={{ display: 'grid', placeItems: 'center', minHeight: '70vh' }}>
      <div className="card" style={{ maxWidth: 560, textAlign: 'center', padding: 40 }}>
        <h1 style={{ marginBottom: 16 }}>Page not found</h1>
        <p style={{ color: 'var(--g600)', marginBottom: 22 }}>The requested page does not exist or has been moved.</p>
        <Link href="/" className="btn btn-primary btn-lg">Return to home</Link>
      </div>
    </div>
  );
}
