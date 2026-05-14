'use client';

export default function AdminStudentsPage() {
  return (
    <div>
      <div className="card">
        <div className="card-hd">
          <div className="card-title">Students</div>
        </div>
        <div style={{ padding: '24px' }}>
          <div className="empty">
            <div className="empty-title">Student verification dashboard</div>
            <div className="empty-text">Review pending registrations and approve or reject student accounts.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
