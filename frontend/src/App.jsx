import { useEffect, useState } from 'react';
import {
  FaGithub,
  FaLinkedinIn,
  FaInstagram,
  FaMoon,
  FaSun,
  FaDownload,
  FaPaperPlane,
  FaCode,
  FaServer,
  FaBolt,
  FaReact,
  FaPython,
  FaDatabase,
  FaGitAlt
} from 'react-icons/fa';

const API_BASE = 'http://127.0.0.1:8000/api';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [portfolio, setPortfolio] = useState(null);
  const [resumeAvailable, setResumeAvailable] = useState(false);
  const [resumeInfo, setResumeInfo] = useState(null);
  const [status, setStatus] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [portfolioRes, resumeRes] = await Promise.all([
          fetch(`${API_BASE}/portfolio/`),
          fetch(`${API_BASE}/resume/`)
        ]);

        const portfolioData = await portfolioRes.json();
        const resumeData = await resumeRes.json();

        setPortfolio(portfolioData);
        setResumeAvailable(!!resumeData.available);
        setResumeInfo(resumeData);

        document.title = `${portfolioData.name} | Full Stack Developer`;
      } catch (error) {
        console.error(error);
        setStatus('Failed to load portfolio data');
      }
    };

    loadData();
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const response = await fetch(`${API_BASE}/contact/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const result = await response.json();

      if (response.ok) {
        setStatus('Message sent successfully!');
        setForm({
          name: '',
          email: '',
          message: ''
        });
      } else {
        setStatus(result.error || 'Something went wrong');
      }
    } catch (error) {
      setStatus('Network error');
    }
  };

  if (!portfolio) {
    return <div className="loading">Loading portfolio...</div>;
  }

  const socials = portfolio.socials || {};
  const featuredProjects = portfolio.featured_projects || [];
  const allProjects = portfolio.projects || [];
  const techStack = portfolio.tech_stack || [];

  const techIconMap = {
    Frontend: <FaReact />,
    Backend: <FaServer />,
    'Machine Learning': <FaBolt />,
    Tools: <FaGitAlt />,
    Database: <FaDatabase />
  };

  return (
    <div className="app-shell">
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />

      <header className="topbar">
        <div className="brand">
          <span className="brand-dot"></span>
          <span>{portfolio.name}</span>
        </div>

        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <FaSun /> : <FaMoon />}
        </button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            {portfolio.open_to_work && (
              <div className="open-badge">Open to Work 🚀</div>
            )}

            <p className="eyebrow">{portfolio.role}</p>
            <h1>{portfolio.name}</h1>
            <p className="tagline">{portfolio.tagline}</p>
            <p className="about-text">{portfolio.about}</p>

            <div className="hero-actions">
              <a href="#contact" className="btn primary">
                <FaPaperPlane /> Hire Me
              </a>

              {resumeAvailable && (
                <a href={`${API_BASE}/resume/download/`} className="btn secondary">
                  <FaDownload /> Download Resume
                </a>
              )}
            </div>

            <div className="social-row">
              <a href={socials.github} target="_blank" rel="noreferrer" className="social-btn">
                <FaGithub /> GitHub
              </a>
              <a href={socials.linkedin} target="_blank" rel="noreferrer" className="social-btn">
                <FaLinkedinIn /> LinkedIn
              </a>
              <a href={socials.instagram} target="_blank" rel="noreferrer" className="social-btn">
                <FaInstagram /> Instagram
              </a>
            </div>
          </div>

          <div className="hero-card">
            <div className="profile-badge">CS</div>
            <h3>Final Year Student</h3>
            <p>React • Django • Python • JavaScript</p>

            <div className="mini-stats">
              <div className="mini-stat">
                <FaCode />
                <span>Frontend</span>
              </div>
              <div className="mini-stat">
                <FaServer />
                <span>Backend</span>
              </div>
              <div className="mini-stat">
                <FaBolt />
                <span>AI/ML</span>
              </div>
            </div>

            <div className="resume-counter">
              <strong>{resumeInfo?.download_count ?? 0}</strong>
              <span>Resume Downloads</span>
            </div>
          </div>
        </section>

        <section className="glass-section">
          <h2>Tech Stack</h2>
          <div className="tech-grid">
            {techStack.map((group, index) => (
              <div className="tech-card" key={index}>
                <div className="tech-card-head">
                  <span className="tech-icon">
                    {techIconMap[group.category] || <FaCode />}
                  </span>
                  <h3>{group.category}</h3>
                </div>

                <div className="tech-pills">
                  {group.items.map((item, itemIndex) => (
                    <span className="tech-pill" key={itemIndex}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-section">
          <h2>Featured Projects</h2>
          <div className="projects-grid featured-grid">
            {featuredProjects.map((project, index) => (
              <article className="project-card featured-card" key={index}>
                <div className="project-top">
                  <span className="project-index">FEATURED {index + 1}</span>
                  <h3>{project.title}</h3>
                </div>
                <p>{project.description}</p>
                <div className="project-tech">{project.tech}</div>
                <a href={project.link} target="_blank" rel="noreferrer">
                  View Project →
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="glass-section">
          <h2>Projects</h2>
          <div className="projects-grid">
            {allProjects.map((project, index) => (
              <article className="project-card" key={index}>
                <div className="project-top">
                  <span className="project-index">0{index + 1}</span>
                  <h3>{project.title}</h3>
                </div>
                <p>{project.description}</p>
                <div className="project-tech">{project.tech}</div>
                <a href={project.link} target="_blank" rel="noreferrer">
                  View Project →
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="glass-section" id="contact">
          <h2>Contact Me</h2>
          <div className="contact-grid">
            <form className="contact-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
              />
              <textarea
                name="message"
                placeholder="Your Message"
                rows="5"
                value={form.message}
                onChange={handleChange}
              />
              <button type="submit" className="btn primary">
                <FaPaperPlane /> Send Message
              </button>
            </form>

            <div className="contact-note">
              <h3>Let’s build something great</h3>
              <p>
                This portfolio is built to look modern, professional, and interview-ready.
                Resume updates happen from Django Admin, and contact messages are stored in the backend.
              </p>
              <p className="status">{status}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;