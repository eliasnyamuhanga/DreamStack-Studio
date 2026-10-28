import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, Bot, Check, ChevronDown, Code2,
  Cpu, Globe2, Layers3, Menu, MessageCircle, MonitorSmartphone, Palette,
  Send, ShieldCheck, Sparkles, Terminal, X, Zap, UserRound, LogIn, UserPlus,
  ImagePlus, LogOut, Mail, Github, Linkedin, Instagram
} from 'lucide-react';

const services = [
  { icon: Globe2, n: '01', title: 'Website development', text: 'Fast, responsive websites that turn visitors into customers.', tags: ['Business websites', 'Landing pages', 'E-commerce'] },
  { icon: MonitorSmartphone, n: '02', title: 'Mobile & web apps', text: 'Useful digital products built around the people who use them.', tags: ['Web applications', 'Mobile-ready apps', 'Dashboards'] },
  { icon: Bot, n: '03', title: 'AI & automation', text: 'Smarter workflows, helpful chatbots, and AI-powered experiences.', tags: ['AI chatbots', 'Workflow automation', 'Integrations'] },
  { icon: Palette, n: '04', title: 'UI/UX & branding', text: 'Distinctive interfaces and brand identities that feel effortless.', tags: ['Product design', 'Brand identity', 'Prototypes'] },
  { icon: ShieldCheck, n: '05', title: 'IT support & security', text: 'Practical technical assistance to keep your systems running.', tags: ['Troubleshooting', 'Security guidance', 'Maintenance'] },
  { icon: Layers3, n: '06', title: 'Cloud & systems', text: 'Connected, maintainable digital foundations for growing teams.', tags: ['APIs', 'Database setup', 'Deployment'] }
];
// Configure these before publishing. Use international format without + or spaces for WhatsApp.
const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '');
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

const starterMessages = [
  { role: 'assistant', text: "Hey there! 👋 I'm StackBot, DreamStack's virtual assistant. Tell me what you're trying to build or what tech issue you're facing, and I'll help you find the next step." }
];

function Logo({ onClick }) {
  return <button className="brand" onClick={onClick} aria-label="DreamStack home">
    <span className="brand-mark"><span className="mark-core">D</span><i /><b /></span>
    <span className="brand-copy"><strong>dream<span>stack</span></strong><small>DIGITAL STUDIO</small></span>
  </button>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState(starterMessages);
  const [chatInput, setChatInput] = useState('');
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('dreamstack-user')); } catch { return null; } });
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signup');
  const [authError, setAuthError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [avatar, setAvatar] = useState('');
  const [toast, setToast] = useState('');
  const [projectForm, setProjectForm] = useState({ name: '', email: '', type: 'Website development', details: '' });
  const [projectSent, setProjectSent] = useState(false);
  const avatarInput = useRef(null);
  const chatEnd = useRef(null);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, chatOpen]);
  useEffect(() => { if (toast) { const timer = setTimeout(() => setToast(''), 3200); return () => clearTimeout(timer); } }, [toast]);

  const goTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); };
  const openAuth = (mode = 'signup') => { setAuthMode(mode); setAuthError(''); setAuthOpen(true); setMenuOpen(false); };
  const submitAuth = (e) => {
    e.preventDefault(); setAuthError('');
    const email = form.email.trim().toLowerCase();
    if (form.password.length < 6) return setAuthError('Use a password with at least 6 characters.');
    try {
      const accounts = JSON.parse(localStorage.getItem('dreamstack-accounts') || '{}');
      if (authMode === 'signup') {
        if (!form.name.trim()) return setAuthError('Please enter your name.');
        if (accounts[email]) return setAuthError('An account with this email already exists. Try logging in.');
        const account = { name: form.name.trim(), email, password: form.password, avatar };
        accounts[email] = account;
        localStorage.setItem('dreamstack-accounts', JSON.stringify(accounts));
        const publicUser = { name: account.name, email, avatar };
        localStorage.setItem('dreamstack-user', JSON.stringify(publicUser)); setUser(publicUser);
        setToast('Welcome to DreamStack! Your local demo account is ready.');
      } else {
        const account = accounts[email];
        if (!account || account.password !== form.password) return setAuthError('Email or password is incorrect, or the account does not exist on this browser.');
        const publicUser = { name: account.name, email, avatar: account.avatar || '' };
        localStorage.setItem('dreamstack-user', JSON.stringify(publicUser)); setUser(publicUser);
        setToast(`Welcome back, ${publicUser.name}!`);
      }
      setAuthOpen(false); setForm({ name: '', email: '', password: '' }); setAvatar('');
    } catch { setAuthError('Could not save your demo account in this browser.'); }
  };
  const logout = () => { localStorage.removeItem('dreamstack-user'); setUser(null); setToast('You have been logged out.'); };
  const chooseAvatar = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (!file.type.startsWith('image/')) return setAuthError('Choose an image file.');
    if (file.size > 1_500_000) return setAuthError('Please choose an image smaller than 1.5 MB.');
    const reader = new FileReader(); reader.onload = () => setAvatar(String(reader.result)); reader.readAsDataURL(file);
  };

  const sendChat = (e, suggested) => {
    e?.preventDefault();
    const text = (suggested || chatInput).trim(); if (!text) return;
    const lower = text.toLowerCase();
    let answer = "Thanks for sharing that. A good first step is to define the goal, who will use it, and what success looks like. DreamStack can help plan the solution, choose the right tools, and break the work into clear steps. What is your budget and preferred deadline?";
    if (/price|cost|budget|how much/.test(lower)) answer = "Project cost depends on scope, features, integrations, and timeline. To get a useful estimate, tell us what you need, which features are essential, and your target budget. Use the project form and our team can follow up.";
    else if (/website|web site|landing page/.test(lower)) answer = "For a strong website, start with your main goal, key pages, brand style, and contact method. We can help with responsive design, development, SEO basics, and deployment. Is it a business site, portfolio, online store, or something else?";
    else if (/app|application|mobile/.test(lower)) answer = "Let's shape your app idea! Identify the main user problem, the core 3–5 features, and whether you need web, Android/iOS, or both. Then build a small first version, test it, and improve it based on feedback.";
    else if (/chatbot|ai|automation/.test(lower)) answer = "AI can support customer service, FAQs, lead collection, document search, and repetitive workflows. The right setup depends on your data, privacy needs, and the channels you use. What task would you like the AI to handle?";
    else if (/error|bug|broken|not working|problem/.test(lower)) answer = "I can help troubleshoot. Share the exact error message, what you were trying to do, the technology or device involved, and what changed before the issue started. Avoid sharing passwords, API keys, or private customer data.";
    else if (/security|hack|virus|secure/.test(lower)) answer = "Start by updating software, enabling multi-factor authentication, using unique passwords, backing up important data, and reviewing account access. If a system may be actively compromised, isolate it where safe and contact a qualified security professional.";
    else if (/hello|hi |hey|habari|mambo/.test(lower)) answer = "Hi! 👋 Welcome to DreamStack. I can help you explore websites, apps, AI chatbots, design, IT support, and more. What are you working on today?";
    setMessages(prev => [...prev, { role: 'user', text }, { role: 'assistant', text: answer }]); setChatInput('');
  };
  const submitProject = async (e) => {
    e.preventDefault();
    const payload = { ...projectForm, createdAt: new Date().toISOString() };
    const submittedAt = new Date(payload.createdAt).toLocaleString();
    const whatsappMessage = [
      'Hello DreamStack Studio! I would like to request a service.',
      '',
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Service: ${payload.type}`,
      `Project details: ${payload.details}`,
      `Submitted: ${submittedAt}`
    ].join('\n');

    try {
      const requests = JSON.parse(localStorage.getItem('dreamstack-project-requests') || '[]');
      requests.push(payload);
      localStorage.setItem('dreamstack-project-requests', JSON.stringify(requests));
    } catch {
      setToast('Your browser could not save a local backup. Continue using WhatsApp or email if configured.');
    }

    let whatsappOpened = false;
    if (WHATSAPP_NUMBER && WHATSAPP_NUMBER.length >= 10) {
      // Open directly from the form submit action to reduce popup-blocker issues.
      const whatsappWindow = window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`, '_blank', 'noopener,noreferrer');
      whatsappOpened = Boolean(whatsappWindow);
    }

    const emailConfigured = Boolean(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY);
    let emailSent = false;
    if (emailConfigured) {
      try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id: EMAILJS_SERVICE_ID,
            template_id: EMAILJS_TEMPLATE_ID,
            user_id: EMAILJS_PUBLIC_KEY,
            template_params: {
              customer_name: payload.name,
              customer_email: payload.email,
              service_type: payload.type,
              project_details: payload.details,
              submitted_at: submittedAt
            }
          })
        });
        if (!response.ok) throw new Error('Email notification failed');
        emailSent = true;
      } catch {
        setToast('The request was saved locally, but email notification failed. Check EmailJS settings.');
      }
    }

    setProjectSent(true);
    setProjectForm({ name: '', email: '', type: 'Website development', details: '' });

    if (whatsappOpened && emailSent) setToast('WhatsApp opened and email notification sent. Finish sending the message in WhatsApp.');
    else if (whatsappOpened) setToast(emailConfigured ? 'WhatsApp opened. Finish sending the message there; email notification may need checking.' : 'WhatsApp opened with your request. Finish sending the message there.');
    else if (emailSent) setToast('Email notification sent. Add your WhatsApp number to enable WhatsApp requests too.');
    else setToast('Request saved in this browser only. Configure WhatsApp and/or EmailJS in the .env file to deliver it to DreamStack.');
  };

  return <div className="app-shell">
    <div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <header className="topbar">
      <div className="container nav-inner">
        <Logo onClick={() => goTo('home')} />
        <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
          <button onClick={() => goTo('services')}>Services</button><button onClick={() => goTo('work')}>Our approach</button><button onClick={() => goTo('about')}>About</button><button onClick={() => goTo('contact')}>Contact</button>
          <div className="mobile-nav-actions">{user ? <button onClick={logout}>Log out</button> : <button onClick={() => openAuth('login')}>Log in</button>}<button className="mobile-cta" onClick={() => goTo('contact')}>Start a project <ArrowUpRight size={15}/></button></div>
        </nav>
        <div className="nav-actions">
          {user ? <button className="profile-pill" onClick={() => setToast(`${user.name} · ${user.email}`)}>{user.avatar ? <img src={user.avatar} alt="" /> : <span className="avatar-fallback"><UserRound size={15}/></span>}<span>{user.name.split(' ')[0]}</span><button className="logout-icon" aria-label="Log out" onClick={(e) => {e.stopPropagation(); logout();}}><LogOut size={14}/></button></button> : <button className="login-btn" onClick={() => openAuth('login')}>Log in</button>}
          <button className="nav-cta" onClick={() => goTo('contact')}>Let's talk <ArrowUpRight size={16}/></button>
        </div>
        <button className="menu-toggle" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
      </div>
    </header>

    <main>
      <section className="hero container" id="home">
        <div className="hero-copy">
          <div className="eyebrow"><span className="status-dot" /> YOUR IDEAS. OUR TECHNOLOGY. <span className="eyebrow-line" /></div>
          <h1>We turn big ideas<br/>into <span className="gradient-text">digital reality.</span></h1>
          <p className="hero-description">Your technology partner for websites, apps, AI experiences, and the digital solutions that move your business forward.</p>
          <div className="hero-actions"><button className="button-primary" onClick={() => goTo('contact')}>Build something great <ArrowUpRight size={18}/></button><button className="button-quiet" onClick={() => goTo('services')}>Explore our services <ArrowDownRight size={17}/></button></div>
          <div className="hero-trust"><div className="trust-avatars"><span>D</span><span>S</span><span>+</span></div><p><strong>One team. Many possibilities.</strong><small>From first idea to launch day.</small></p></div>
        </div>
        <div className="hero-visual" aria-label="DreamStack digital technology illustration">
          <div className="visual-grid" />
          <div className="orbit orbit-a" /><div className="orbit orbit-b" /><div className="orbit orbit-c" />
          <div className="hero-core"><div className="core-symbol"><span>D</span><i /></div><span className="core-label">DREAMSTACK</span><small>BUILD · CREATE · GROW</small></div>
          <div className="float-card code-card"><div className="card-top"><span/><span/><span/><small>dreamstack.jsx</small></div><div className="code-lines"><i/><b/><em/><i/><b/><em/><i/></div><div className="code-footer"><span className="tiny-green"/> All systems creative</div></div>
          <div className="float-card ai-card"><span className="ai-icon"><Sparkles size={17}/></span><div><strong>AI-powered ideas</strong><small>Human-first technology</small></div><span className="pulse-dot"/></div>
          <div className="float-card metric-card"><span className="metric-icon"><Zap size={15}/></span><div><strong>Made for impact</strong><small>Thoughtful. Modern. Scalable.</small></div></div>
          <div className="visual-caption"><span>01 / DIGITAL POSSIBILITIES</span><span>SCROLL TO EXPLORE ↓</span></div>
        </div>
        <div className="hero-bottomline"><span>WEB DEVELOPMENT</span><i/><span>PRODUCT DESIGN</span><i/><span>AI & AUTOMATION</span><i/><span>IT SOLUTIONS</span></div>
      </section>

      <section className="marquee-band"><div className="marquee-track"><span>IDEAS INTO IMPACT <Sparkles/></span><i>✳</i><span>DESIGN WITH PURPOSE <Sparkles/></span><i>✳</i><span>TECH THAT WORKS <Sparkles/></span><i>✳</i><span>IDEAS INTO IMPACT <Sparkles/></span><i>✳</i></div></section>

      <section className="section container" id="services">
        <div className="section-heading"><div><div className="eyebrow"><span className="section-number">01</span> WHAT WE DO</div><h2>Everything you need<br/>to <span className="gradient-text">build what's next.</span></h2></div><p>We bring design, engineering, and practical problem-solving together to make technology work for you.</p></div>
        <div className="services-grid">{services.map((service) => { const Icon = service.icon; return <article className="service-card" key={service.n}><div className="service-card-top"><span className="service-icon"><Icon size={21}/></span><span className="service-number">{service.n}</span></div><h3>{service.title}</h3><p>{service.text}</p><div className="service-tags">{service.tags.map(tag => <span key={tag}>{tag}</span>)}</div><button className="card-arrow" aria-label={`Ask about ${service.title}`} onClick={() => { setChatOpen(true); setChatInput(`I need help with ${service.title.toLowerCase()}.`); }}><ArrowUpRight size={18}/></button></article>; })}</div>
      </section>

      <section className="manifesto" id="work"><div className="container manifesto-inner"><div className="manifesto-left"><div className="eyebrow"><span className="section-number">02</span> THE DREAMSTACK WAY</div><h2>Not just code.<br/><span className="gradient-text">A better way forward.</span></h2><p>Great technology starts with listening. We work alongside you to understand the challenge, map a clear path, and create a solution that can grow with your goals.</p><button className="button-primary" onClick={() => goTo('contact')}>Let's shape your idea <ArrowUpRight size={18}/></button></div><div className="process-list"><div className="process-item"><span className="process-no">01</span><div><h3>Discover</h3><p>We learn about your goals, users, challenges, and vision.</p></div><span className="process-icon"><MessageCircle size={20}/></span></div><div className="process-item"><span className="process-no">02</span><div><h3>Design & build</h3><p>We plan, prototype, develop, and keep you in the loop.</p></div><span className="process-icon"><Code2 size={20}/></span></div><div className="process-item"><span className="process-no">03</span><div><h3>Launch & improve</h3><p>We help you ship confidently and make your solution better over time.</p></div><span className="process-icon"><Zap size={20}/></span></div></div></div></section>

      <section className="section about-section container" id="about"><div className="about-art"><div className="about-ring ring-one"/><div className="about-ring ring-two"/><div className="about-center"><Terminal size={38}/><span>BUILD THE FUTURE</span></div><div className="about-chip chip-one"><Cpu size={15}/> ENGINEERING</div><div className="about-chip chip-two"><Palette size={15}/> CREATIVITY</div><div className="about-chip chip-three"><Sparkles size={15}/> INNOVATION</div></div><div className="about-copy"><div className="eyebrow"><span className="section-number">03</span> A LITTLE ABOUT US</div><h2>Curious minds.<br/><span className="gradient-text">Useful technology.</span></h2><p>DreamStack Studio is a technology team built around a simple belief: the right digital solution can help people and businesses do more. We combine creativity, technical skills, and a collaborative mindset to solve real problems.</p><p>Whether you're starting from a blank page or improving an existing system, we're here to make the complex feel clear.</p><div className="about-points"><span><Check size={15}/> Clear communication</span><span><Check size={15}/> User-first thinking</span><span><Check size={15}/> Practical solutions</span><span><Check size={15}/> Room to grow</span></div></div></section>

      <section className="contact-section" id="contact"><div className="container contact-inner"><div className="contact-copy"><div className="eyebrow"><span className="section-number">04</span> HAVE A CHALLENGE?</div><h2>Let's make your<br/><span className="gradient-text">next idea happen.</span></h2><p>Tell us what you're imagining. Big project, small fix, or just an early idea — we're ready to listen.</p><div className="contact-detail"><span className="contact-detail-icon"><Mail size={18}/></span><div><small>START A CONVERSATION</small><strong>Use the project form</strong><span>Share a few details and we'll take it from there.</span></div></div><div className="contact-detail"><span className="contact-detail-icon"><MessageCircle size={18}/></span><div><small>NEED A QUICK ANSWER?</small><strong>Chat with StackBot</strong><span>Get help exploring your options, any time.</span></div></div></div>
      <form className="project-form" onSubmit={submitProject}><div className="form-header"><div><span className="form-kicker">YOUR PROJECT STARTS HERE</span><h3>Tell us about it.</h3></div><span className="form-spark"><Sparkles size={21}/></span></div>{projectSent && <div className="form-success"><Check size={17}/> Thanks! Continue in WhatsApp to send your request. Email notification is enabled after EmailJS setup.</div>}<div className="form-row"><label>Your name<input required value={projectForm.name} onChange={e => setProjectForm({...projectForm, name:e.target.value})} placeholder="Jane Doe"/></label><label>Email address<input required type="email" value={projectForm.email} onChange={e => setProjectForm({...projectForm, email:e.target.value})} placeholder="jane@example.com"/></label></div><label>What can we help with?<span className="select-wrap"><select value={projectForm.type} onChange={e => setProjectForm({...projectForm, type:e.target.value})}><option>Website development</option><option>Mobile & web apps</option><option>AI & automation</option><option>UI/UX & branding</option><option>IT support & security</option><option>Cloud & systems</option><option>Something else</option></select><ChevronDown size={16}/></span></label><label>Tell us a little more<textarea required minLength={10} value={projectForm.details} onChange={e => setProjectForm({...projectForm, details:e.target.value})} placeholder="What are you trying to build, fix, or improve?" rows="4"/></label><button className="button-primary form-submit" type="submit">Send project request <ArrowUpRight size={18}/></button><p className="form-note"><ShieldCheck size={13}/> Submitting opens WhatsApp with your request. Email notifications require EmailJS configuration.</p></form></div></section>
    </main>

    <footer className="footer"><div className="container footer-main"><div className="footer-brand"><Logo onClick={() => goTo('home')}/><p>Thoughtful technology.<br/>Bold ideas. Real-world impact.</p></div><div className="footer-links"><div><span>EXPLORE</span><button onClick={() => goTo('services')}>Services</button><button onClick={() => goTo('work')}>Our approach</button><button onClick={() => goTo('about')}>About us</button></div><div><span>LET'S CONNECT</span><button onClick={() => goTo('contact')}>Start a project <ArrowUpRight size={13}/></button><button onClick={() => setChatOpen(true)}>Chat with StackBot <MessageCircle size={13}/></button><button onClick={() => openAuth('signup')}>Create an account <UserPlus size={13}/></button></div></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} DreamStack Studio. Built with intention.</span><span className="footer-status"><i/> MADE FOR WHAT'S NEXT</span><button onClick={() => goTo('home')}>BACK TO TOP ↑</button></div></footer>

    <button className="chat-launcher" onClick={() => setChatOpen(!chatOpen)} aria-label={chatOpen ? 'Close chat' : 'Chat with StackBot'}>{chatOpen ? <X size={23}/> : <><span className="chat-launcher-icon"><Bot size={22}/></span><span className="chat-launcher-label">Ask StackBot</span><span className="chat-launcher-ping"/></>}</button>
    {chatOpen && <aside className="chat-panel" aria-label="StackBot chatbot"><div className="chat-head"><div className="chat-bot-avatar"><Bot size={21}/><i/></div><div><strong>StackBot <span>AI ASSISTANT</span></strong><small><i/> Here to help you get started</small></div><button onClick={() => setChatOpen(false)} aria-label="Close chatbot"><X size={18}/></button></div><div className="chat-messages">{messages.map((m,i) => <div className={`chat-message ${m.role}`} key={i}><div className="message-avatar">{m.role === 'assistant' ? <Sparkles size={13}/> : <UserRound size={13}/>}</div><p>{m.text}</p></div>)}<div ref={chatEnd}/></div>{messages.length === 1 && <div className="chat-suggestions"><button onClick={() => sendChat(null,'I need a website for my business.')}>I need a website <ArrowUpRight size={12}/></button><button onClick={() => sendChat(null,'I have a technical issue.')}>Fix a tech issue <ArrowUpRight size={12}/></button><button onClick={() => sendChat(null,'Tell me about AI chatbots.')}>Explore AI chatbots <ArrowUpRight size={12}/></button></div>}<form className="chat-input-row" onSubmit={sendChat}><input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Ask us anything..." aria-label="Chat message"/><button aria-label="Send message" type="submit"><Send size={17}/></button></form><div className="chat-disclaimer">StackBot offers general guidance, not a live human or a connected AI service.</div></aside>}

    {authOpen && <div className="modal-backdrop" onMouseDown={e => {if(e.target === e.currentTarget) setAuthOpen(false);}}><section className="auth-modal" role="dialog" aria-modal="true" aria-label={authMode === 'signup' ? 'Create account' : 'Log in'}><button className="modal-close" onClick={() => setAuthOpen(false)} aria-label="Close"><X size={19}/></button><div className="auth-logo"><Logo onClick={() => setAuthOpen(false)}/></div><div className="auth-symbol"><UserRound size={24}/></div><div className="auth-eyebrow">{authMode === 'signup' ? 'JOIN THE COMMUNITY' : 'GOOD TO HAVE YOU BACK'}</div><h2>{authMode === 'signup' ? 'Create your account.' : 'Welcome back.'}</h2><p className="auth-subtitle">{authMode === 'signup' ? 'Save your profile and make your next idea happen.' : 'Log in to your DreamStack demo profile.'}</p><form onSubmit={submitAuth}>{authMode === 'signup' && <><input required value={form.name} onChange={e => setForm({...form,name:e.target.value})} placeholder="Your full name" autoComplete="name"/><div className="avatar-upload"><button type="button" className="avatar-preview" onClick={() => avatarInput.current?.click()}>{avatar ? <img src={avatar} alt="Profile preview"/> : <ImagePlus size={22}/>}</button><div><strong>Profile picture <span>OPTIONAL</span></strong><small>Choose an image up to 1.5 MB</small><button type="button" onClick={() => avatarInput.current?.click()} className="upload-link">{avatar ? 'Change picture' : 'Upload a picture'}</button><input ref={avatarInput} type="file" accept="image/*" hidden onChange={chooseAvatar}/></div></div></>}<input required type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} placeholder="Email address" autoComplete="email"/><input required type="password" minLength="6" value={form.password} onChange={e => setForm({...form,password:e.target.value})} placeholder="Password (at least 6 characters)" autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'}/>{authError && <p className="auth-error">{authError}</p>}<button className="button-primary auth-submit" type="submit">{authMode === 'signup' ? 'Create account' : 'Log in'} <ArrowRight size={17}/></button></form><p className="auth-switch">{authMode === 'signup' ? 'Already have an account?' : "Don't have an account?"} <button onClick={() => {setAuthMode(authMode === 'signup' ? 'login' : 'signup'); setAuthError('');}}> {authMode === 'signup' ? 'Log in' : 'Sign up'}</button></p><div className="auth-demo-note"><ShieldCheck size={14}/> Demo authentication stores data in this browser only. Don't use a real password.</div></section></div>}
    {toast && <div className="toast"><Check size={16}/>{toast}<button onClick={() => setToast('')} aria-label="Dismiss"><X size={14}/></button></div>}
  </div>;
}

export default App;