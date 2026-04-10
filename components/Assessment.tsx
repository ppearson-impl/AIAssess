'use client';

import React, { useState, useRef } from 'react';
import { QUICK_QS, PAIN_FEATURES, KPI_MAP, PLAYBOOK_MAP, DIMS, WD_FEATURES, MODULE_LABELS, STAGE_LABELS, PAIN_LABELS, AGENT_LABELS, SIZE_LABELS } from '@/data/assessmentData';

interface QuickAnswers {
  [key: string]: string;
}

interface Scores {
  [key: string]: number;
}

export default function Assessment() {
  const [currentScreen, setCurrentScreen] = useState('screen-landing');
  const [quickAnswers, setQuickAnswers] = useState<QuickAnswers>({});
  const [scores, setScores] = useState<Scores>({});
  const orgNameRef = useRef<HTMLInputElement>(null);

  const getOrgName = () => orgNameRef.current?.value || 'Your Organisation';

  const showScreen = (id: string) => {
    setCurrentScreen(id);
    window.scrollTo(0, 0);
  };

  const startQuickAssessment = () => {
    setQuickAnswers({});
    showScreen('screen-quick-0');
  };

  const startDetailedAssessment = () => {
    const newScores: Record<string, number> = {};
    for (const dim of DIMS) {
      for (const q of dim.qs) {
        newScores[q.id] = 0;
      }
    }
    setScores(newScores);
    showScreen('screen-dim-0');
  };

  const selectQuickOption = (qId: string, value: string) => {
    setQuickAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const setScore = (qId: string, value: number) => {
    setScores(prev => ({ ...prev, [qId]: value }));
  };

  const toggleExpandable = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    target.classList.toggle('expanded');
    const content = target.nextElementSibling as HTMLElement;
    if (content) {
      content.classList.toggle('show');
      target.textContent = target.classList.contains('expanded')
        ? 'v ' + target.textContent.substring(2)
        : '▸ ' + target.textContent.substring(2);
    }
  };

  const buildQuickResults = () => {
    const pain = (quickAnswers['q-pain'] || 'hr_admin') as keyof typeof PAIN_FEATURES;
    const stage = (quickAnswers['q-stage'] || 'not-started') as keyof typeof STAGE_LABELS;
    const agentReady = (quickAnswers['q-agents'] || 'not-yet') as keyof typeof AGENT_LABELS;
    const modules = (quickAnswers['q-modules'] || 'hcm-only') as keyof typeof MODULE_LABELS;
    const orgType = (quickAnswers['q-orgtype'] || 'mid-market') as keyof typeof SIZE_LABELS;

    let features = [...(PAIN_FEATURES[pain] || PAIN_FEATURES.hr_admin)];
    if (agentReady === 'not-yet') features = features.filter(f => f.skuType !== 'agent');
    if (agentReady === 'one-agent') {
      const withAgent = features.filter(f => f.skuType === 'agent');
      features = features.filter(f => f.skuType !== 'agent');
      if (withAgent.length > 0) features.push(withAgent[0]);
    }

    const now = features.filter(f => f.lane === 'now');
    const next = features.filter(f => f.lane === 'next');
    const watch = features.filter(f => f.lane === 'watch');

    const kpis = KPI_MAP[pain] || KPI_MAP.hr_admin;
    const playbook = PLAYBOOK_MAP[pain] || PLAYBOOK_MAP.hr_admin;

    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
      <div>
        <div className="print-bar">
          <button className="btn secondary" onClick={startQuickAssessment}>Edit Answers</button>
          <button className="btn" onClick={() => window.print()}>Print / Save as PDF</button>
          <button className="btn success" onClick={startDetailedAssessment}>Run Detailed Assessment →</button>
        </div>

        <div className="results-hero">
          <h1>Quick Assessment — AI Adoption Roadmap</h1>
          <div className="meta">{getOrgName()} — {today}</div>
        </div>

        <div className="profile-strip">
          <div className="profile-pill"><strong>Modules:</strong> {MODULE_LABELS[modules]}</div>
          <div className="profile-pill"><strong>Stage:</strong> {STAGE_LABELS[stage]}</div>
          <div className="profile-pill"><strong>Pain Point:</strong> {PAIN_LABELS[pain]}</div>
          <div className="profile-pill"><strong>Agent Readiness:</strong> {AGENT_LABELS[agentReady]}</div>
          <div className="profile-pill"><strong>Org Type:</strong> {SIZE_LABELS[orgType]}</div>
        </div>

        <h2 className="section-title">Feature Roadmap</h2>
        <div className="lanes-container">
          <div className="lane">
            <div className="lane-header now">CHECK NOW — Quick Wins</div>
            <div className="lane-body">
              {now.map((f, i) => (
                <div key={i} className="feature-card">
                  <div className="title">{f.name}</div>
                  <div className="desc">{f.desc}</div>
                  <div className="feature-badges">
                    <span className="badge-small area">{f.area}</span>
                    <span className="badge-small sku">{f.sku}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lane">
            <div className="lane-header next">NEXT — Plan Ahead</div>
            <div className="lane-body">
              {next.map((f, i) => (
                <div key={i} className="feature-card">
                  <div className="title">{f.name}</div>
                  <div className="desc">{f.desc}</div>
                  <div className="feature-badges">
                    <span className="badge-small area">{f.area}</span>
                    <span className="badge-small sku">{f.sku}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lane">
            <div className="lane-header watch">WATCH — On Radar</div>
            <div className="lane-body">
              {watch.map((f, i) => (
                <div key={i} className="feature-card">
                  <div className="title">{f.name}</div>
                  <div className="desc">{f.desc}</div>
                  <div className="feature-badges">
                    <span className="badge-small area">{f.area}</span>
                    <span className="badge-small sku">{f.sku}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <h2 className="section-title">30-Day Activation Playbook</h2>
        <div className="playbook-steps">
          {playbook.map((step, i) => (
            <div key={i} className="playbook-card">
              <div className="week">Week {i + 1}</div>
              <p>{step}</p>
            </div>
          ))}
        </div>

        <h2 className="section-title">KPI Targets</h2>
        <div className="kpi-grid">
          {kpis.map((kpi, i) => (
            <div key={i} className="kpi-tile">
              <div className="kpi-value">{kpi.value}</div>
              <div className="kpi-label">{kpi.label}</div>
              <div className="kpi-note">{kpi.note}</div>
            </div>
          ))}
        </div>

        <div className="cta-footer">
          <p><strong>Want a deeper readiness assessment?</strong></p>
          <button className="btn success" onClick={startDetailedAssessment}>Run the Detailed Assessment (25 questions, 15 min) →</button>
        </div>
      </div>
    );
  };

  const buildResults = () => {
    const dimScores: Record<string, number> = {};
    for (const dim of DIMS) {
      const dimQScores = dim.qs.map(q => scores[q.id] || 0);
      dimScores[dim.id] = dimQScores.reduce((a, b) => a + b, 0) / dim.qs.length;
    }

    const overall = (dimScores.tf + dimScores.ds + dimScores.aa + dimScores.gw) / 4;
    const level = getReadinessLevel(overall);
    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    const lowestDim = Object.keys(dimScores).reduce((a, b) => 
      dimScores[a] < dimScores[b] ? a : b
    );

    const allQs = [];
    for (const dim of DIMS) {
      for (const q of dim.qs) {
        allQs.push({ ...q, dimId: dim.id, dimCode: dim.code, score: scores[q.id] || 0 });
      }
    }
    const topPriorities = allQs.sort((a, b) => a.score - b.score).slice(0, 5);

    let recommendedFeatures = [];
    if (lowestDim === 'tf') {
      recommendedFeatures = WD_FEATURES.filter(f => f.isAgent).slice(0, 8);
    } else if (lowestDim === 'ds') {
      recommendedFeatures = WD_FEATURES.filter(f => f.product.includes('Talent') || f.product.includes('Data')).slice(0, 8);
    } else if (lowestDim === 'aa') {
      recommendedFeatures = WD_FEATURES.filter(f => f.gaStatus.includes('GA') && f.skuType === 'included').slice(0, 8);
    } else {
      recommendedFeatures = WD_FEATURES.filter(f => f.gaStatus.includes('GA') && f.skuType === 'included').slice(0, 8);
    }

    return (
      <div>
        <div className="print-bar">
          <button className="btn secondary" onClick={() => showScreen('screen-dim-0')}>Edit Answers</button>
          <button className="btn secondary" onClick={() => showScreen('screen-measures')}>Measures Reference</button>
          <button className="btn" onClick={() => window.print()}>Print / Save as PDF</button>
        </div>

        <div className="results-hero">
          <h1>Full AI Readiness Scorecard</h1>
          <div className="meta">{getOrgName()} — {today}</div>
        </div>

        <h2 className="section-title" style={{textAlign: 'center'}}>Overall Readiness</h2>
        <div style={{textAlign: 'center', marginBottom: '40px'}}>
          <div style={{fontSize: '72px', fontWeight: '700', color: '#61A83F', marginBottom: '8px'}}>
            {overall.toFixed(2)}
          </div>
          <span className="level-badge ready">{level.toUpperCase()}</span>
        </div>

        <h2 className="section-title">Dimension Scores</h2>
        <div className="dimensions-grid">
          {DIMS.map(dim => {
            const score = dimScores[dim.id];
            const barWidth = (score / 5) * 100;
            const dimLevel = getReadinessLevel(score);
            return (
              <div key={dim.id} className={`dim-card ${dim.id}`}>
                <div className="dim-card-header">
                  <div><h3>{dim.code}: {dim.name}</h3></div>
                  <div className="dim-score">{score.toFixed(2)}</div>
                </div>
                <div className="dim-bar"><div className="dim-bar-fill" style={{width: `${barWidth}%`}}></div></div>
                <div className="dim-label">{dimLevel}</div>
              </div>
            );
          })}
        </div>

        <h2 className="section-title">Top 5 Priority Areas</h2>
        <div style={{maxWidth: '1200px', margin: '0 auto 40px', padding: '0 20px'}}>
          {topPriorities.map((q: any, i) => (
            <div key={i} style={{background: 'white', padding: '16px', marginBottom: '12px', borderRadius: '6px', borderLeft: `4px solid ${DIMS.find(d => d.id === q.dimId)?.color}`}}>
              <strong>{q.dimCode}: {q.title}</strong> (Score: {q.score}/5)<br />
              <span style={{fontSize: '13px', color: '#666'}}>{q.text}</span>
            </div>
          ))}
        </div>

        <h2 className="section-title">Recommended AI Features</h2>
        <div style={{maxWidth: '1200px', margin: '0 auto 40px', padding: '0 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px'}}>
          {recommendedFeatures.map((f, i) => {
            const impactBg = f.impact === 'High' ? 'background: #d4f4dd;' : 'background: #fff4e6;';
            return (
              <div key={i} style={{background: 'white', borderRadius: '6px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'}}>
                <strong>{f.title}</strong><br />
                <span style={{fontSize: '12px', color: '#666', display: 'block', margin: '6px 0'}}>{f.product}</span>
                <div style={{fontSize: '11px', display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap'}}>
                  <span style={{background: 'var(--light-bg)', padding: '2px 6px', borderRadius: '2px'}}>{f.gaStatus}</span>
                  <span style={{...({background: 'var(--light-bg)', padding: '2px 6px', borderRadius: '2px'} as React.CSSProperties)}}>{f.impact} Impact</span>
                </div>
                <p style={{fontSize: '12px', lineHeight: '1.4', color: '#666'}}>{f.description}</p>
              </div>
            );
          })}
        </div>

        <h2 className="section-title">Question Heatmap</h2>
        <div className="heatmap">
          <table className="heatmap-table">
            <thead>
              <tr>
                <th>Question</th>
                <th style={{width: '100px'}}>Score</th>
              </tr>
            </thead>
            <tbody>
              {DIMS.map(dim => (
                <React.Fragment key={dim.id}>
                  <tr style={{background: dim.color, color: 'white'}}>
                    <td colSpan={2}><strong>{dim.code}: {dim.name}</strong></td>
                  </tr>
                  {dim.qs.map(q => {
                    const score = scores[q.id] || 0;
                    const heatClass = score <= 2 ? 'heat-1' : score <= 3 ? 'heat-3' : 'heat-5';
                    return (
                      <tr key={q.id}>
                        <td>{q.id}: {q.title}</td>
                        <td className={`heatmap-cell ${heatClass}`} style={{fontWeight: '700'}}>{score}</td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const getReadinessLevel = (score: number): string => {
    if (score >= 4.5) return 'Leading';
    if (score >= 3.5) return 'Developing';
    if (score >= 2.5) return 'Emerging';
    return 'Not Ready';
  };

  const renderLanding = () => (
    <div className="screen active">
      <div className="hero-gradient">
        <h1>Workday AI Adoption Readiness Assessment</h1>
        <p>Evidence-based diagnostics for your AI journey</p>
      </div>
      <div className="org-name-input">
        <label htmlFor="org-name">Organisation Name</label>
        <input 
          ref={orgNameRef}
          type="text" 
          id="org-name" 
          placeholder="e.g. Acme Corp, Global Finance Ltd"
        />
      </div>
      <div className="path-cards">
        <div className="path-card green-accent">
          <h2>Quick Assessment</h2>
          <div className="badge">5 questions · 2 minutes</div>
          <p>Rapid AI adoption snapshot with feature roadmap and activation playbook.</p>
          <button className="btn success" onClick={startQuickAssessment}>Start Quick Assessment →</button>
        </div>
        <div className="path-card">
          <h2>Detailed Assessment</h2>
          <div className="badge">25 questions · 15 minutes</div>
          <p>Full readiness scorecard across 4 dimensions with priority recommendations.</p>
          <button className="btn" onClick={startDetailedAssessment}>Start Detailed Assessment →</button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="header">
        <div className="header-left">📊 Workday AI Readiness Assessment</div>
        <div className="header-nav">
          <button className="nav-btn" onClick={() => showScreen('screen-measures')}>📊 Measures</button>
          <button className="nav-btn" onClick={() => showScreen('screen-devnotes')}>?</button>
        </div>
      </div>

      <div className="container">
        {currentScreen === 'screen-landing' && renderLanding()}
        {/* Add other screens here based on currentScreen */}
      </div>
    </>
  );
}
