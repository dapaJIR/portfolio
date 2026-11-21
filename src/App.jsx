import React, { useEffect, useRef, useState } from "react";
import aboutPhoto from "../asset/about-illustration.jpg";
import schoolLogo from "../asset/LOGO SMK METLAND.png";
import PortfolioLanyard from "./PortfolioLanyard.jsx";
import "./styles.css";

const projects = [
  {
    number: "01",
    category: "website",
    label: "WEBSITE",
    title: "Landing Page Web",
    description: "Website landing page modern dengan tampilan responsif dan menarik.",
  },
  {
    number: "02",
    category: "website",
    label: "WEBSITE",
    title: "Company Profile",
    description: "Website profil perusahaan yang informatif dan mudah digunakan.",
  },
  {
    number: "03",
    category: "application",
    label: "APPLICATION",
    title: "Aplikasi E-Commerce",
    description: "Aplikasi belanja online dengan katalog, keranjang, dan checkout.",
  },
  {
    number: "04",
    category: "experiment",
    label: "EXPERIMENT",
    title: "Game Web Sederhana",
    description: "Permainan interaktif berbasis web yang dapat dimainkan langsung.",
  },
];

const projectFilters = [
  { value: "all", label: "All" },
  { value: "website", label: "Website" },
  { value: "application", label: "Application" },
  { value: "experiment", label: "Experiment" },
];

const heroRoles = ["Junior Developer", "Web Development"];

function TypingRole() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [typedRole, setTypedRole] = useState("");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTypedRole(heroRoles[0]);
      return undefined;
    }

    let activeRole = 0;
    let characterIndex = 0;
    let isDeleting = false;
    let timeoutId;

    const typeNextCharacter = () => {
      const currentRole = heroRoles[activeRole];

      if (isDeleting) {
        characterIndex -= 1;
        setTypedRole(currentRole.slice(0, characterIndex));

        if (characterIndex === 0) {
          isDeleting = false;
          activeRole = (activeRole + 1) % heroRoles.length;
          setRoleIndex(activeRole);
          timeoutId = window.setTimeout(typeNextCharacter, 350);
        } else {
          timeoutId = window.setTimeout(typeNextCharacter, 45);
        }
        return;
      }

      characterIndex += 1;
      setTypedRole(currentRole.slice(0, characterIndex));

      if (characterIndex === currentRole.length) {
        isDeleting = true;
        timeoutId = window.setTimeout(typeNextCharacter, 1200);
      } else {
        timeoutId = window.setTimeout(typeNextCharacter, 90);
      }
    };

    timeoutId = window.setTimeout(typeNextCharacter, 350);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <p className="hero-role" aria-label={heroRoles[roleIndex]}>
      <span aria-hidden="true">{typedRole || "\u00a0"}</span>
    </p>
  );
}

function GlassFilter() {
  return (
    <svg className="glass-defs" aria-hidden="true" focusable="false">
      <filter id="liquid-glass-filter" x="-10%" y="-30%" width="120%" height="160%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.012 0.035"
          numOctaves="2"
          seed="8"
          result="glass-noise"
        >
          <animate
            attributeName="baseFrequency"
            dur="18s"
            values="0.012 0.035;0.018 0.05;0.012 0.035"
            repeatCount="indefinite"
          />
        </feTurbulence>
        <feDisplacementMap
          in="SourceGraphic"
          in2="glass-noise"
          scale="13"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
}

function SpaceBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2, targetX: window.innerWidth / 2, targetY: window.innerHeight / 2, active: false };
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let lastFrame = 0;
    let nextShootingStar = 25;
    let animationFrame = 0;
    let stars = [];
    let shootingStars = [];

    const makeStars = () => {
      const count = Math.min(260, Math.max(90, Math.round((width * height) / 3200)));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.4 + Math.random() * 1.45,
        alpha: 0.32 + Math.random() * 0.62,
        phase: Math.random() * Math.PI * 2,
        speed: 0.7 + Math.random() * 1.7,
        driftX: (Math.random() - 0.5) * 0.4,
        driftY: (Math.random() - 0.5) * 0.3,
        depth: 0.25 + Math.random() * 0.75,
      }));
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      makeStars();
      if (reducedMotion) render(performance.now());
    };

    const drawOrb = (x, y, radius, color) => {
      const gradient = context.createRadialGradient(
        x - radius * 0.28,
        y - radius * 0.3,
        radius * 0.05,
        x,
        y,
        radius,
      );
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.72, "rgba(10, 24, 58, 0.1)");
      gradient.addColorStop(0.96, "rgba(33, 64, 126, 0.06)");
      gradient.addColorStop(1, "rgba(5, 8, 18, 0)");
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = "rgba(125, 160, 235, 0.045)";
      context.lineWidth = 1;
      context.stroke();
    };

    const render = (time) => {
      const delta = lastFrame ? Math.min((time - lastFrame) / 16.67, 2) : 1;
      lastFrame = time;
      pointer.x += (pointer.targetX - pointer.x) * 0.045;
      pointer.y += (pointer.targetY - pointer.y) * 0.045;
      context.clearRect(0, 0, width, height);

      const offsetX = (pointer.x / Math.max(width, 1) - 0.5) * 28;
      const offsetY = (pointer.y / Math.max(height, 1) - 0.5) * 22;
      const drift = reducedMotion ? 0 : Math.sin(time * 0.0003) * 16;

      context.save();
      context.globalCompositeOperation = "screen";
      drawOrb(width * 0.08 - offsetX, height * 0.44 - offsetY + drift, Math.max(230, Math.min(width * 0.35, height * 0.39)), "rgba(33, 70, 165, 0.12)");
      drawOrb(width * 0.94 + offsetX * 0.8, height * 0.59 + offsetY * 0.7 - drift * 0.7, Math.max(210, Math.min(width * 0.32, height * 0.36)), "rgba(20, 52, 104, 0.09)");
      context.restore();

      if (pointer.active) {
        const aura = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 300);
        aura.addColorStop(0, "rgba(75, 120, 230, 0.09)");
        aura.addColorStop(1, "rgba(66, 111, 255, 0)");
        context.fillStyle = aura;
        context.fillRect(0, 0, width, height);
      }

      stars.forEach((star) => {
        if (!reducedMotion) {
          star.x += star.driftX * delta;
          star.y += star.driftY * delta;
          if (star.x < -2) star.x = width + 2;
          if (star.x > width + 2) star.x = -2;
          if (star.y < -2) star.y = height + 2;
          if (star.y > height + 2) star.y = -2;
        }

        const twinkle = reducedMotion
          ? 1
          : 0.35 + (Math.sin(time * 0.001 * star.speed + star.phase) + 1) * 0.325;
        const x = star.x + offsetX * star.depth;
        const y = star.y + offsetY * star.depth;
        context.beginPath();
        context.arc(x, y, star.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(218, 228, 255, ${star.alpha * twinkle})`;
        context.fill();
        if (star.radius > 1.55 && twinkle > 0.82) {
          context.beginPath();
          context.moveTo(x - star.radius * 2.8, y);
          context.lineTo(x + star.radius * 2.8, y);
          context.moveTo(x, y - star.radius * 2.8);
          context.lineTo(x, y + star.radius * 2.8);
          context.strokeStyle = `rgba(206, 226, 255, ${star.alpha * (twinkle - 0.65)})`;
          context.lineWidth = 0.65;
          context.stroke();
        }
      });

      if (!reducedMotion) {
        nextShootingStar -= delta;
        if (nextShootingStar <= 0) {
          const burst = Math.random() < 0.4 ? 2 : 1;
          for (let index = 0; index < burst && shootingStars.length < 4; index += 1) {
            shootingStars.push({
              x: width * (0.25 + Math.random() * 0.8),
              y: Math.random() * height * 0.55,
              vx: -6 - Math.random() * 5,
              vy: 2.8 + Math.random() * 3.2,
              length: 100 + Math.random() * 180,
              width: Math.random() < 0.2 ? 2 : 1.2,
              life: 1,
            });
          }
          nextShootingStar = 28 + Math.random() * 50;
        }
      }

      shootingStars = shootingStars.filter((star) => star.life > 0);
      shootingStars.forEach((star) => {
        star.x += star.vx * delta;
        star.y += star.vy * delta;
        star.life -= 0.022 * delta;
        const trail = context.createLinearGradient(
          star.x - star.vx * star.length / 8,
          star.y - star.vy * star.length / 8,
          star.x,
          star.y,
        );
        trail.addColorStop(0, "rgba(130, 176, 255, 0)");
        trail.addColorStop(0.7, `rgba(104, 164, 255, ${Math.max(star.life, 0) * 0.45})`);
        trail.addColorStop(1, `rgba(240, 248, 255, ${Math.max(star.life, 0)})`);
        context.beginPath();
        context.moveTo(star.x - star.vx * star.length / 8, star.y - star.vy * star.length / 8);
        context.lineTo(star.x, star.y);
        context.strokeStyle = trail;
        context.globalAlpha = 0.24 * star.life;
        context.lineWidth = star.width * 5;
        context.stroke();
        context.globalAlpha = star.life;
        context.lineWidth = star.width;
        context.stroke();
        context.globalAlpha = 1;
        const head = context.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.width * 4);
        head.addColorStop(0, `rgba(255, 255, 255, ${star.life})`);
        head.addColorStop(1, "rgba(106, 163, 255, 0)");
        context.fillStyle = head;
        context.beginPath();
        context.arc(star.x, star.y, star.width * 4, 0, Math.PI * 2);
        context.fill();
      });

      if (!reducedMotion) animationFrame = window.requestAnimationFrame(render);
    };

    const handlePointerMove = (event) => {
      pointer.targetX = event.clientX;
      pointer.targetY = event.clientY;
      pointer.active = true;
      if (reducedMotion) render(performance.now());
    };

    const handlePointerLeave = () => {
      pointer.active = false;
      pointer.targetX = width / 2;
      pointer.targetY = height / 2;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("blur", handlePointerLeave);
    resize();
    if (!reducedMotion) animationFrame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("blur", handlePointerLeave);
    };
  }, []);

  return <canvas className="space-canvas" ref={canvasRef} aria-hidden="true" />;
}

function Navigation() {
  const audioContextRef = useRef(null);
  const [activeSection, setActiveSection] = useState("home");

  const playClickSound = () => {
    const AudioContext = window.AudioContext;
    if (!AudioContext) return;

    const audioContext = audioContextRef.current || new AudioContext();
    audioContextRef.current = audioContext;
    if (audioContext.state === "suspended") void audioContext.resume();

    const oscillator = audioContext.createOscillator();
    const volume = audioContext.createGain();
    const now = audioContext.currentTime;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(740, now);
    oscillator.frequency.exponentialRampToValueAtTime(1040, now + 0.045);
    volume.gain.setValueAtTime(0.0001, now);
    volume.gain.exponentialRampToValueAtTime(0.045, now + 0.008);
    volume.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
    oscillator.connect(volume);
    volume.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.12);
  };

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return undefined;

    const sections = ["home", "about", "projects", "contact"]
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      const currentSection = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

      if (currentSection) setActiveSection(currentSection.target.id);
    }, { rootMargin: "-35% 0px -55% 0px" });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const navigateTo = (section) => {
    setActiveSection(section);
    playClickSound();
  };

  return (
    <header className="site-header">
      <nav className="navigation" aria-label="Navigasi utama">
        <a className="mobile-logo" href="#home" onClick={() => navigateTo("home")}>DaffaDev</a>
        <ul className="nav-links">
          <li><a href="#home" aria-current={activeSection === "home" ? "page" : undefined} onClick={() => navigateTo("home")}>Home</a></li>
          <li><a href="#about" aria-current={activeSection === "about" ? "page" : undefined} onClick={() => navigateTo("about")}>About</a></li>
          <li><a href="#projects" aria-current={activeSection === "projects" ? "page" : undefined} onClick={() => navigateTo("projects")}>Portfolio</a></li>
          <li><a href="#contact" aria-current={activeSection === "contact" ? "page" : undefined} onClick={() => navigateTo("contact")}>Kontak</a></li>
        </ul>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-copy">
        <h1><span>Welcome to</span><span className="hero-title-second">My Portfolio</span></h1>
        <TypingRole />
        <p className="hero-description">
          Berawal dari rasa penasaran, sekarang jadi passion. Aku suka bereksperimen dengan kode,
          mengeksplorasi teknologi baru, dan mengubah ide menjadi sesuatu yang nyata. Dari tampilan
          web yang menarik sampai interaksi 3D yang seru, aku selalu berusaha bikin sesuatu yang
          bukan cuma keren dilihat, tapi juga nyaman digunakan.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="#projects">
            Lihat Projek <span aria-hidden="true">↘</span>
          </a>
          <a className="button button-quiet" href="#contact">
            Hubungi Saya <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <PortfolioLanyard />
      <div className="hero-socials" aria-label="Social media">
        <span className="hero-socials-label">FIND ME</span>
        <a
          href="https://www.instagram.com/yaudalahmaugimanalagihh/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
          </svg>
        </a>
        <a
          href="https://www.tiktok.com/@rennsszyshiki"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="TikTok"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19.6 6.7a5.1 5.1 0 0 1-3.8-4.3V2h-3.5v13.6a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9.3a6.7 6.7 0 1 0 5.5 6.6V9a8.6 8.6 0 0 0 4.8 1.5V7a5 5 0 0 1-1-.3Z" />
          </svg>
        </a>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="about section-shell reveal" id="about">
      <div className="about-heading reveal-item">
        <h2 className="about-section-title">About Me</h2>
      </div>
      <div className="about-layout">
        <div className="about-intro reveal-item">
          <h3 className="about-title">
            <span className="about-title-greeting">Hi, I'm</span>
            <span>Daffa Maulana<br />Muzaky</span>
          </h3>
        </div>
        <figure className="about-photo liquid-border reveal-item">
          <img src={aboutPhoto} alt="Ilustrasi Ichigo Kurosaki" loading="lazy" />
          <figcaption>DAFFA MAULANA MUZAKY <span>• JUNIOR DEVELOPER</span></figcaption>
        </figure>
        <div className="about-copy reveal-item">
          <p>
            Saya adalah <strong>Junior Developer</strong> yang berfokus pada pengembangan teknologi
            yang fungsional sekaligus menarik. Saya senang memadukan kode, desain, dan pengalaman
            3D untuk membangun produk digital yang berkesan.
          </p>
          <p>
            Dengan React, Three.js, dan teknologi web modern, saya mengubah ide menjadi pengalaman
            digital yang intuitif, responsif, dan berdampak.
          </p>
          <div className="about-tech" aria-label="Teknologi yang digunakan">
            <span>React</span>
            <span>Three.js</span>
            <span>Web technology</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Education() {
  return (
    <section className="education section-shell reveal" id="education">
      <div className="section-kicker"><span>02</span> EDUCATION</div>
      <div className="education-content">
        <h2>Belajar, mencoba,<br /><span>terus berkembang.</span></h2>
        <article className="education-card liquid-border reveal-item">
          <div className="education-card-top">
            <img src={schoolLogo} alt="Logo Metland School" />
            <span className="education-status">PENDIDIKAN</span>
          </div>
          <div>
            <h3>Metland School Cibitung</h3>
            <p>Jurusan PPLG</p>
          </div>
        </article>
      </div>
    </section>
  );
}

function Portfolio() {
  const [activeFilter, setActiveFilter] = useState("all");
  const visibleProjects = projects.filter(
    (project) => activeFilter === "all" || project.category === activeFilter,
  );

  return (
    <section className="portfolio section-shell reveal" id="projects">
      <div className="section-heading">
        <div>
          <div className="section-kicker"><span>03</span> PORTFOLIO</div>
          <h2>Projects</h2>
        </div>
        <p>Project web dan aplikasi yang pernah saya kerjakan.</p>
      </div>
      <div className="project-filters" role="group" aria-label="Filter portfolio">
        {projectFilters.map((filter) => (
          <button
            className={`filter-button${activeFilter === filter.value ? " is-active" : ""}`}
            type="button"
            key={filter.value}
            aria-pressed={activeFilter === filter.value}
            onClick={() => setActiveFilter(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>
      <div className="project-grid">
        {projects.map((project) => (
          <article
            className="project-card liquid-border reveal-item"
            key={project.number}
            hidden={!visibleProjects.includes(project)}
          >
            <div className="project-topline">
              <span>{project.number}</span>
              <span>{project.label}</span>
            </div>
            <div className="project-info">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const subject = `Portfolio contact from ${formData.get("name")}`;
    const body = [
      `Nama: ${formData.get("name")}`,
      `Email: ${formData.get("email")}`,
      "",
      formData.get("message"),
    ].join("\n");

    window.location.href =
      `mailto:muzakydaffa80@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section className="contact section-shell reveal" id="contact">
      <div className="contact-intro">
        <div className="section-kicker"><span>04</span> CONTACT</div>
        <h2>Hubungi saya</h2>
        <p>Kirim pesan untuk bertanya atau membicarakan project.</p>
        <a className="contact-email" href="mailto:muzakydaffa80@gmail.com">
          muzakydaffa80@gmail.com <span aria-hidden="true">↗</span>
        </a>
      </div>
      <form className="contact-form reveal-item" onSubmit={handleSubmit}>
        <label htmlFor="contact-name">Nama</label>
        <input id="contact-name" name="name" autoComplete="name" required />
        <label htmlFor="contact-email">Email</label>
        <input id="contact-email" name="email" type="email" autoComplete="email" required />
        <label htmlFor="contact-message">Pesan</label>
        <textarea id="contact-message" name="message" rows="4" required />
        <button className="button button-primary" type="submit">
          Kirim Pesan <span aria-hidden="true">↗</span>
        </button>
        <p className="form-note">Pesan dibuka melalui aplikasi email Anda.</p>
      </form>
    </section>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add("motion-ready");
    const revealItems = document.querySelectorAll(".reveal, .reveal-item");

    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <SpaceBackground />
      <GlassFilter />
      <Navigation />
      <main>
        <Hero />
        <About />
        <Education />
        <Portfolio />
        <Contact />
      </main>
      <footer className="site-footer">
        <a className="logo" href="#home">Daffa<span>Dev.</span></a>
        <p>© 2026 Daffa Maulana Muzaky</p>
        <a href="#home">KEMBALI KE ATAS ↑</a>
      </footer>
    </>
  );
}

export default App;
