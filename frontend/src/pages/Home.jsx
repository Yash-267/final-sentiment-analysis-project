import React from 'react';
import { BarChart3, MessageSquare, BrainCircuit } from 'lucide-react';

const Home = () => {
    return (
        <div className="container animate-fade-in" style={{ padding: '4rem 2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                    Advanced Stakeholder Feedback Analysis
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', maxWidth: '800px', margin: '0 auto' }}>
                    Leveraging Transformer-based AI to categorize, summarize, and visualize consultation feedback for informed policy decision-making.
                </p>
            </div>

            <div className="grid-3">
                <FeatureCard
                    icon={<MessageSquare size={32} color="var(--color-secondary)" />}
                    title="Sentiment Classification"
                    desc="Automatically classifies stakeholder comments into 3 distinct categories ranging from Transformative Support to Urgent Opposition."
                />
                <FeatureCard
                    icon={<BrainCircuit size={32} color="var(--color-accent)" />}
                    title="Summarization"
                    desc="Generates abstractive summaries for each sentiment category to highlight core themes and concerns instantly."
                />
                <FeatureCard
                    icon={<BarChart3 size={32} color="var(--sentiment-positive)" />}
                    title="Visual Analytics"
                    desc="Interactive charts and word clouds provide a high-level overview of industry engagement and dominant topics."
                />
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
        <div style={{ background: '#f8fafc', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
            {icon}
        </div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{title}</h3>
        <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>{desc}</p>
    </div>
);

export default Home;
