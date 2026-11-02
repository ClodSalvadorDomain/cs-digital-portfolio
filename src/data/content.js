// Single source of truth for everything the page says.
// Copy lives here so the components stay about behaviour.

export const CONTACT_EMAIL = 'clodsalvador.automations@gmail.com'

/* ── Featured reels ────────────────────────────────────────────
   Both clips are scroll-scrubbed. `notes` light up as the footage
   advances, so the copy tracks whatever is on screen.            */

export const reels = [
  {
    id: 'gretza-roman',
    client: 'Roman Homes & Loans · Florida',
    title: 'One licensed expert, two jobs, one site that proves it',
    src: '/assets/gretza-roman.mp4',
    srcMobile: '/assets/gretza-roman-m.mp4',
    poster: '/assets/gretza-roman-poster.jpg',
    live: 'https://floridarealtyandloans.com',
    chips: ['Custom design', 'Lead capture', 'Mortgage calculator', 'Real estate'],
    notes: [
      { at: 0.0, label: 'Opening', text: 'The offer lands in the first screen: buy and finance through one professional.' },
      { at: 0.3, label: 'The advantage', text: 'Agent and loan officer licences shown as a single point of contact, not two vendors.' },
      { at: 0.58, label: 'The tools', text: 'Payment estimator and loan matcher keep visitors on the page while they self-qualify.' },
      { at: 0.82, label: 'The person', text: 'Closes on Gretza herself, so the final impression is a human being, not a brand.' },
    ],
  },
  {
    id: 'el-arika',
    client: 'El Arika · Algeria',
    title: 'A furniture catalogue that sells in two languages',
    src: '/assets/el-arika.mp4',
    srcMobile: '/assets/el-arika-m.mp4',
    poster: '/assets/el-arika-poster.jpg',
    chips: ['E-commerce', 'EN / عربي', '3D configurator', 'Instalments'],
    notes: [
      { at: 0.0, label: 'Storefront', text: 'Eleven departments, countdown offers, and free-delivery flags all above the fold.' },
      { at: 0.26, label: 'Merchandising', text: 'Category circles and weekly deals give the catalogue a reason to be browsed, not searched.' },
      { at: 0.5, label: '3D designer', text: 'Pick a width and a finish, rotate the kitchen, then book a designer. The configurator is the lead magnet.' },
      { at: 0.76, label: 'Filtering', text: 'Price, width and style filters over a bilingual EN / عربي catalogue with 0% instalments on every product.' },
    ],
  },
]

/* ── Work grid ─────────────────────────────────────────────── */

export const work = {
  builds: [
    {
      kind: 'Website',
      client: 'Roman Homes & Loans',
      title: 'Real estate & loans brokerage website',
      body: 'Full-scale website for a dual-licensed real estate agent and loan officer, built to position one-stop home buying and financing in a single trust-building experience.',
      media: { type: 'video', src: '/assets/website-roman-homes-loans.mp4', poster: '/assets/website-roman-homes-loans-poster.jpg' },
      chips: ['Custom design', 'Lead capture', 'Real estate'],
    },
    {
      kind: 'Website',
      client: 'Yatai Spa',
      title: 'Luxury spa booking website',
      body: 'Elegant, booking-focused website for a luxury spa brand, designed to showcase services and convert visitors into scheduled appointments.',
      media: { type: 'video', src: '/assets/website-yatai-spa.mp4', poster: '/assets/website-yatai-spa-poster.jpg' },
      chips: ['Custom design', 'Booking flow', 'Hospitality'],
    },
    {
      kind: 'Sign-in page',
      client: 'Gibraltar Builders',
      title: 'Model home visitor sign-in portal',
      body: 'Premium visitor registration system for a luxury home builder. Captures buyer and realtor leads at model home events with instant CRM integration.',
      media: { type: 'video', src: '/assets/sign-in-page.mp4', poster: '/assets/sign-in-page-poster.jpg' },
      chips: ['Lead capture', 'CRM integration', 'Real estate'],
    },
    {
      kind: 'Sign-up page',
      client: 'Roman Homes & Loans',
      title: 'Wedding expo homebuyer sign-up page',
      body: "Event landing page that turns newly engaged couples at a wedding expo into homebuyer leads, trading a free homebuyer's guide for a booked one-on-one consultation.",
      media: { type: 'video', src: '/assets/wedding-expo-signup.mp4', poster: '/assets/wedding-expo-signup-poster.jpg' },
      chips: ['Event lead capture', 'Landing page', 'Real estate'],
    },
    {
      kind: 'Email HTML',
      client: 'Roman Homes & Loans',
      title: 'Custom HTML email template',
      body: 'Responsive, on-brand HTML email built for nurture sequences and campaign sends, designed to render cleanly across every major inbox client.',
      media: { type: 'image', src: '/assets/html-email.png' },
      chips: ['HTML email', 'Email marketing', 'Responsive'],
    },
    {
      kind: 'Funnel',
      client: 'Roman Homes & Loans',
      title: 'Lead magnet opt-in funnel',
      body: 'High-converting landing page funnel built to capture warm buyer leads in exchange for a free homebuying guide, feeding straight into an automated nurture sequence.',
      media: { type: 'image', src: '/assets/funnel-gretza.png' },
      chips: ['Lead magnet', 'Opt-in funnel', 'Real estate'],
    },
  ],
  systems: [
    {
      kind: 'AI powered',
      client: 'Social media automation',
      title: 'AI content repurposing pipeline',
      body: 'Takes a single piece of source content and uses AI to repurpose it into multiple platform-ready formats, automatically publishing across channels with zero manual editing.',
      media: { type: 'image', src: '/assets/automation-content-repurposing.png' },
      chips: ['AI', 'Zapier', 'Social media'],
    },
    {
      kind: 'AI chat agent',
      client: 'Customer service automation',
      title: 'Facebook Page AI chat agent',
      body: 'AI-powered chat agent that responds to Facebook Page messages instantly, qualifies leads, and answers common questions 24/7 without a human on standby.',
      media: { type: 'image', src: '/assets/automation-fb-chat-agent.png' },
      chips: ['AI', 'Facebook', 'Chatbot'],
    },
    {
      kind: 'Lead scoring',
      client: 'Sales automation',
      title: 'Lead enrichment & scoring pipeline',
      body: 'Incoming leads are automatically enriched with company and contact data, scored by priority, and routed to the right follow-up path. No manual research or triage.',
      media: { type: 'image', src: '/assets/automation-lead-enrichment.png' },
      chips: ['Apollo.io', 'Make.com', 'Lead scoring'],
    },
    {
      kind: 'Email marketing',
      client: 'Email marketing automation',
      title: 'Drip email campaign system',
      body: 'Automated nurture sequence that sends timed, personalized emails to new leads, building trust and driving conversions without any manual sending.',
      media: { type: 'image', src: '/assets/automation-drip-email-campaign.png' },
      chips: ['Email automation', 'Nurture sequence', 'CRM'],
    },
    {
      kind: 'Inbox automation',
      client: 'Inbox automation',
      title: 'Gmail sorting & response automation',
      body: 'Automatically sorts, labels, and routes incoming Gmail messages, triggering the right follow-up action so nothing sits in the inbox unhandled.',
      media: { type: 'image', src: '/assets/automation-gmail.png' },
      chips: ['Gmail', 'Zapier', 'Automation'],
    },
    {
      kind: 'Project management',
      client: 'Project management automation',
      title: 'Asana task & project sync automation',
      body: 'Automated workflow that keeps Asana tasks in sync with connected tools, eliminating manual updates and keeping project status current across every system.',
      media: { type: 'image', src: '/assets/automation-asana.png' },
      chips: ['Asana', 'Make.com', 'Automation'],
    },
  ],
}

/* ── Composer blocks ───────────────────────────────────────────
   `hours` are estimates, shown to the visitor as estimates. They
   exist to start a conversation, not to make a promise.          */

// `clause` is the fragment the spec sentence is stitched from. Lowercasing
// a node label to build prose produces things like "ai first reply all
// happen", so each block carries its own readable clause instead.
export const blocks = [
  { id: 'site', node: 'Website / funnel', kind: 'trigger', name: 'A site or funnel that captures leads', note: 'Every enquiry lands in one place instead of five', clause: 'it is captured properly instead of lost in a DM', hours: 4 },
  { id: 'reply', node: 'AI first reply', kind: 'step', name: 'Instant AI reply to every new lead', note: 'Answers and qualifies in seconds, day or night', clause: 'they get an answer within seconds, day or night', hours: 9 },
  { id: 'enrich', node: 'Enrich & score', kind: 'step', name: 'Lead enrichment and scoring', note: 'Company data attached, priority assigned, no manual research', clause: 'their details are enriched and scored by priority', hours: 6 },
  { id: 'crm', node: 'CRM sync', kind: 'step', name: 'CRM and pipeline kept in sync', note: 'Stages move themselves as things actually happen', clause: 'your CRM and pipeline update themselves', hours: 5 },
  { id: 'nurture', node: 'Drip sequence', kind: 'step', name: 'Automated nurture sequence', note: 'Timed, personalised follow-up until they are ready', clause: 'a personalised nurture sequence starts on its own', hours: 7 },
  { id: 'inbox', node: 'Inbox routing', kind: 'step', name: 'Inbox sorting and routing', note: 'Labelled, routed, and actioned before you open it', clause: 'the message is labelled and routed before you open it', hours: 5 },
  { id: 'content', node: 'Repurpose & post', kind: 'step', name: 'Content repurposing and auto-publishing', note: 'One piece of content becomes a week of posts', clause: 'your content is repurposed and published across channels', hours: 8 },
  { id: 'tasks', node: 'Task sync', kind: 'step', name: 'Project and task sync', note: 'Asana, ClickUp and Sheets stop disagreeing with each other', clause: 'your task boards stay in sync with each other', hours: 4 },
  { id: 'digest', node: 'Daily digest', kind: 'out', name: 'A daily digest of what happened', note: 'One message each morning instead of six dashboards', clause: 'it all lands in one morning digest', hours: 3 },
]

/* ── Services ──────────────────────────────────────────────── */

export const services = [
  {
    title: 'AI-powered websites & funnels',
    body: 'Websites and lead-generation funnels with AI-driven follow-up built in, so every visitor gets nurtured toward a sale automatically, not left to go cold.',
  },
  {
    title: 'Workflow automation',
    body: 'Zapier, Make.com, and n8n automations that connect your apps and make sure every lead, task, and follow-up happens on time, every time, with zero manual work.',
  },
  {
    title: 'AI chat agents & lead response',
    body: 'AI chat agents that respond to leads within seconds on your website and social pages, qualify them, and hand off only the ones ready to buy.',
  },
  {
    title: 'Lead enrichment & scoring',
    body: 'Incoming leads are automatically enriched, scored by priority, and routed to the right follow-up path, so your team spends time closing, not chasing.',
  },
  {
    title: 'Social media automation',
    body: 'AI pipelines that take your raw content and repurpose it into ready-to-post captions, auto-publishing to Facebook, Instagram, and beyond.',
  },
  {
    title: 'Email & CRM automation',
    body: 'Drip email sequences, inbox automation, and CRM syncs that keep every lead warm and every task tracked without you lifting a finger.',
  },
]

/* ── Tools ─────────────────────────────────────────────────── */

export const tools = [
  { name: 'n8n', icon: '/assets/tools/n8n.svg' },
  { name: 'Make.com', icon: '/assets/tools/make.svg' },
  { name: 'Zapier', icon: '/assets/tools/zapier.svg' },
  { name: 'Claude', icon: '/assets/tools/claude.svg' },
  { name: 'OpenAI', icon: '/assets/tools/openai.svg' },
  { name: 'GoHighLevel', icon: '/assets/tools/gohighlevel.svg' },
]

/* ── Counters ──────────────────────────────────────────────── */

export const counters = [
  { to: 12, suffix: '+', label: 'Systems delivered' },
  { to: 100, suffix: '%', label: 'Client retention' },
  { to: 40, suffix: '+ hrs', label: 'Saved per client monthly' },
]

/* ── Hero reasoning trace ──────────────────────────────────────
   Deliberately describes what this page is doing, not a fake
   client job. Nothing here claims to be a live computation.      */

export const traceLines = [
  { tag: 'load', text: 'reading visitor intent', ms: '0.12s' },
  { tag: 'match', text: 'surfacing 2 featured builds', ms: '0.31s' },
  { tag: 'plan', text: 'drafting an automation shortlist', ms: '0.44s' },
  { tag: 'build', text: 'assembling pipeline preview', ms: '0.67s' },
  { tag: 'ready', text: 'waiting for you to pick a bottleneck', ms: '0.80s', kind: 'done' },
]
