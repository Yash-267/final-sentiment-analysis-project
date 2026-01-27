import React from 'react';
import { useData } from '../context/DataContext';
import {
    PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { Download, FileDown } from 'lucide-react';

const Visuals = () => {
    const { data } = useData();

    if (!data) return <div className="container" style={{ padding: '2rem' }}>Please upload a file to view visuals.</div>;

    const { stats, comments } = data;

    // Prepare Pie Data
    const pieData = Object.entries(stats.category_counts).map(([name, value]) => ({ name, value }));
    const COLORS = {
        'Positive - Transformative support': '#10b981',
        'Supportive - Broadly supportive': '#3b82f6',
        'Critical/Suggestive - Constructive criticism': '#f59e0b',
        'Concerned - Specific objections': '#f97316',
        'Negative - Urgent opposition': '#ef4444'
    };

    // Prepare Bar Data (Top Industries)
    const barData = Object.entries(stats.top_industries).map(([name, value]) => ({ name, value }));

    // Prepare Word Cloud Data (Simple frequency from text)
    // In a real app, backend sends this. Here we compute or use dummy/simple logic if backend didn't send keywords.
    // Ideally backend sends keywords. Let's compute a simple one client side or assume backend *could* have sent it.
    // For now, let's extract words client side very naively or use a placeholder if large data.
    // Let's take a sample of text.
    const allText = comments.map(c => c.text).join(' ');
    const words = allText.split(/\s+/).reduce((acc, word) => {
        word = word.toLowerCase().replace(/[^a-z]/g, '');
        if (word.length > 4) acc[word] = (acc[word] || 0) + 1;
        return acc;
    }, {});
    const wordPayload = Object.entries(words)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 50)
        .map(([text, value]) => ({ text, value }));


    const handleDownload = () => {
        window.print();
    };

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0 }}>Visual Insights</h2>
                <button className="btn btn-secondary no-print" onClick={handleDownload}>
                    <Download size={18} /> Download PDF Report
                </button>
            </div>

            <div className="grid-2">
                {/* Sentiment Distribution */}
                <div className="card">
                    <h3 style={{ marginBottom: '1rem' }}>Sentiment Distribution</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#8884d8'} />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                                <Legend layout="vertical" align="right" verticalAlign="middle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Industries */}
                <div className="card">
                    <h3 style={{ marginBottom: '1rem' }}>Top Participating Industries</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} layout="vertical" margin={{ left: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="name" width={120} style={{ fontSize: '0.75rem' }} />
                                <RechartsTooltip />
                                <Bar dataKey="value" fill="var(--color-primary)" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Word Cloud Replacement - Tag Cloud */}
                <div className="card" style={{ gridColumn: '1 / -1' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Key Discussion Themes</h3>
                    <div style={{
                        height: '300px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem',
                        overflowY: 'auto'
                    }}>
                        {wordPayload.length === 0 ? (
                            <div style={{ color: '#94a3b8' }}>No themes found</div>
                        ) : (
                            wordPayload.map((w, i) => {
                                // Simple font size scaling between 12px and 36px
                                const maxVal = wordPayload[0].value;
                                const minVal = wordPayload[wordPayload.length - 1].value;
                                const size = 12 + ((w.value - minVal) / (maxVal - minVal || 1)) * 24;

                                return (
                                    <span
                                        key={i}
                                        className="tag-item"
                                        data-count={`${w.value} mentions`}
                                        style={{
                                            fontSize: `${size}px`,
                                            color: i % 2 === 0 ? 'var(--color-secondary)' : 'var(--color-primary)',
                                            background: '#f1f5f9',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '999px',
                                            fontWeight: 500
                                        }}
                                    >
                                        {w.text}
                                    </span>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Visuals;
