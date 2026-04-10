export const QUICK_QS = [
  {
    id: 'q-modules',
    title: 'Which Workday modules does your organisation actively use?',
    options: [
      { value: 'hcm-only', label: 'HCM only', badge: 'HCM', desc: 'Human Capital Management only' },
      { value: 'fins-only', label: 'Financials only', badge: 'Finance', desc: 'Financials only' },
      { value: 'hcm-fins', label: 'HCM + Financials', badge: 'Full Suite', desc: 'HCM and Financials' },
      { value: 'hcm-fins-planning', label: 'HCM + Financials + Adaptive Planning', badge: 'Enterprise', desc: 'Full core suite' },
      { value: 'with-extras', label: 'Full suite + add-ons', badge: 'Extended', desc: 'Includes additional products' }
    ]
  },
  {
    id: 'q-stage',
    title: 'Where is your organisation on the Workday AI journey?',
    options: [
      { value: 'not-started', label: 'Not started', desc: 'AI is on the radar but not yet activated' },
      { value: 'aware', label: 'Aware, not yet activated', desc: 'Teams aware of AI features but not using' },
      { value: 'some-live', label: 'Some features live', desc: 'Pilots or early rollouts underway' },
      { value: 'active', label: 'Actively adopting', desc: 'Multiple features live, scaling adoption' }
    ]
  },
  {
    id: 'q-pain',
    title: 'What is your single biggest operational pain point right now?',
    options: [
      { value: 'hr_admin', label: 'HR Admin Reduction', desc: 'HR team overwhelmed with manual tasks & queries' },
      { value: 'talent_skills', label: 'Talent & Skills', desc: 'Recruiting, retention, skills gaps' },
      { value: 'payroll_compliance', label: 'Payroll & Compliance', desc: 'Payroll errors, audit complexity, compliance risk' },
      { value: 'finance_manual', label: 'Finance Automation', desc: 'Manual reconciliation, expense processing, cash app' },
      { value: 'workforce_planning', label: 'Workforce Planning', desc: 'Scheduling, forecasting, labour demand' }
    ]
  },
  {
    id: 'q-agents',
    title: 'How ready is your organisation to adopt AI Agents specifically?',
    options: [
      { value: 'not-yet', label: 'Not yet — start with embedded AI', desc: 'Prefer to master embedded AI first' },
      { value: 'one-agent', label: 'Open to one Agent', desc: 'Willing to pilot one Agent' },
      { value: 'priority', label: 'Agents are a priority', desc: 'Actively wanting Agents' },
      { value: 'all-in', label: 'All-in on Agents', desc: 'Agents central to strategy' }
    ]
  },
  {
    id: 'q-orgtype',
    title: 'What best describes your organisation?',
    options: [
      { value: 'mid-market', label: 'Mid-market (500–5k employees)', desc: 'Mid-sized organisation' },
      { value: 'enterprise', label: 'Enterprise (5k–50k employees)', desc: 'Large multi-region' },
      { value: 'global-enterprise', label: 'Global enterprise (50k+ employees)', desc: 'Multi-country, highly complex' },
      { value: 'professional-services', label: 'Professional services', desc: 'Consulting, legal, accounting' }
    ]
  }
];

export const PAIN_FEATURES = {
  hr_admin: [
    { name:'Self Service Agent', area:'HCM', sku:'Agent SKU', skuType:'agent', lane:'next', desc:'Multi-turn conversational AI for employee self-service' },
    { name:'Intelligent Answers', area:'HCM', sku:'Included', skuType:'included', lane:'now', desc:'AI-powered answers to common HR questions' },
    { name:'Workday Help AI', area:'HCM', sku:'Included', skuType:'included', lane:'now', desc:'AI guidance embedded in Workday' },
    { name:'AI QuickTips', area:'Platform', sku:'Included', skuType:'included', lane:'now', desc:'Context-aware tips to speed user tasks' },
    { name:'Form Completion Assistant', area:'Platform', sku:'Included', skuType:'included', lane:'now', desc:'Auto-completes form fields based on context' },
    { name:'Workday Assistant', area:'HCM', sku:'Included', skuType:'included', lane:'now', desc:'Embedded assistant for HCM tasks' },
    { name:'Workflow Routing', area:'Platform', sku:'Included (Preview)', skuType:'preview', lane:'watch', desc:'AI routes users to correct workflows' },
    { name:'Peakon Attrition Prediction', area:'Peakon EV', sku:'Separate License', skuType:'separate', lane:'watch', desc:'Predict attrition risk' }
  ],
  talent_skills: [
    { name:'Suggested Skills on Worker Profile', area:'HCM', sku:'Included', skuType:'included', lane:'now', desc:'AI suggests missing skills for workers' },
    { name:'Job Description Generation', area:'HCM', sku:'Included', skuType:'included', lane:'now', desc:'Generates job descriptions with AI' },
    { name:'Candidate Skills Match', area:'HCM', sku:'Included', skuType:'included', lane:'now', desc:'Matches candidates by skills' },
    { name:'Market Skills', area:'HCM', sku:'Included (opt-in)', skuType:'included', lane:'now', desc:'Compare skills to market benchmarks' },
    { name:'Talent Highlights', area:'HCM', sku:'Included', skuType:'included', lane:'now', desc:'AI summaries of top talent' },
    { name:'Performance Summary AI Widget', area:'HCM', sku:'Included', skuType:'included', lane:'now', desc:'AI-generated performance summaries' },
    { name:'Career Hub', area:'HCM', sku:'Included', skuType:'included', lane:'next', desc:'AI-powered career guidance and learning' },
    { name:'Spotlight (HiredScore)', area:'HiredScore', sku:'Separate License', skuType:'separate', lane:'watch', desc:'AI-powered candidate evaluation' }
  ],
  payroll_compliance: [
    { name:'Pay Anomalies', area:'Payroll', sku:'Included', skuType:'included', lane:'now', desc:'Detects pay anomalies before processing' },
    { name:'Time Anomalies', area:'Workforce Mgmt', sku:'Included', skuType:'included', lane:'now', desc:'Flags unusual time entries' },
    { name:'FLSA & FSB Insights', area:'Workforce Mgmt', sku:'Included', skuType:'included', lane:'now', desc:'Compliance insights for US Fair Labor' },
    { name:'Payroll Agent', area:'Payroll', sku:'Agent SKU', skuType:'agent', lane:'next', desc:'Conversational AI for payroll queries & insights' },
    { name:'BP Optimize Agent', area:'Platform', sku:'Agent SKU', skuType:'agent', lane:'watch', desc:'Optimises business processes with AI' }
  ],
  finance_manual: [
    { name:'Receipt Scanning for Expenses', area:'Finance', sku:'Included', skuType:'included', lane:'now', desc:'Scans receipts and populates expense claims' },
    { name:'Intelligent Expense Recommendations', area:'Finance', sku:'Included', skuType:'included', lane:'now', desc:'Suggests correct expense codes' },
    { name:'AI Bank Reconciliation', area:'Finance', sku:'Included', skuType:'included', lane:'now', desc:'Automates bank recon matching' },
    { name:'Cash Application Insights', area:'Finance', sku:'Included', skuType:'included', lane:'now', desc:'Applies cash to correct invoices' },
    { name:'Collection Letters', area:'Finance', sku:'Included', skuType:'included', lane:'next', desc:'AI-drafted collection letter templates' },
    { name:'Intelligent Prompt Rec. (AR & Cash)', area:'Finance', sku:'Included', skuType:'included', lane:'next', desc:'AR prompt recommendations' },
    { name:'AI Drafting Tools (Contracts)', area:'CLM', sku:'Separate License', skuType:'separate', lane:'watch', desc:'AI contract drafting' }
  ],
  workforce_planning: [
    { name:'Labor Demand Forecasting', area:'Workforce Mgmt', sku:'Included', skuType:'included', lane:'now', desc:'Forecasts labour demand with AI' },
    { name:'Scheduling Optimization Engine', area:'Workforce Mgmt', sku:'Included', skuType:'included', lane:'now', desc:'Optimises schedule automatically' },
    { name:'Conversational Scheduling', area:'Workforce Mgmt', sku:'Included', skuType:'included', lane:'now', desc:'Chat-based scheduling assistant' },
    { name:'Workday Writing Prompt', area:'Workforce Mgmt', sku:'Included', skuType:'included', lane:'now', desc:'AI assistant for writing tasks' },
    { name:'Predictive Forecasting (Adaptive)', area:'Adaptive Planning', sku:'Separate License', skuType:'separate', lane:'next', desc:'Advanced demand forecasting' },
    { name:'Planning Agent', area:'Adaptive Planning', sku:'Agent SKU (Preview)', skuType:'agent', lane:'watch', desc:'Conversational planning agent' },
    { name:'Peakon Strengths & Focus Areas', area:'Peakon EV', sku:'Separate License', skuType:'separate', lane:'watch', desc:'Engagement-based insights' }
  ]
};

export const KPI_MAP = {
  hr_admin: [
    { value:'↓ 20%', label:'HR Ticket Volume', note:'Self-service deflection via AI' },
    { value:'↓ 50%', label:'Query Resolution Time', note:'Before vs after Intelligent Answers' },
    { value:'↑ 30%', label:'Self-Service Completion', note:'Transactions completed without HR' }
  ],
  talent_skills: [
    { value:'↑ 40%', label:'Skills Profile Coverage', note:'Workers with 3+ validated skills' },
    { value:'↓ 60%', label:'JD Drafting Time', note:'Minutes per job description' },
    { value:'↑ 25%', label:'Candidate Match Quality', note:'Recruiter-assessed fit score' }
  ],
  payroll_compliance: [
    { value:'↓ 80%', label:'Payroll Errors (pre-run)', note:'Anomalies caught before processing' },
    { value:'↑ 75%', label:'Audit Prep Speed', note:'Payroll Agent data insights' },
    { value:'↓ 30%', label:'Payroll Query Volume', note:'Self-resolved via Payroll Agent' }
  ],
  finance_manual: [
    { value:'↓ 50%', label:'Expense Entry Time', note:'Mobile scan vs manual per claim' },
    { value:'↓ 40%', label:'Bank Recon Hours', note:'Per period: before vs after AI' },
    { value:'↑ 30%', label:'Cash App Speed', note:'Days to apply vs days outstanding' }
  ],
  workforce_planning: [
    { value:'↓ 67%', label:'Schedule Build Time', note:'AI vs manual weekly scheduling' },
    { value:'↑ 15%', label:'Forecast Accuracy', note:'Plan vs actual at period close' },
    { value:'↓ 40%', label:'Manager Admin Time', note:'On scheduling vs strategic work' }
  ]
};

export const PLAYBOOK_MAP = {
  hr_admin: [
    'Enable Intelligent Answers & AI QuickTips. Brief HR comms team.',
    'Baseline HR ticket volume, avg resolution time, self-service % before AI.',
    'Activate Help AI knowledge management. Run manager awareness session.',
    'Capture KPIs. Prepare 1-page value summary for HR leadership.'
  ],
  talent_skills: [
    'Enable Skills on Worker Profiles & Job Descriptions. Audit skills taxonomy.',
    'Activate Candidate Skills Match for open roles. Baseline screening time per req.',
    'Enable Job Description GenAI on all new requisitions. Track drafting time.',
    'Capture metrics. Build business case for Career Hub or HiredScore if relevant.'
  ],
  payroll_compliance: [
    'Enable Pay Anomalies & Time Anomalies. Configure alert thresholds.',
    'Run first parallel payroll with AI anomaly detection. Document findings.',
    'Review anomaly catch rate vs pre-AI baseline. Assess Payroll Agent appetite.',
    'Present pay error reduction data to Payroll & Compliance leadership.'
  ],
  finance_manual: [
    'Enable Receipt Scanning & Expense Recommendations. Communicate to all staff.',
    'Run parallel bank recon (manual + AI). Validate AI match rates vs manual.',
    'Enable Cash Application Insights. Baseline AR team hours per period.',
    'Capture all KPIs. Present finance leadership 1-page value case.'
  ],
  workforce_planning: [
    'Enable Labor Demand Forecasting & Scheduling Optimisation. Train schedulers.',
    'Run first AI-assisted schedule alongside manual. Compare accuracy & time.',
    'Full AI scheduling rollout. Baseline manager time on scheduling tasks.',
    'Capture schedule accuracy & manager time KPIs. Evaluate Planning Agent.'
  ]
};

export const MODULE_LABELS = {
  'hcm-only': 'HCM only',
  'fins-only': 'Financials only',
  'hcm-fins': 'HCM + Financials',
  'hcm-fins-planning': 'HCM + Financials + Adaptive Planning',
  'with-extras': 'Full suite + add-ons'
};

export const STAGE_LABELS = {
  'not-started': 'Not started',
  'aware': 'Aware, not yet activated',
  'some-live': 'Some features live',
  'active': 'Actively adopting'
};

export const PAIN_LABELS = {
  'hr_admin': 'HR Admin Reduction',
  'talent_skills': 'Talent & Skills',
  'payroll_compliance': 'Payroll & Compliance',
  'finance_manual': 'Finance Automation',
  'workforce_planning': 'Workforce Planning'
};

export const AGENT_LABELS = {
  'not-yet': 'Start with embedded AI',
  'one-agent': 'Open to one Agent',
  'priority': 'Agents are a priority',
  'all-in': 'All-in on Agents'
};

export const SIZE_LABELS = {
  'mid-market': 'Mid-market',
  'enterprise': 'Enterprise',
  'global-enterprise': 'Global enterprise',
  'professional-services': 'Professional services'
};

export const WD_FEATURES = [
  { title:'Career Hub', product:'Talent Management', gaStatus:'GA (2026R1)', impact:'High', isAgent:false, description:'AI-powered career hub with mentor recommendations, skill-gap analysis, learning suggestions.', sku:'Included', skuType:'included'},
  { title:'Payroll Agent', product:'Payroll', gaStatus:'GA (2026R1)', impact:'High', isAgent:true, description:'Conversational AI for payroll insights, data validation, compliance monitoring.', sku:'Agent SKU', skuType:'agent'},
  { title:'Self Service Agent', product:'Human Capital Management', gaStatus:'GA (2026R1)', impact:'High', isAgent:true, description:'Multi-turn AI for employee/manager self-service across HCM, time, payroll, talent.', sku:'Agent SKU', skuType:'agent'},
  { title:'Workflow Routing', product:'Platform', gaStatus:'Preview', impact:'Medium', isAgent:false, description:'AI traffic cop guiding users to correct business processes and workflows.', sku:'Included (Preview)', skuType:'preview'},
  { title:'Pay Anomalies', product:'Payroll', gaStatus:'GA', impact:'High', isAgent:false, description:'Detects payroll anomalies before processing to prevent errors.', sku:'Included', skuType:'included'},
  { title:'Time Anomalies', product:'Workforce Management', gaStatus:'GA', impact:'High', isAgent:false, description:'Flags unusual time entries and compliance issues.', sku:'Included', skuType:'included'},
];

export const DIMS = [
  {
    id:'tf', code:'TF', color:'#283583', name:'Technology Foundations',
    desc:'Is Workday configured, governed, and positioned as the core platform for AI?',
    qs:[
      { id:'TF1', title:'System of Record Consolidation', qual:'Is Workday your authoritative system of record for HR and/or Finance with no significant parallel systems?', scoring:{ 1:'Multiple systems of record; Workday is one of several', 2:'Workday primary but parallel shadow systems exist', 3:'Workday is primary; some legacy integrations remain', 4:'Workday is primary with <5% parallel usage', 5:'Workday is sole system of record; integrations are read-only' } },
      { id:'TF2', title:'Data Quality & Governance', qual:'Who owns data validation, and how often are data quality audits performed?', scoring:{ 1:'No formal data governance; ad-hoc quality checks', 2:'Basic governance exists; audits quarterly or less', 3:'Documented data governance; semi-annual audits', 4:'Strong governance; quarterly audits with assigned DQ owner', 5:'Comprehensive governance; monthly audits + real-time monitoring' } },
      { id:'TF3', title:'Integration Health', qual:'What percentage of your integrations are automated vs. manual, and what is the failure rate?', scoring:{ 1:'<30% automated; >10% failure rate', 2:'30-50% automated; 5-10% failure rate', 3:'50-70% automated; 2-5% failure rate', 4:'70-90% automated; <2% failure rate', 5:'>90% automated; <0.5% failure rate' } },
      { id:'TF4', title:'Platform Stability & Uptime', qual:'What is your Workday environment uptime percentage over the last 12 months?', scoring:{ 1:'<95% uptime', 2:'95-97% uptime', 3:'97-98.5% uptime', 4:'98.5-99.5% uptime', 5:'>99.5% uptime' } },
      { id:'TF5', title:'API & Extensibility Readiness', qual:'Do you have documented APIs, webhooks, and extensibility standards in place?', scoring:{ 1:'No documented standards; ad-hoc custom development', 2:'Some APIs documented; inconsistent standards', 3:'Core APIs documented; basic extensibility guidelines', 4:'All APIs documented; robust extensibility framework', 5:'Enterprise-grade API governance; webhooks, SDKs, standards' } },
      { id:'TF6', title:'Security & Compliance Infrastructure', qual:'Is your Workday environment compliant with SOC 2, ISO 27001, and GDPR requirements?', scoring:{ 1:'No formal certifications; limited compliance controls', 2:'Single certification (SOC 2 or ISO 27001); GDPR baseline', 3:'Two certifications; GDPR compliant but gaps remain', 4:'SOC 2 + ISO 27001; GDPR + regional compliance met', 5:'All certifications current; continuous compliance monitoring' } }
    ]
  },
  {
    id:'ds', code:'DS', color:'#E67E22', name:'Data & Supervision',
    desc:'Do you have clean, governed data and quality processes for AI to learn from?',
    qs:[
      { id:'DS1', title:'Master Data Governance', qual:'Do you have a documented master data management (MDM) strategy and governance council?', scoring:{ 1:'No MDM strategy; no governance council', 2:'Basic MDM awareness; informal governance', 3:'Documented MDM strategy; governance council meets quarterly', 4:'Formal MDM program; governance council meets monthly', 5:'Mature MDM strategy; active council; integrated tools' } },
      { id:'DS2', title:'Field Completeness & Accuracy', qual:'What is the average data completeness for critical HR/Finance fields?', scoring:{ 1:'<70% completeness; high error rates', 2:'70-80% completeness; known data quality issues', 3:'80-90% completeness; periodic reconciliation', 4:'90-95% completeness; regular validation', 5:'>95% completeness; continuous validation rules' } },
      { id:'DS3', title:'Historical Data Retention', qual:'How many years of clean historical data do you maintain?', scoring:{ 1:'<1 year of clean data', 2:'1-2 years of clean data', 3:'2-3 years of clean data', 4:'3-5 years of clean data', 5:'>5 years of clean, auditable data' } },
      { id:'DS4', title:'Audit & Change Tracking', qual:'Are all sensitive data changes logged, auditable, and retained for 7+ years?', scoring:{ 1:'Limited audit trails; <1 year retention', 2:'Basic audit logging; 1-3 years retention', 3:'Audit logs captured; 3-5 years retention', 4:'Complete audit trails; 7-year retention', 5:'Immutable audit logs; 7+ year retention + analytics' } },
      { id:'DS5', title:'Duplicate & Anomaly Detection', qual:'Do you have automated processes to detect and remediate duplicates?', scoring:{ 1:'Manual detection only; high duplicate rates', 2:'Basic duplicate checks; semi-automated remediation', 3:'Automated duplicate detection; quarterly cleanup', 4:'Real-time duplicate prevention + monthly audits', 5:'AI-powered anomaly detection + auto-remediation' } },
      { id:'DS6', title:'Data Classification & Lineage', qual:'Is data classified by sensitivity level with traceable lineage?', scoring:{ 1:'No classification; no lineage tracking', 2:'Basic classification; limited lineage visibility', 3:'Classified PII; lineage for tier-1 fields', 4:'All data classified; most lineage mapped', 5:'Full data classification + complete lineage + auto-discovery' } },
      { id:'DS7', title:'Reporting & Analytics Infrastructure', qual:'Do you have a centralized data warehouse for analytics?', scoring:{ 1:'No centralized warehouse; point-to-point queries', 2:'Basic data warehouse; limited refresh frequency', 3:'Workday Financials Cube or equivalent; daily refresh', 4:'Mature warehouse (BI360, Adaptive Insights); real-time refresh', 5:'Enterprise DW platform; unified AI/BI; continuous ingestion' } }
    ]
  },
  {
    id:'aa', code:'AA', color:'#27AE60', name:'Analytics & Adoption',
    desc:'Do you measure adoption and continuously improve based on data insights?',
    qs:[
      { id:'AA1', title:'Job Execution & Adoption Metrics', qual:'Who tracks job execution times, feature adoption rates, and user engagement?', scoring:{ 1:'No formal tracking; anecdotal awareness', 2:'Basic reports generated ad-hoc', 3:'Monthly adoption reports; basic metrics', 4:'Dashboard with key adoption metrics; weekly reviews', 5:'Real-time adoption monitoring + predictive analytics' } },
      { id:'AA2', title:'User Proficiency Assessment', qual:'Do you assess user proficiency levels and provide targeted training?', scoring:{ 1:'No proficiency assessment; no targeted training', 2:'Annual training; basic competency checks', 3:'Proficiency survey; training for low-usage groups', 4:'Regular proficiency assessment; targeted coaching', 5:'AI-powered learning paths; personalized training + certification' } },
      { id:'AA3', title:'Feature Coverage & Utilization', qual:'What percentage of Workday features are actively used?', scoring:{ 1:'<50% feature utilization', 2:'50-65% utilization', 3:'65-75% utilization', 4:'75-85% utilization', 5:'>85% utilization; continuous innovation' } },
      { id:'AA4', title:'Business Process Optimization', qual:'Do you have KPIs for each major business process?', scoring:{ 1:'No formal KPIs; process-level metrics missing', 2:'KPIs for major processes only; annual review', 3:'KPIs for all major processes; quarterly review', 4:'KPIs tracked; monthly reporting & optimization', 5:'Real-time KPI dashboard; continuous process improvement' } },
      { id:'AA5', title:'Continuous Improvement Cadence', qual:'How often do you review metrics and iterate on processes?', scoring:{ 1:'Ad-hoc or annual reviews', 2:'Quarterly reviews', 3:'Quarterly reviews + semi-annual process optimization', 4:'Monthly reviews + monthly optimizations', 5:'Weekly reviews + continuous optimization' } },
      { id:'AA6', title:'Change Management Discipline', qual:'Do you have a formal change control process?', scoring:{ 1:'No formal change process; ad-hoc changes', 2:'Basic change board; loose documentation', 3:'Documented change process; change board meets monthly', 4:'Formal change board; all changes tracked & tested', 5:'Rigorous CAB process; automated testing + rollback capability' } }
    ]
  },
  {
    id:'gw', code:'GW', color:'#9B59B6', name:'Governance & Workforce Readiness',
    desc:'Are your teams skilled, empowered, and structured to operate AI-enabled processes?',
    qs:[
      { id:'GW1', title:'Cross-Functional AI Steering', qual:'Do you have a steering committee with cross-functional representation?', scoring:{ 1:'No steering committee', 2:'Informal steering; HR + IT only', 3:'Steering committee; HR, IT, Finance present', 4:'Active steering committee; meets monthly', 5:'Executive steering committee; strategic roadmap + budget approval' } },
      { id:'GW2', title:'Workday Centre of Excellence', qual:'Is there a dedicated CoE or functional lead for continuous improvement?', scoring:{ 1:'No CoE; no assigned responsibility', 2:'Part-time CoE lead; informal structure', 3:'Dedicated CoE; meets quarterly', 4:'Dedicated CoE team; monthly alignment', 5:'Mature CoE; embedded in operations + innovation pipeline' } },
      { id:'GW3', title:'Change Management & Communication', qual:'What is your formal change management process?', scoring:{ 1:'Informal communication; no change methodology', 2:'Email-based communication; basic documentation', 3:'Formal comms plan for major changes; stakeholder groups', 4:'Structured change methodology; town halls + training', 5:'Change management office; Prosci/ADKAR framework + analytics' } },
      { id:'GW4', title:'Skills & Capability Planning', qual:'Do you have a skills matrix and training plan?', scoring:{ 1:'No formal skills planning', 2:'Basic skills awareness; ad-hoc training', 3:'Skills matrix for core roles; annual training plan', 4:'Comprehensive skills matrix; quarterly training updates', 5:'AI-powered learning platform; personalized skills development' } },
      { id:'GW5', title:'Vendor Management & Roadmap Alignment', qual:'How frequently do you align with Workday on roadmaps?', scoring:{ 1:'Ad-hoc vendor contact', 2:'Annual business reviews', 3:'Semi-annual business reviews + roadmap discussion', 4:'Quarterly business reviews; aligned roadmap', 5:'Monthly strategic aligned; co-innovation with Workday' } },
      { id:'GW6', title:'Executive Sponsorship & Investment', qual:'Is there executive sponsorship and allocated budget?', scoring:{ 1:'No executive sponsorship; minimal budget', 2:'Basic sponsorship; budget allocated annually', 3:'Strong sponsorship; 3-year roadmap + annual budget', 4:'C-level sponsorship; strategic budget allocation', 5:'CEO-level sponsorship; transformational budget + innovation fund' } }
    ]
  }
];
