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
  const [currentQuickQ, setCurrentQuickQ] = useState(0);
  const orgNameRef = useRef<HTMLInputElement>(null);

  const getOrgName = () => orgNameRef.current?.value || 'Your Organisation';

  const showScreen = (id: string) => {
    setCurrentScreen(id);
    window.scrollTo(0, 0);
  };

  const startQuickAssessment = () => {
    setQuickAnswers({});
    setCurrentQuickQ(0);
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

  const gotoQuickQ = (idx: number) => {
    setCurrentQuickQ(idx);
    showScreen(`screen-quick-${idx}`);
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
        {/* LANDING SCREEN */}
        {currentScreen === 'screen-landing' && (
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
        )}

        {/* QUICK ASSESSMENT SCREENS */}
        {currentScreen.startsWith('screen-quick-') && currentScreen !== 'screen-quick-results' && (
          <div className="screen active">
            {(() => {
              const q = QUICK_QS[currentQuickQ];
              const isAnswered = !!quickAnswers[q.id];
              const progress = ((currentQuickQ + 1) / QUICK_QS.length) * 100;

              return (
                <>
                  <div className="progress-bar"><div className="fill" style={{width: `${progress}%`}}></div></div>
                  <h2 style={{textAlign: 'center', marginBottom: '30px'}}>Quick Assessment — Question {currentQuickQ + 1} of {QUICK_QS.length}</h2>
                  
                  <div className="question-card">
                    <h3>{q.title}</h3>
                    <div className="option-grid">
                      {q.options.map((opt) => (
                        <div 
                          key={opt.value}
                          className={`option-btn ${quickAnswers[q.id] === opt.value ? 'selected' : ''}`}
                          onClick={() => setQuickAnswers(prev => ({ ...prev, [q.id]: opt.value }))}
                        >
                          <strong>{opt.label}</strong><br />
                          <span style={{fontSize: '12px', color: '#666'}}>{opt.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="nav-buttons">
                    <button className="btn secondary" onClick={() => currentQuickQ > 0 ? gotoQuickQ(currentQuickQ - 1) : showScreen('screen-landing')}>
                      {currentQuickQ === 0 ? 'Back' : 'Back'}
                    </button>
                    <button 
                      className="btn" 
                      disabled={!isAnswered}
                      onClick={() => currentQuickQ < QUICK_QS.length - 1 ? gotoQuickQ(currentQuickQ + 1) : showScreen('screen-quick-results')}
                    >
                      {currentQuickQ === QUICK_QS.length - 1 ? 'View Results →' : 'Next →'}
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* QUICK RESULTS SCREEN */}
        {currentScreen === 'screen-quick-results' && (
          <div className="screen active">
            {(() => {
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
              const next_lane = features.filter(f => f.lane === 'next');
              const watch = features.filter(f => f.lane === 'watch');

              const kpis = KPI_MAP[pain] || KPI_MAP.hr_admin;
              const playbook = PLAYBOOK_MAP[pain] || PLAYBOOK_MAP.hr_admin;
              const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

              return (
                <>
                  <div className="print-bar">
                    <button className="btn secondary" onClick={startQuickAssessment}>Edit Answers</button>
                    <button className="btn" onClick={() => window.print()}>Print / Save as PDF</button>
                    <button className="btn success" onClick={startDetailedAssessment}>Run Detailed Assessment →</button>
                  </div>

                  <div className="results-hero">
                    <h1>Quick Assessment — AI Adoption Roadmap</h1>
                    <div className="meta">{orgNameRef.current?.value || 'Your Organisation'} — {today}</div>
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
                        {next_lane.map((f, i) => (
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
                </>
              );
            })()}
          </div>
        )}

        {/* MEASURES SCREEN */}
        {currentScreen === 'screen-measures' && (
          <div className="screen active">
            <div style={{maxWidth: '1200px', margin: '0 auto 40px', padding: '0 20px'}}>
              <h2 style={{marginBottom: '20px'}}>Measures Reference — Assessment Questions</h2>
              <table className="measures-table">
                <thead>
                  <tr>
                    <th>Question ID</th>
                    <th>Title</th>
                    <th>Qualitative Approach</th>
                  </tr>
                </thead>
                <tbody>
                  {DIMS.map(dim => (
                    <React.Fragment key={dim.id}>
                      <tr style={{background: dim.color, color: 'white'}}>
                        <td colSpan={3}><strong>{dim.code}: {dim.name}</strong></td>
                      </tr>
                      {dim.qs.map(q => (
                        <tr key={q.id} className={`border-${dim.code.toLowerCase()}`}>
                          <td style={{fontWeight: '700'}}>{q.id}</td>
                          <td style={{fontWeight: '600'}}>{q.title}</td>
                          <td>{q.qual}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
              <button className="btn secondary" style={{marginTop: '20px'}} onClick={() => showScreen('screen-landing')}>← Back to Home</button>
            </div>
          </div>
        )}

        {/* DEV NOTES SCREEN */}
        {currentScreen === 'screen-devnotes' && (
          <div className="screen active">
            <div className="devnotes">
              <h2>Developer Documentation</h2>
              <h3>Product Overview</h3>
              <p>The <strong>Workday AI Adoption Readiness Assessment</strong> is a Next.js React application that guides organisations through evidence-based diagnostics of their Workday AI readiness.</p>
              <h3>Architecture</h3>
              <p><strong>Screens:</strong></p>
              <ul>
                <li>screen-landing — Path selection & org name input ✓</li>
                <li>screen-quick-0 to screen-quick-4 — Quick assessment (1 question per screen) ✓</li>
                <li>screen-quick-results — Quick results with roadmap, KPIs, playbook ✓</li>
                <li>screen-measures — Reference table of assessment questions ✓</li>
                <li>screen-devnotes — Developer documentation ✓</li>
              </ul>
              <h3>Next Steps</h3>
              <p>To complete implementation:</p>
              <ul>
                <li>Add detailed assessment dimension screens (screen-dim-0 to screen-dim-3)</li>
                <li>Add detailed results screen (screen-results)</li>
                <li>Implement full scoring and analysis</li>
              </ul>
              <button className="btn secondary" style={{marginTop: '20px'}} onClick={() => showScreen('screen-landing')}>← Back to Home</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
