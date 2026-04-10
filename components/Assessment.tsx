'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  AGENT_LABELS,
  DIMS,
  KPI_MAP,
  MODULE_LABELS,
  PAIN_FEATURES,
  PAIN_LABELS,
  PLAYBOOK_MAP,
  QUICK_QS,
  SIZE_LABELS,
  STAGE_LABELS,
} from '@/data/assessmentData';

interface QuickAnswers {
  [key: string]: string;
}

interface Scores {
  [key: string]: number;
}

interface SaveResult {
  assessmentId: string | null;
  status: 'idle' | 'saving' | 'saved' | 'error';
  message: string;
}

interface RecommendationContent {
  summary: string;
  actions: string[];
}

const DIMENSION_NEXT_STEPS: Record<
  string,
  { low: RecommendationContent; mid: RecommendationContent; high: RecommendationContent }
> = {
  tf: {
    low: {
      summary: 'AI rollouts will struggle until the core Workday estate is more stable, integrated, and governed.',
      actions: [
        'Confirm Workday is the system of record for the target AI use cases and retire duplicate manual work where possible.',
        'Prioritise integration reliability, API documentation, and support ownership before enabling new AI-led workflows.',
        'Review security, compliance, and uptime baselines so AI features launch on a trusted foundation.',
      ],
    },
    mid: {
      summary: 'The platform is workable, but a few technical gaps could slow scale-up and create uneven user experience.',
      actions: [
        'Tighten the weakest integrations and data handoffs that support your highest-value AI scenarios.',
        'Document extensibility standards and operational runbooks for the teams supporting Workday AI.',
        'Set quarterly platform-health reviews tied to AI feature adoption plans.',
      ],
    },
    high: {
      summary: 'Your technical base is in a strong position, so the next opportunity is scaling AI with clearer guardrails and reuse.',
      actions: [
        'Package successful integration and API patterns into a reusable launch standard for future AI features.',
        'Use platform telemetry to spot where automation or agents can be introduced with low risk.',
        'Keep security and compliance evidence current so expansion does not stall on approvals.',
      ],
    },
  },
  ds: {
    low: {
      summary: 'Data quality and governance are the main blockers; AI outputs will only be as reliable as the underlying records.',
      actions: [
        'Assign accountable owners for critical HR and Finance data domains and agree validation rules.',
        'Audit completeness, duplicate records, lineage, and historical coverage for the fields your priority use cases depend on.',
        'Create a remediation backlog for the top data issues before expanding AI-assisted decisions.',
      ],
    },
    mid: {
      summary: 'You have usable data, but consistency and supervision need tightening to improve confidence in AI outcomes.',
      actions: [
        'Introduce recurring data-quality reviews for the highest-impact master data and transaction datasets.',
        'Expand anomaly detection and lineage coverage so teams can trust recommendations and investigate exceptions quickly.',
        'Link reporting and warehouse refresh cadence to the AI use cases you want to scale next.',
      ],
    },
    high: {
      summary: 'Your data estate is strong enough to support broader AI use, so focus on making that quality visible and repeatable.',
      actions: [
        'Publish shared quality dashboards for business owners and the Workday team.',
        'Use your clean data foundation to pilot more advanced forecasting, summarisation, or agent-led workflows.',
        'Keep classification, lineage, and audit controls aligned as new datasets are introduced.',
      ],
    },
  },
  aa: {
    low: {
      summary: 'The organisation needs stronger measurement and feedback loops so AI adoption becomes managed rather than anecdotal.',
      actions: [
        'Define a small set of adoption, efficiency, and experience KPIs for each AI capability you enable.',
        'Set a monthly review rhythm to compare feature usage, process outcomes, and user proficiency by audience.',
        'Target training and comms at low-adoption groups instead of relying on broad one-size-fits-all enablement.',
      ],
    },
    mid: {
      summary: 'You are measuring some progress, but improvements will come faster with tighter reporting and more deliberate iteration.',
      actions: [
        'Connect adoption dashboards to business-process KPIs so feature usage is tied to operational value.',
        'Use proficiency checks and manager feedback to guide the next training wave.',
        'Move from quarterly optimisation to a lighter-weight monthly improvement cadence.',
      ],
    },
    high: {
      summary: 'You already have the basics in place, so the next step is using analytics to scale what works across the business.',
      actions: [
        'Promote the highest-performing use cases as repeatable rollout patterns for other teams.',
        'Add predictive or leading indicators that warn when adoption is likely to stall.',
        'Use your metrics to support roadmap decisions and investment cases for additional Workday AI capabilities.',
      ],
    },
  },
  gw: {
    low: {
      summary: 'People, governance, and sponsorship need strengthening so AI adoption does not depend on isolated champions.',
      actions: [
        'Form or refresh a cross-functional steering group with HR, Finance, IT, Risk, and executive sponsorship.',
        'Clarify ownership for Workday AI decisions, change management, training, and roadmap prioritisation.',
        'Build a simple capability plan covering team skills, communication, and budget for the next two quarters.',
      ],
    },
    mid: {
      summary: 'Governance exists, but stronger cadence and clearer ownership would make delivery more consistent.',
      actions: [
        'Increase the operating rhythm of your steering group or CoE and tie it to concrete rollout decisions.',
        'Refresh stakeholder communication and training plans for the next wave of AI-enabled process changes.',
        'Align roadmap reviews with Workday and internal sponsors more consistently.',
      ],
    },
    high: {
      summary: 'Your workforce readiness is solid, so the next move is turning that governance into a durable innovation engine.',
      actions: [
        'Use the CoE or steering group to identify and prioritise the next set of high-value AI opportunities.',
        'Capture successful change-management patterns into a standard launch playbook.',
        'Maintain executive visibility with outcome reporting tied to productivity, control, and employee experience.',
      ],
    },
  },
};

const getReadinessLevel = (score: number): string => {
  if (score >= 4.5) return 'Leading';
  if (score >= 3.5) return 'Developing';
  if (score >= 2.5) return 'Emerging';
  return 'Not Ready';
};

const getReadinessClassName = (score: number): string => {
  if (score >= 4.5) return 'leading';
  if (score >= 3.5) return 'developing';
  if (score >= 2.5) return 'emerging';
  return 'not-ready';
};

export default function Assessment() {
  const [currentScreen, setCurrentScreen] = useState('screen-landing');
  const [quickAnswers, setQuickAnswers] = useState<QuickAnswers>({});
  const [scores, setScores] = useState<Scores>({});
  const [currentQuickQ, setCurrentQuickQ] = useState(0);
  const [currentDim, setCurrentDim] = useState(0);
  const [email, setEmail] = useState('');
  const [orgName, setOrgName] = useState('');
  const [pastAssessments, setPastAssessments] = useState<any[]>([]);
  const [editingDims, setEditingDims] = useState<any[]>(JSON.parse(JSON.stringify(DIMS)));
  const [isEditMode, setIsEditMode] = useState(false);
  const [saveResult, setSaveResult] = useState<SaveResult>({
    assessmentId: null,
    status: 'idle',
    message: '',
  });
  const orgNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const lastSaveSignatureRef = useRef('');

  const assessmentDims = editingDims.length > 0 ? editingDims : DIMS;

  useEffect(() => {
    if (orgName.trim()) {
      loadCustomMeasures();
    }
  }, [orgName]);

  useEffect(() => {
    const detailedComplete = assessmentDims.every((dim) => dim.qs.every((q: any) => !!scores[q.id]));
    const quickComplete = QUICK_QS.every((q) => !!quickAnswers[q.id]);

    if (currentScreen === 'screen-quick-results' && quickComplete) {
      void saveAssessment('quick');
    }

    if (currentScreen === 'screen-results' && detailedComplete) {
      void saveAssessment('detailed', assessmentDims.length - 1);
    }
  }, [assessmentDims, currentScreen, quickAnswers, scores]);

  const loadCustomMeasures = async () => {
    if (!orgName.trim()) return;

    try {
      const response = await fetch(`/api/measures/by-org?org_name=${encodeURIComponent(orgName.trim())}`);
      if (response.ok) {
        const result = await response.json();
        if (result.data?.dims_config) {
          setEditingDims(result.data.dims_config);
        } else {
          setEditingDims(JSON.parse(JSON.stringify(DIMS)));
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
        }),
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

  const resetSaveTracking = () => {
    lastSaveSignatureRef.current = '';
    setSaveResult({
      assessmentId: null,
      status: 'idle',
      message: '',
    });
  };

  const getOrgName = () => orgName || orgNameRef.current?.value || 'Your Organisation';
  const getEmail = () => email || emailRef.current?.value || '';

  const isFormValid = () => {
    const emailVal = email.trim();
    const orgVal = orgName.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !!emailVal && !!orgVal && emailRegex.test(emailVal);
  };

  const showScreen = (id: string) => {
    setCurrentScreen(id);
    window.scrollTo(0, 0);
  };

  const startQuickAssessment = () => {
    resetSaveTracking();
    setQuickAnswers({});
    setCurrentQuickQ(0);
    showScreen('screen-quick-0');
  };

  const startDetailedAssessment = () => {
    resetSaveTracking();
    const newScores: Record<string, number> = {};
    for (const dim of assessmentDims) {
      for (const q of dim.qs) {
        newScores[q.id] = 0;
      }
    }
    setScores(newScores);
    setCurrentDim(0);
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

  const saveAssessment = async (path: 'quick' | 'detailed', dimension?: number) => {
    const normalizedEmail = getEmail().trim().toLowerCase();
    const org = getOrgName().trim();

    if (!normalizedEmail || !org) {
      setSaveResult({
        assessmentId: null,
        status: 'error',
        message: 'Enter a valid email and organisation name before saving.',
      });
      return;
    }

    const payload = {
      email: normalizedEmail,
      orgName: org,
      path,
      quickAnswers: path === 'quick' ? quickAnswers : null,
      scores: path === 'detailed' ? scores : null,
      dimension,
    };
    const signature = JSON.stringify(payload);

    if (lastSaveSignatureRef.current === signature) {
      return;
    }

    lastSaveSignatureRef.current = signature;
    setSaveResult({
      assessmentId: null,
      status: 'saving',
      message: 'Saving assessment to Supabase...',
    });

    try {
      const response = await fetch('/api/assessments/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        lastSaveSignatureRef.current = '';
        setSaveResult({
          assessmentId: null,
          status: 'error',
          message: result.error || 'Assessment save failed.',
        });
        return;
      }

      setSaveResult({
        assessmentId: result.data?.id || null,
        status: 'saved',
        message: 'Assessment saved successfully.',
      });
    } catch (error) {
      console.error('Save error:', error);
      lastSaveSignatureRef.current = '';
      setSaveResult({
        assessmentId: null,
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown save error.',
      });
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

  const dimensionResults = assessmentDims
    .map((dim) => {
      const questionResults = dim.qs.map((q: any) => ({
        ...q,
        score: scores[q.id] || 0,
      }));
      const answeredScores = questionResults.map((q: any) => q.score).filter((score: number) => score > 0);
      const averageScore = answeredScores.length
        ? answeredScores.reduce((total: number, value: number) => total + value, 0) / answeredScores.length
        : 0;

      return {
        ...dim,
        averageScore,
        readinessLevel: getReadinessLevel(averageScore),
        weakestQuestions: [...questionResults]
          .filter((q: any) => q.score > 0)
          .sort((a: any, b: any) => a.score - b.score)
          .slice(0, 2),
      };
    })
    .filter((dim) => dim.averageScore > 0);

  const overallAverage = dimensionResults.length
    ? dimensionResults.reduce((total, dim) => total + dim.averageScore, 0) / dimensionResults.length
    : 0;

  const orderedRecommendations = [...dimensionResults]
    .sort((a, b) => a.averageScore - b.averageScore)
    .map((dim, index) => {
      const contentSet = DIMENSION_NEXT_STEPS[dim.id];
      const content =
        dim.averageScore < 2.5 ? contentSet.low : dim.averageScore < 3.5 ? contentSet.mid : contentSet.high;

      return {
        ...dim,
        priorityLabel: index === 0 ? 'Top Priority' : index === 1 ? 'Next Priority' : 'Keep Advancing',
        content,
      };
    });

  const nextStepTimeline = orderedRecommendations.slice(0, 3).map((dim, index) => ({
    window: index === 0 ? 'Next 30 days' : index === 1 ? 'Days 31-60' : 'Days 61-90',
    action: dim.content.actions[0],
    area: dim.name,
  }));

  return (
    <>
      <div className="header">
        <div className="header-left">📊 Workday AI Readiness Assessment</div>
        <div className="header-nav">
          <button className="nav-btn" onClick={() => showScreen('screen-measures')}>
            📊 Measures
          </button>
          <button className="nav-btn" onClick={() => showScreen('screen-devnotes')}>
            ?
          </button>
        </div>
      </div>

      <div className="container">
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
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <button className="btn secondary" onClick={loadPastAssessments} style={{ fontSize: '14px' }}>
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
                  style={{ opacity: isFormValid() ? 1 : 0.5, cursor: isFormValid() ? 'pointer' : 'not-allowed' }}
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
                  style={{ opacity: isFormValid() ? 1 : 0.5, cursor: isFormValid() ? 'pointer' : 'not-allowed' }}
                >
                  Start Detailed Assessment →
                </button>
              </div>
            </div>
          </div>
        )}

        {currentScreen.startsWith('screen-quick-') && currentScreen !== 'screen-quick-results' && (
          <div className="screen active">
            {(() => {
              const q = QUICK_QS[currentQuickQ];
              const isAnswered = !!quickAnswers[q.id];
              const progress = ((currentQuickQ + 1) / QUICK_QS.length) * 100;

              return (
                <>
                  <div className="progress-bar">
                    <div className="fill" style={{ width: `${progress}%` }}></div>
                  </div>
                  <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
                    Quick Assessment — Question {currentQuickQ + 1} of {QUICK_QS.length}
                  </h2>

                  <div className="question-card">
                    <h3>{q.title}</h3>
                    <div className="option-grid">
                      {q.options.map((opt) => (
                        <div
                          key={opt.value}
                          className={`option-btn ${quickAnswers[q.id] === opt.value ? 'selected' : ''}`}
                          onClick={() => setQuickAnswers((prev) => ({ ...prev, [q.id]: opt.value }))}
                        >
                          <strong>{opt.label}</strong>
                          <br />
                          <span style={{ fontSize: '12px', color: '#666' }}>{opt.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="nav-buttons">
                    <button
                      className="btn secondary"
                      onClick={() => (currentQuickQ > 0 ? gotoQuickQ(currentQuickQ - 1) : showScreen('screen-landing'))}
                    >
                      Back
                    </button>
                    <button
                      className="btn"
                      disabled={!isAnswered}
                      onClick={() =>
                        currentQuickQ < QUICK_QS.length - 1 ? gotoQuickQ(currentQuickQ + 1) : showScreen('screen-quick-results')
                      }
                    >
                      {currentQuickQ === QUICK_QS.length - 1 ? 'View Results →' : 'Next →'}
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {currentScreen === 'screen-quick-results' && (
          <div className="screen active">
            {(() => {
              const pain = (quickAnswers['q-pain'] || 'hr_admin') as keyof typeof PAIN_FEATURES;
              const stage = (quickAnswers['q-stage'] || 'not-started') as keyof typeof STAGE_LABELS;
              const agentReady = (quickAnswers['q-agents'] || 'not-yet') as keyof typeof AGENT_LABELS;
              const modules = (quickAnswers['q-modules'] || 'hcm-only') as keyof typeof MODULE_LABELS;
              const orgType = (quickAnswers['q-orgtype'] || 'mid-market') as keyof typeof SIZE_LABELS;

              let features = [...(PAIN_FEATURES[pain] || PAIN_FEATURES.hr_admin)];
              if (agentReady === 'not-yet') features = features.filter((feature) => feature.skuType !== 'agent');
              if (agentReady === 'one-agent') {
                const withAgent = features.filter((feature) => feature.skuType === 'agent');
                features = features.filter((feature) => feature.skuType !== 'agent');
                if (withAgent.length > 0) features.push(withAgent[0]);
              }

              const now = features.filter((feature) => feature.lane === 'now');
              const nextLane = features.filter((feature) => feature.lane === 'next');
              const watch = features.filter((feature) => feature.lane === 'watch');

              const kpis = KPI_MAP[pain] || KPI_MAP.hr_admin;
              const playbook = PLAYBOOK_MAP[pain] || PLAYBOOK_MAP.hr_admin;
              const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

              return (
                <>
                  <div className="print-bar">
                    <button className="btn secondary" onClick={startQuickAssessment}>
                      Edit Answers
                    </button>
                    <button className="btn" onClick={() => window.print()}>
                      Print / Save as PDF
                    </button>
                    <button className="btn success" onClick={startDetailedAssessment}>
                      Run Detailed Assessment →
                    </button>
                  </div>

                  <div className="results-hero">
                    <h1>Quick Assessment — AI Adoption Roadmap</h1>
                    <div className="meta">
                      {getOrgName()} — {today}
                    </div>
                  </div>

                  <div className={`save-banner ${saveResult.status}`}>
                    <strong>Save status:</strong> {saveResult.message}
                    {saveResult.assessmentId && <span> Reference: {saveResult.assessmentId.slice(0, 8)}...</span>}
                  </div>

                  <div className="profile-strip">
                    <div className="profile-pill">
                      <strong>Modules:</strong> {MODULE_LABELS[modules]}
                    </div>
                    <div className="profile-pill">
                      <strong>Stage:</strong> {STAGE_LABELS[stage]}
                    </div>
                    <div className="profile-pill">
                      <strong>Pain Point:</strong> {PAIN_LABELS[pain]}
                    </div>
                    <div className="profile-pill">
                      <strong>Agent Readiness:</strong> {AGENT_LABELS[agentReady]}
                    </div>
                    <div className="profile-pill">
                      <strong>Org Type:</strong> {SIZE_LABELS[orgType]}
                    </div>
                  </div>

                  <h2 className="section-title">Feature Roadmap</h2>
                  <div className="lanes-container">
                    <div className="lane">
                      <div className="lane-header now">CHECK NOW — Quick Wins</div>
                      <div className="lane-body">
                        {now.map((feature, index) => (
                          <div key={index} className="feature-card">
                            <div className="title">{feature.name}</div>
                            <div className="desc">{feature.desc}</div>
                            <div className="feature-badges">
                              <span className="badge-small area">{feature.area}</span>
                              <span className="badge-small sku">{feature.sku}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="lane">
                      <div className="lane-header next">NEXT — Plan Ahead</div>
                      <div className="lane-body">
                        {nextLane.map((feature, index) => (
                          <div key={index} className="feature-card">
                            <div className="title">{feature.name}</div>
                            <div className="desc">{feature.desc}</div>
                            <div className="feature-badges">
                              <span className="badge-small area">{feature.area}</span>
                              <span className="badge-small sku">{feature.sku}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="lane">
                      <div className="lane-header watch">WATCH — On Radar</div>
                      <div className="lane-body">
                        {watch.map((feature, index) => (
                          <div key={index} className="feature-card">
                            <div className="title">{feature.name}</div>
                            <div className="desc">{feature.desc}</div>
                            <div className="feature-badges">
                              <span className="badge-small area">{feature.area}</span>
                              <span className="badge-small sku">{feature.sku}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <h2 className="section-title">30-Day Activation Playbook</h2>
                  <div className="playbook-steps">
                    {playbook.map((step, index) => (
                      <div key={index} className="playbook-card">
                        <div className="week">Week {index + 1}</div>
                        <p>{step}</p>
                      </div>
                    ))}
                  </div>

                  <h2 className="section-title">KPI Targets</h2>
                  <div className="kpi-grid">
                    {kpis.map((kpi, index) => (
                      <div key={index} className="kpi-tile">
                        <div className="kpi-value">{kpi.value}</div>
                        <div className="kpi-label">{kpi.label}</div>
                        <div className="kpi-note">{kpi.note}</div>
                      </div>
                    ))}
                  </div>

                  <div className="cta-footer">
                    <p>
                      <strong>Want a deeper readiness assessment?</strong>
                    </p>
                    <button className="btn success" onClick={startDetailedAssessment}>
                      Run the Detailed Assessment (25 questions, 15 min) →
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {currentScreen === 'screen-measures' && (
          <div className="screen active">
            <div style={{ maxWidth: '1200px', margin: '0 auto 40px', padding: '0 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Measures Reference — Assessment Questions</h2>
                <button
                  className={`btn ${isEditMode ? 'danger' : 'secondary'}`}
                  onClick={() => setIsEditMode(!isEditMode)}
                  style={{ fontSize: '13px', padding: '8px 12px' }}
                >
                  {isEditMode ? '✓ Done Editing' : '✎ Edit Scoring'}
                </button>
              </div>

              <table className="measures-table" style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                  <tr>
                    <th>Question ID</th>
                    <th>Title</th>
                    <th>Qualitative Approach</th>
                    {isEditMode && <th>Score Guidance</th>}
                  </tr>
                </thead>
                <tbody>
                  {(isEditMode ? editingDims : assessmentDims).map((dim: any) => (
                    <React.Fragment key={dim.id}>
                      <tr style={{ background: dim.color, color: 'white' }}>
                        <td colSpan={isEditMode ? 4 : 3}>
                          <strong>
                            {dim.code}: {dim.name}
                          </strong>
                        </td>
                      </tr>
                      {dim.qs.map((q: any) => (
                        <tr key={q.id} className={`border-${dim.code.toLowerCase()}`} style={{ borderBottom: '1px solid #ddd' }}>
                          <td style={{ fontWeight: '700', padding: '12px', width: '80px' }}>{q.id}</td>
                          <td style={{ fontWeight: '600', padding: '12px', minWidth: '200px' }}>{q.title}</td>
                          <td style={{ padding: '12px', width: '300px' }}>{q.qual}</td>
                          {isEditMode && (
                            <td style={{ padding: '12px', maxWidth: '400px', fontSize: '12px' }}>
                              {q.scoring ? (
                                <div style={{ display: 'grid', gap: '4px', maxHeight: '200px', overflowY: 'auto' }}>
                                  {[1, 2, 3, 4, 5].map((score) => (
                                    <input
                                      key={score}
                                      type="text"
                                      value={q.scoring[score as keyof typeof q.scoring] || ''}
                                      onChange={(e) => {
                                        const newDims = JSON.parse(JSON.stringify(editingDims));
                                        const dimIndex = newDims.findIndex((item: any) => item.id === dim.id);
                                        const qIndex = newDims[dimIndex].qs.findIndex((question: any) => question.id === q.id);
                                        newDims[dimIndex].qs[qIndex].scoring[score] = e.target.value;
                                        setEditingDims(newDims);
                                      }}
                                      style={{ fontSize: '11px', padding: '4px', border: '1px solid #ddd', borderRadius: '4px' }}
                                      placeholder={`Level ${score} guidance...`}
                                    />
                                  ))}
                                </div>
                              ) : (
                                <span style={{ color: '#999' }}>No scoring guidance</span>
                              )}
                            </td>
                          )}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>

              <div style={{ marginTop: '20px' }}>
                {isEditMode && (
                  <button className="btn success" onClick={saveCustomMeasures} style={{ marginRight: '10px' }}>
                    💾 Save All Changes
                  </button>
                )}
                <button className="btn secondary" onClick={() => showScreen('screen-landing')}>
                  ← Back to Home
                </button>
              </div>
            </div>
          </div>
        )}

        {currentScreen.startsWith('screen-dim-') && currentScreen !== 'screen-results' && (
          <div className="screen active">
            {(() => {
              const dim = assessmentDims[currentDim];
              if (!dim || !dim.qs || dim.qs.length === 0) return <div>No questions for this dimension</div>;

              const progress = ((currentDim + 1) / assessmentDims.length) * 100;
              const allAnswered = dim.qs.every((q: any) => scores[q.id]);

              return (
                <>
                  <div className="progress-bar">
                    <div className="fill" style={{ width: `${progress}%` }}></div>
                  </div>
                  <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>
                    {dim.code}: {dim.name}
                  </h2>
                  <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
                    Dimension {currentDim + 1} of {assessmentDims.length} — {dim.qs.length} questions
                  </p>

                  <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    {dim.qs.map((q: any, idx: number) => (
                      <div
                        key={q.id}
                        style={{
                          marginBottom: '40px',
                          paddingBottom: '30px',
                          borderBottom: idx === dim.qs.length - 1 ? 'none' : '1px solid #eee',
                        }}
                      >
                        <div style={{ marginBottom: '20px' }}>
                          <div style={{ fontSize: '14px', color: '#999', marginBottom: '5px' }}>
                            Question {idx + 1} of {dim.qs.length}
                          </div>
                          <h3 style={{ marginBottom: '8px', fontSize: '18px' }}>{q.title}</h3>
                          <p style={{ color: '#666', fontSize: '14px' }}>{q.qual}</p>
                        </div>

                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                          {[
                            { val: 1, label: 'Emerging' },
                            { val: 2, label: 'Emerging' },
                            { val: 3, label: 'Developing' },
                            { val: 4, label: 'Advanced' },
                            { val: 5, label: 'Leading' },
                          ].map((item) => {
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
                                  color: isSelected ? selectedColor : '#555',
                                }}
                                onClick={() => {
                                  setScores((prev) => ({ ...prev, [q.id]: item.val }));
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: '18px',
                                    fontWeight: '800',
                                    marginBottom: '2px',
                                    color: selectedColor,
                                  }}
                                >
                                  {item.val}
                                </div>
                                <div style={{ fontSize: '10px' }}>{item.label}</div>
                              </button>
                            );
                          })}
                        </div>

                        {q.scoring && (
                          <div
                            style={{
                              marginTop: '20px',
                              padding: '16px',
                              background: '#f0f7ff',
                              borderRadius: '8px',
                              borderLeft: `4px solid ${dim.color}`,
                            }}
                          >
                            <div style={{ fontSize: '12px', fontWeight: '600', color: '#666', marginBottom: '10px' }}>
                              📊 Scoring Guide:
                            </div>
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                                gap: '10px',
                              }}
                            >
                              {[1, 2, 3, 4, 5].map((score) => (
                                <div
                                  key={score}
                                  style={{
                                    fontSize: '12px',
                                    padding: '8px',
                                    background: '#fff',
                                    borderRadius: '4px',
                                    borderLeft: `3px solid ${['#E74C3C', '#F39C12', '#F1C40F', '#27AE60', '#16A085'][score - 1]}`,
                                  }}
                                >
                                  <div style={{ fontWeight: '600', marginBottom: '3px' }}>Level {score}:</div>
                                  <div style={{ color: '#555', lineHeight: '1.4' }}>
                                    {q.scoring[score as keyof typeof q.scoring]}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="nav-buttons">
                    <button
                      className="btn secondary"
                      onClick={() => (currentDim > 0 ? gotoDimension(currentDim - 1) : showScreen('screen-landing'))}
                    >
                      ← Back
                    </button>
                    <button
                      className="btn"
                      disabled={!allAnswered}
                      onClick={() =>
                        currentDim < assessmentDims.length - 1 ? gotoDimension(currentDim + 1) : showScreen('screen-results')
                      }
                    >
                      {currentDim === assessmentDims.length - 1 ? 'View Results →' : 'Next Dimension →'}
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {currentScreen === 'screen-results' && (
          <div className="screen active">
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
              <div className="print-bar">
                <button className="btn secondary" onClick={startDetailedAssessment}>
                  Edit Answers
                </button>
                <button className="btn" onClick={() => window.print()}>
                  Print / Save as PDF
                </button>
                <button className="btn secondary" onClick={() => showScreen('screen-landing')}>
                  Back to Home
                </button>
              </div>

              <div className="results-hero">
                <h1>Detailed Assessment — Readiness Scorecard</h1>
                <div className="meta">{getOrgName()} — Comprehensive 4-Dimension Analysis</div>
              </div>

              <div className={`save-banner ${saveResult.status}`}>
                <strong>Save status:</strong> {saveResult.message}
                {saveResult.assessmentId && <span> Reference: {saveResult.assessmentId.slice(0, 8)}...</span>}
              </div>

              <div className="recommendation-summary">
                <div>
                  <div className="recommendation-summary-label">Overall readiness</div>
                  <div className="recommendation-summary-score">{overallAverage.toFixed(1)}</div>
                  <div className={`level-badge ${getReadinessClassName(overallAverage)}`}>
                    {getReadinessLevel(overallAverage)}
                  </div>
                </div>
                <div className="recommendation-summary-copy">
                  <h2>Recommended next steps</h2>
                  <p>
                    The strongest outcomes will come from focusing first on the lowest-scoring dimensions, then using your
                    stronger areas to support rollout, change management, and scale.
                  </p>
                </div>
              </div>

              <h2 className="section-title">Dimension Scores</h2>
              <div className="dimensions-grid">
                {dimensionResults.map((dim) => (
                  <div key={dim.id} className={`dim-card ${dim.id}`}>
                    <div className="dim-card-header">
                      <h3>{dim.name}</h3>
                      <div className="dim-score">{dim.averageScore.toFixed(1)}</div>
                    </div>
                    <div className="dim-bar">
                      <div className="dim-bar-fill" style={{ width: `${(dim.averageScore / 5) * 100}%`, background: dim.color }} />
                    </div>
                    <div className="dim-label">{dim.readinessLevel}</div>
                    {dim.weakestQuestions.length > 0 && (
                      <div className="weakness-list">
                        <strong>Lowest scoring measures:</strong>
                        {dim.weakestQuestions.map((question: any) => (
                          <div key={question.id}>
                            {question.id} · {question.title} ({question.score}/5)
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <h2 className="section-title">Priority Recommendations</h2>
              <div className="recommendations-grid">
                {orderedRecommendations.map((dim) => (
                  <div key={dim.id} className="recommendation-card">
                    <div className="recommendation-card-header">
                      <div>
                        <div className="recommendation-priority">{dim.priorityLabel}</div>
                        <h3>{dim.name}</h3>
                      </div>
                      <div className={`level-badge ${getReadinessClassName(dim.averageScore)}`}>
                        {dim.averageScore.toFixed(1)} · {dim.readinessLevel}
                      </div>
                    </div>
                    <p>{dim.content.summary}</p>
                    <div className="recommendation-subtitle">What to do next</div>
                    <ul className="recommendation-list">
                      {dim.content.actions.map((action: any) => (
                        <li key={action}>{action}</li>
                      ))}
                    </ul>
                    {dim.weakestQuestions.length > 0 && (
                      <>
                        <div className="recommendation-subtitle">Signals from this assessment</div>
                        <ul className="recommendation-list">
                          {dim.weakestQuestions.map((question: any) => (
                            <li key={question.id}>
                              {question.id} scored {question.score}/5: {question.title}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                ))}
              </div>

              <h2 className="section-title">Suggested 90-Day Sequence</h2>
              <div className="timeline-grid">
                {nextStepTimeline.map((item) => (
                  <div key={item.window} className="timeline-card">
                    <div className="week">{item.window}</div>
                    <div className="timeline-area">{item.area}</div>
                    <p>{item.action}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentScreen === 'screen-history' && (
          <div className="screen active">
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
              <h2>Your Past Assessments</h2>
              <p style={{ color: '#666', marginBottom: '20px' }}>
                Showing assessments for: <strong>{getEmail()}</strong>
              </p>

              {pastAssessments && pastAssessments.length > 0 ? (
                <div style={{ display: 'grid', gap: '15px', marginBottom: '30px' }}>
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
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '600', marginBottom: '5px' }}>{assessment.org_name}</div>
                        <div style={{ fontSize: '13px', color: '#666' }}>
                          {assessment.path === 'quick' ? '⚡ Quick Assessment' : '📊 Detailed Assessment'} ·{' '}
                          {new Date(assessment.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div style={{ fontSize: '12px', color: '#999' }}>ID: {assessment.id.substring(0, 8)}...</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                  <p>No assessments found for this email.</p>
                  <p>Complete an assessment to see it here.</p>
                </div>
              )}

              <button className="btn secondary" onClick={() => showScreen('screen-landing')}>
                ← Back to Home
              </button>
            </div>
          </div>
        )}

        {currentScreen === 'screen-devnotes' && (
          <div className="screen active">
            <div className="devnotes">
              <h2>Developer Documentation</h2>
              <h3>Product Overview</h3>
              <p>
                The <strong>Workday AI Adoption Readiness Assessment</strong> is a Next.js React application that guides
                organisations through evidence-based diagnostics of their Workday AI readiness.
              </p>
              <h3>Architecture</h3>
              <p>
                <strong>Screens:</strong>
              </p>
              <ul>
                <li>screen-landing — Path selection & org name input ✓</li>
                <li>screen-quick-0 to screen-quick-4 — Quick assessment (1 question per screen) ✓</li>
                <li>screen-quick-results — Quick results with roadmap, KPIs, playbook ✓</li>
                <li>screen-dim-0 to screen-dim-3 — Detailed assessment (1 dimension per screen) ✓</li>
                <li>screen-results — Detailed results scorecard + recommendations ✓</li>
                <li>screen-measures — Reference table of assessment questions ✓</li>
                <li>screen-devnotes — Developer documentation ✓</li>
              </ul>
              <h3>Next Steps</h3>
              <p>To complete implementation:</p>
              <ul>
                <li>Expand saved assessment history into a reopen/view-details experience</li>
                <li>Add benchmarking or peer-comparison views for repeated assessments</li>
                <li>Introduce admin reporting over the saved recommendation trends by organisation</li>
              </ul>
              <button className="btn secondary" style={{ marginTop: '20px' }} onClick={() => showScreen('screen-landing')}>
                ← Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
