'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  const [currentDim, setCurrentDim] = useState(0);
  const [email, setEmail] = useState('');
  const [orgName, setOrgName] = useState('');
  const [pastAssessments, setPastAssessments] = useState<any[]>([]);
  const [editingDims, setEditingDims] = useState<any>(JSON.parse(JSON.stringify(DIMS)));
  const [isEditMode, setIsEditMode] = useState(false);
  const orgNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  // Load custom measures for the organization on mount and when orgName changes
  useEffect(() => {
    if (orgName.trim()) {
      loadCustomMeasures();
    }
  }, [orgName]);

  const loadCustomMeasures = async () => {
    if (!orgName.trim()) return;
    
    try {
      const response = await fetch(`/api/measures/by-org?org_name=${encodeURIComponent(orgName.trim())}`);
      if (response.ok) {
        const result = await response.json();
        if (result.data?.dims_config) {
          setEditingDims(result.data.dims_config);
        }
      }
    } catch (error) {
      console.error('Error loading custom measures:', error);
    }
  };

  const saveCustomMeasures = async () => {
    const org = getOrgName().trim();
    if (!org) {
      alert('Please enter an organisation name');
      return;
    }

    try {
      const response = await fetch('/api/measures/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          org_name: org,
          dims_config: editingDims,
          created_by: getEmail() || 'anonymous',
        })
      });

      if (response.ok) {
        alert('✓ Scoring guidance updated successfully!');
        setIsEditMode(false);
      } else {
        alert('Failed to save changes. Check console for details.');
      }
    } catch (error) {
      console.error('Error saving measures:', error);
      alert('Error saving changes: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const getOrgName = () => orgName || orgNameRef.current?.value || 'Your Organisation';
  const getEmail = () => email || emailRef.current?.value || '';

  const isFormValid = () => {
    const emailVal = email.trim();
    const orgVal = orgName.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailVal && orgVal && emailRegex.test(emailVal);
  };

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

  const gotoDimension = (idx: number) => {
    setCurrentDim(idx);
    showScreen(`screen-dim-${idx}`);
  };

  const getReadinessLevel = (score: number): string => {
    if (score >= 4.5) return 'Leading';
    if (score >= 3.5) return 'Developing';
    if (score >= 2.5) return 'Emerging';
    return 'Not Ready';
  };

  const saveAssessment = async (path: string, dimension?: number) => {
    const email = getEmail().trim();
    const org = getOrgName().trim();
    
    if (!email || !org) {
      console.warn('Missing email or organisation name');
      return;
    }

    try {
      const response = await fetch('/api/assessments/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          orgName: org,
          path,
          quickAnswers: path === 'quick' ? quickAnswers : null,
          scores: path === 'detailed' ? scores : null,
          dimension,
        })
      });

      if (response.ok) {
        const { data } = await response.json();
        console.log('Assessment saved:', data.id);
      } else {
        console.error('Failed to save assessment');
      }
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const loadPastAssessments = async () => {
    const emailVal = getEmail().trim();
    if (!emailVal) return;
    
    try {
      const response = await fetch(`/api/assessments/by-email?email=${encodeURIComponent(emailVal)}`);
      if (response.ok) {
        const { data } = await response.json();
        setPastAssessments(data || []);
        showScreen('screen-history');
      }
    } catch (error) {
      console.error('Error loading assessments:', error);
    }
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
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
              />
            </div>
            <div className="org-name-input">
              <label htmlFor="email">Email Address</label>
              <input 
                ref={emailRef}
                type="email" 
                id="email" 
                placeholder="your.email@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {email && (
              <div style={{textAlign: 'center', marginBottom: '20px'}}>
                <button 
                  className="btn secondary" 
                  onClick={loadPastAssessments}
                  style={{fontSize: '14px'}}
                >
                  📋 View My Past Assessments
                </button>
              </div>
            )}
            <div className="path-cards">
              <div className="path-card green-accent">
                <h2>Quick Assessment</h2>
                <div className="badge">5 questions · 2 minutes</div>
                <p>Rapid AI adoption snapshot with feature roadmap and activation playbook.</p>
                <button 
                  className="btn success" 
                  disabled={!isFormValid()}
                  onClick={startQuickAssessment}
                  style={{opacity: isFormValid() ? 1 : 0.5, cursor: isFormValid() ? 'pointer' : 'not-allowed'}}
                >
                  Start Quick Assessment →
                </button>
              </div>
              <div className="path-card">
                <h2>Detailed Assessment</h2>
                <div className="badge">25 questions · 15 minutes</div>
                <p>Full readiness scorecard across 4 dimensions with priority recommendations.</p>
                <button 
                  className="btn" 
                  disabled={!isFormValid()}
                  onClick={startDetailedAssessment}
                  style={{opacity: isFormValid() ? 1 : 0.5, cursor: isFormValid() ? 'pointer' : 'not-allowed'}}
                >
                  Start Detailed Assessment →
                </button>
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

              // Save assessment to backend
              saveAssessment('quick');

              return (
                <>
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
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h2>Measures Reference — Assessment Questions</h2>
                <button 
                  className={`btn ${isEditMode ? 'danger' : 'secondary'}`}
                  onClick={() => setIsEditMode(!isEditMode)}
                  style={{fontSize: '13px', padding: '8px 12px'}}
                >
                  {isEditMode ? '✓ Done Editing' : '✎ Edit Scoring'}
                </button>
              </div>
              
              <table className="measures-table" style={{borderCollapse: 'collapse', width: '100%'}}>
                <thead>
                  <tr>
                    <th>Question ID</th>
                    <th>Title</th>
                    <th>Qualitative Approach</th>
                    {isEditMode && <th>Score Guidance</th>}
                  </tr>
                </thead>
                <tbody>
                  {(isEditMode ? editingDims : DIMS).map((dim: any) => (
                    <React.Fragment key={dim.id}>
                      <tr style={{background: dim.color, color: 'white'}}>
                        <td colSpan={isEditMode ? 4 : 3}><strong>{dim.code}: {dim.name}</strong></td>
                      </tr>
                      {dim.qs.map((q: any) => (
                        <tr key={q.id} className={`border-${dim.code.toLowerCase()}`} style={{borderBottom: '1px solid #ddd'}}>
                          <td style={{fontWeight: '700', padding: '12px', width: '80px'}}>{q.id}</td>
                          <td style={{fontWeight: '600', padding: '12px', minWidth: '200px'}}>{q.title}</td>
                          <td style={{padding: '12px', width: '300px'}}>{q.qual}</td>
                          {isEditMode && (
                            <td style={{padding: '12px', maxWidth: '400px', fontSize: '12px'}}>
                              {q.scoring ? (
                                <div style={{display: 'grid', gap: '4px', maxHeight: '200px', overflowY: 'auto'}}>
                                  {[1, 2, 3, 4, 5].map(score => (
                                    <input 
                                      key={score}
                                      type="text"
                                      value={q.scoring[score as keyof typeof q.scoring] || ''}
                                      onChange={(e) => {
                                        const newDims = JSON.parse(JSON.stringify(editingDims));
                                        const dimIndex = newDims.findIndex((d: any) => d.id === dim.id);
                                        const qIndex = newDims[dimIndex].qs.findIndex((question: any) => question.id === q.id);
                                        newDims[dimIndex].qs[qIndex].scoring[score] = e.target.value;
                                        setEditingDims(newDims);
                                      }}
                                      style={{fontSize: '11px', padding: '4px', border: '1px solid #ddd', borderRadius: '4px'}}
                                      placeholder={`Level ${score} guidance...`}
                                    />
                                  ))}
                                </div>
                              ) : (
                                <span style={{color: '#999'}}>No scoring guidance</span>
                              )}
                            </td>
                          )}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
              
              <div style={{marginTop: '20px'}}>
                {isEditMode && (
                  <button 
                    className="btn success"
                    onClick={saveCustomMeasures}
                    style={{marginRight: '10px'}}
                  >
                    💾 Save All Changes
                  </button>
                )}
                <button className="btn secondary" onClick={() => showScreen('screen-landing')}>← Back to Home</button>
              </div>
            </div>
          </div>
        )}

        {/* DETAILED ASSESSMENT DIMENSION SCREENS */}
        {currentScreen.startsWith('screen-dim-') && currentScreen !== 'screen-results' && (
          <div className="screen active">
            {(() => {
              const dim = DIMS[currentDim];
              if (!dim || !dim.qs || dim.qs.length === 0) return <div>No questions for this dimension</div>;
              
              const progress = ((currentDim + 1) / DIMS.length) * 100;
              const allAnswered = dim.qs.every(q => scores[q.id]);
              
              return (
                <>
                  <div className="progress-bar"><div className="fill" style={{width: `${progress}%`}}></div></div>
                  <h2 style={{textAlign: 'center', marginBottom: '10px'}}>{dim.code}: {dim.name}</h2>
                  <p style={{textAlign: 'center', color: '#666', marginBottom: '30px'}}>Dimension {currentDim + 1} of {DIMS.length} — {dim.qs.length} questions</p>
                  
                  <div style={{maxWidth: '900px', margin: '0 auto'}}>
                    {dim.qs.map((q, idx) => (
                      <div key={q.id} style={{marginBottom: '40px', paddingBottom: '30px', borderBottom: idx === dim.qs.length - 1 ? 'none' : '1px solid #eee'}}>
                        <div style={{marginBottom: '20px'}}>
                          <div style={{fontSize: '14px', color: '#999', marginBottom: '5px'}}>Question {idx + 1} of {dim.qs.length}</div>
                          <h3 style={{marginBottom: '8px', fontSize: '18px'}}>{q.title}</h3>
                          <p style={{color: '#666', fontSize: '14px'}}>{q.qual}</p>
                        </div>
                        
                        <div style={{display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center'}}>
                          {[
                            { val: 1, label: 'Emerging', desc: 'Early stage' },
                            { val: 2, label: 'Emerging', desc: 'Established' },
                            { val: 3, label: 'Developing', desc: 'Good progress' },
                            { val: 4, label: 'Advanced', desc: 'Strong execution' },
                            { val: 5, label: 'Leading', desc: 'Best practice' }
                          ].map(item => {
                            const isSelected = scores[q.id] === item.val;
                            const colors = ['#E74C3C', '#F39C12', '#F1C40F', '#27AE60', '#16A085'];
                            const selectedColor = colors[item.val - 1];
                            return (
                              <button
                                key={item.val}
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '80px',
                                  padding: '12px 8px',
                                  border: isSelected ? `3px solid ${selectedColor}` : '2px solid #E8E8E8',
                                  background: isSelected ? `${selectedColor}15` : '#FAFAFA',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  boxShadow: isSelected ? `0 4px 12px ${selectedColor}40` : 'none',
                                  fontWeight: isSelected ? '700' : '600',
                                  fontSize: '12px',
                                  color: isSelected ? selectedColor : '#555'
                                }}
                                onMouseEnter={(e) => {
                                  if (!isSelected) {
                                    e.currentTarget.style.borderColor = selectedColor;
                                    e.currentTarget.style.background = `${selectedColor}08`;
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!isSelected) {
                                    e.currentTarget.style.borderColor = '#E8E8E8';
                                    e.currentTarget.style.background = '#FAFAFA';
                                  }
                                }}
                                onClick={() => {
                                  setScores(prev => ({ ...prev, [q.id]: item.val }));
                                }}
                              >
                                <div style={{fontSize: '18px', fontWeight: '800', marginBottom: '2px', color: selectedColor}}>{item.val}</div>
                                <div style={{fontSize: '10px'}}>{item.label}</div>
                              </button>
                            );
                          })}
                        </div>
                        
                        {/* Scoring Guidance - Show only selected answer */}
                        {q.scoring && scores[q.id] > 0 && (
                          <div style={{marginTop: '16px', padding: '12px', background: '#f0f7ff', borderRadius: '6px', borderLeft: `3px solid ${['#E74C3C', '#F39C12', '#F1C40F', '#27AE60', '#16A085'][scores[q.id] - 1]}`}}>
                            <div style={{fontSize: '11px', color: '#666'}}>
                              <strong>You selected Level {scores[q.id]}:</strong> {q.scoring[scores[q.id] as keyof typeof q.scoring]}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="nav-buttons">
                    <button className="btn secondary" onClick={() => currentDim > 0 ? gotoDimension(currentDim - 1) : showScreen('screen-landing')}>
                      ← Back
                    </button>
                    <button 
                      className="btn" 
                      disabled={!allAnswered}
                      onClick={() => currentDim < DIMS.length - 1 ? gotoDimension(currentDim + 1) : showScreen('screen-results')}
                    >
                      {currentDim === DIMS.length - 1 ? 'View Results →' : 'Next Dimension →'}
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* DETAILED RESULTS SCREEN */}
        {currentScreen === 'screen-results' && (
          <div className="screen active">
            {(() => {
              // Save detailed assessment to backend
              saveAssessment('detailed', currentDim);
              
              return (
                <div style={{maxWidth: '1000px', margin: '0 auto', padding: '0 20px'}}>
                  <div className="results-hero">
                    <h1>Detailed Assessment — Readiness Scorecard</h1>
                    <div className="meta">{getOrgName()} — Comprehensive 4-Dimension Analysis</div>
                  </div>
                  
                  <h2 style={{marginTop: '40px'}}>Dimension Scores</h2>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px'}}>
                    {DIMS.map(dim => {
                      const dimScores = dim.qs.map(q => scores[q.id] || 0).filter(s => s > 0);
                      const avgScore = dimScores.length > 0 ? (dimScores.reduce((a, b) => a + b, 0) / dimScores.length).toFixed(1) : '—';
                      return (
                        <div key={dim.id} style={{border: `2px solid ${dim.color}`, borderRadius: '8px', padding: '20px'}}>
                          <div style={{fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '1px'}}>{dim.code}</div>
                          <div style={{fontSize: '28px', fontWeight: 'bold', color: dim.color, margin: '10px 0'}}>{avgScore}</div>
                          <div style={{fontSize: '14px', fontWeight: '600'}}>{dim.name}</div>
                          <div style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>{getReadinessLevel(parseFloat(avgScore as string))}</div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <button className="btn secondary" onClick={() => showScreen('screen-landing')}>← Back to Home</button>
                </div>
              );
            })()}
          </div>
        )}

        {/* HISTORY SCREEN */}
        {currentScreen === 'screen-history' && (
          <div className="screen active">
            <div style={{maxWidth: '900px', margin: '0 auto', padding: '0 20px'}}>
              <h2>Your Past Assessments</h2>
              <p style={{color: '#666', marginBottom: '20px'}}>Showing assessments for: <strong>{getEmail()}</strong></p>
              
              {pastAssessments && pastAssessments.length > 0 ? (
                <div style={{display: 'grid', gap: '15px', marginBottom: '30px'}}>
                  {pastAssessments.map((assessment: any) => (
                    <div 
                      key={assessment.id}
                      style={{
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        padding: '16px',
                        background: '#f9f9f9',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{fontWeight: '600', marginBottom: '5px'}}>{assessment.org_name}</div>
                        <div style={{fontSize: '13px', color: '#666'}}>
                          {assessment.path === 'quick' ? '⚡ Quick Assessment' : '📊 Detailed Assessment'}
                          {' '} · {new Date(assessment.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div style={{fontSize: '12px', color: '#999'}}>ID: {assessment.id.substring(0, 8)}...</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{textAlign: 'center', padding: '40px', color: '#999'}}>
                  <p>No assessments found for this email.</p>
                  <p>Complete an assessment to see it here.</p>
                </div>
              )}
              
              <button className="btn secondary" onClick={() => showScreen('screen-landing')}>← Back to Home</button>
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
                <li>screen-dim-0 to screen-dim-3 — Detailed assessment (1 dimension per screen) ✓</li>
                <li>screen-results — Detailed results scorecard ✓</li>
                <li>screen-measures — Reference table of assessment questions ✓</li>
                <li>screen-devnotes — Developer documentation ✓</li>
              </ul>
              <h3>Next Steps</h3>
              <p>To complete implementation:</p>
              <ul>
                <li>Populate all 25 DIMS questions across 4 dimensions (currently only TF1 complete)</li>
                <li>Expand WD_FEATURES array with all 30+ features</li>
                <li>Implement full heatmap and advanced analytics</li>
              </ul>
              <button className="btn secondary" style={{marginTop: '20px'}} onClick={() => showScreen('screen-landing')}>← Back to Home</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
