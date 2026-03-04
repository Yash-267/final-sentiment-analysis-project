import React from 'react';
import { useData } from '../context/DataContext';

const Summary = () => {
    const { data } = useData();

    if (!data) return <div className="container" style={{ padding: '2rem' }}>Please upload a file to view summaries.</div>;

    const { summaries, stats } = data;

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem' }}>

            {/* Executive Stats */}
            <div className="grid-3" style={{ marginBottom: '3rem' }}>
                <StatCard title="Total Comments" value={stats.total_comments} color="var(--color-primary)" />
                <StatCard title="Top Industry" value={Object.keys(stats.top_industries)[0] || 'N/A'} color="var(--color-secondary)" />
                <StatCard title="Top Role" value={Object.keys(stats.top_roles)[0] || 'N/A'} color="var(--color-accent)" />
            </div>

            <h2 style={{ marginBottom: '2rem' }}>Summary</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {summaries.map((s, idx) => (
                    <div key={idx} className="card" style={{ borderLeft: `4px solid ${getBorderColor(s.category)}` }}>
                        <h3 style={{ marginTop: 0, color: getBorderColor(s.category) }}>{s.category}</h3>
                        <p style={{ lineHeight: '1.7', fontSize: '1.05rem' }}>{s.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const StatCard = ({ title, value, color }) => (
    <div className="card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>{title}</div>
        <div style={{ fontSize: '2rem', fontWeight: 700, color: color }}>{value}</div>
    </div>
);

const getBorderColor = (category) => {
    if (category.includes('Positive')) return 'var(--sentiment-positive)';
    if (category.includes('Supportive')) return 'var(--sentiment-supportive)';
    if (category.includes('Critical')) return 'var(--sentiment-critical)';
    if (category.includes('Concerned')) return 'var(--sentiment-concerned)';
    if (category.includes('Negative')) return 'var(--sentiment-negative)';
    return 'gray';
};

export default Summary;
