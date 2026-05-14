'use client';

export default function StudentResultsPage() {
  return (
    <div>
      <div className="card">
        <div className="card-hd">
          <div className="card-title">Results</div>
        </div>
        <div style={{ padding: '24px' }}>
          <div className="empty">
            <div className="empty-title">Results are being loaded</div>
            <div className="empty-text">Election results will appear here once published by the Election Head.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
