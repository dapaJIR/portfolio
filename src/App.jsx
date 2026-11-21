import React, { useEffect, useRef, useState } from "react";
import profilePhoto from "../asset/IMG20250928225436.jpg";
import schoolLogo from "../asset/LOGO SMK METLAND.png";
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
    let nextShootingStar = 240;
    let animationFrame = 0;
    let stars = [];
    let shootingStars = [];

    const makeStars = () => {
      const count = Math.min(190, Math.max(75, Math.round((width * height) / 4200)));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.35 + Math.random() * 1.1,
        alpha: 0.18 + Math.random() * 0.62,
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.4,
        driftX: (Math.random() - 0.5) * 0.12,
        driftY: (Math.random() - 0.5) * 0.08,
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
      gradient.addColorStop(0.72, "rgba(10, 28, 73, 0.16)");
      gradient.addColorStop(0.96, "rgba(40, 78, 159, 0.1)");
      gradient.addColorStop(1, "rgba(5, 8, 18, 0)");
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = "rgba(98, 137, 255, 0.075)";
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
      const drift = reducedMotion ? 0 : Math.sin(time * 0.00014) * 10;

      context.save();
      context.globalCompositeOperation = "screen";
      drawOrb(width * 0.08 - offsetX, height * 0.44 - offsetY + drift, Math.max(230, Math.min(width * 0.35, height * 0.39)), "rgba(44, 103, 237, 0.2)");
      drawOrb(width * 0.94 + offsetX * 0.8, height * 0.59 + offsetY * 0.7 - drift * 0.7, Math.max(210, Math.min(width * 0.32, height * 0.36)), "rgba(16, 185, 129, 0.12)");
      context.restore();

      if (pointer.active) {
        const aura = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 300);
        aura.addColorStop(0, "rgba(66, 111, 255, 0.12)");
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

        const twinkle = reducedMotion ? 1 : 0.55 + Math.sin(time * 0.001 * star.speed + star.phase) * 0.35;
        const x = star.x + offsetX * star.depth;
        const y = star.y + offsetY * star.depth;
        context.beginPath();
        context.arc(x, y, star.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(218, 228, 255, ${star.alpha * twinkle})`;
        context.fill();
      });

      if (!reducedMotion) {
        nextShootingStar -= delta;
        if (nextShootingStar <= 0) {
          const x = width * (0.25 + Math.random() * 0.8);
          shootingStars.push({
            x,
            y: Math.random() * height * 0.48,
            vx: -5 - Math.random() * 4,
            vy: 3 + Math.random() * 2,
            length: 60 + Math.random() * 85,
            life: 1,
          });
          nextShootingStar = 240 + Math.random() * 260;
        }
      }

      shootingStars = shootingStars.filter((star) => star.life > 0);
      shootingStars.forEach((star) => {
        star.x += star.vx * delta;
        star.y += star.vy * delta;
        star.life -= 0.035 * delta;
        const trail = context.createLinearGradient(
          star.x - star.vx * star.length / 8,
          star.y - star.vy * star.length / 8,
          star.x,
          star.y,
        );
        trail.addColorStop(0, "rgba(130, 176, 255, 0)");
        trail.addColorStop(1, `rgba(196, 221, 255, ${Math.max(star.life, 0)})`);
        context.beginPath();
        context.moveTo(star.x - star.vx * star.length / 8, star.y - star.vy * star.length / 8);
        context.lineTo(star.x, star.y);
        context.strokeStyle = trail;
        context.lineWidth = 1.4;
        context.stroke();
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
  return (
    <header className="site-header">
      <nav className="navigation" aria-label="Navigasi utama">
        <a className="logo" href="#home">
          Daffa<span>Dev.</span>
        </a>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#education">Education</a></li>
          <li><a href="#projects">Portfolio</a></li>
          <li><a href="#contact">Kontak</a></li>
        </ul>
        <a className="nav-cta" href="#contact">
          Let’s talk <span aria-hidden="true">↗</span>
        </a>
      </nav>
    </header>
  );
}

function IdentityCard() {
  const [tilt, setTilt] = useState({ x: 0, y: 0, pointerX: 50, pointerY: 45 });
  const [drag, setDrag] = useState({ x: 0, y: 0, offsetX: 0, offsetY: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef(null);

  const handlePointerMove = (event) => {
    const scene = event.currentTarget;
    const dragStart = dragStartRef.current;

    if (dragStart && dragStart.pointerId === event.pointerId) {
      const deltaX = event.clientX - dragStart.pointerX;
      const deltaY = event.clientY - dragStart.pointerY;
      const maxOffset = Math.min(140, window.innerWidth * 0.35);
      const maxVerticalOffset = Math.min(120, window.innerHeight * 0.16);
      setDrag({
        x: Math.max(-16, Math.min(16, dragStart.x - deltaY * 0.18)),
        y: Math.max(-30, Math.min(30, dragStart.y + deltaX * 0.2)),
        offsetX: Math.max(
          -maxOffset,
          Math.min(maxOffset, dragStart.offsetX + deltaX),
        ),
        offsetY: Math.max(
          -maxVerticalOffset,
          Math.min(maxVerticalOffset, dragStart.offsetY + deltaY),
        ),
      });
      return;
    }

    const sceneBounds = scene.getBoundingClientRect();
    const card = scene.querySelector(".identity-card");
    const cardWidth = card.offsetWidth;
    const cardHeight = card.offsetHeight;
    const cardLeft = sceneBounds.left + (sceneBounds.width - cardWidth) / 2;
    const cardTop = sceneBounds.top + card.offsetTop;
    const horizontal = (event.clientX - cardLeft) / cardWidth - 0.5;
    const vertical = (event.clientY - cardTop) / cardHeight - 0.5;

    setTilt({
      x: vertical * -24,
      y: horizontal * 32,
      pointerX: Math.min(100, Math.max(0, (horizontal + 0.5) * 100)),
      pointerY: Math.min(100, Math.max(0, (vertical + 0.5) * 100)),
    });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0, pointerX: 50, pointerY: 45 });
  const handlePointerDown = (event) => {
    if (!event.target.closest(".card-drag")) return;

    dragStartRef.current = {
      pointerId: event.pointerId,
      pointerX: event.clientX,
      pointerY: event.clientY,
      x: drag.x,
      y: drag.y,
      offsetX: drag.offsetX,
      offsetY: drag.offsetY,
    };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const handlePointerUp = (event) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragStartRef.current = null;
    setIsDragging(false);
    setDrag({ x: 0, y: 0, offsetX: 0, offsetY: 0 });
    resetTilt();
  };
  const handlePointerCancel = () => {
    dragStartRef.current = null;
    setIsDragging(false);
    setDrag({ x: 0, y: 0, offsetX: 0, offsetY: 0 });
    resetTilt();
  };

  return (
    <div
      className={`card-scene${isDragging ? " is-dragging" : ""}`}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerLeave={resetTilt}
      aria-label="Kartu portfolio Daffa Maulana Muzaky"
    >
      <div className="card-orbit orbit-a" />
      <div className="card-orbit orbit-b" />
      <div className="card-drop">
        <div
          className={`card-drag${isDragging ? " is-dragging" : ""}`}
          style={{
            "--drag-x": `${drag.x}deg`,
            "--drag-y": `${drag.y}deg`,
            "--drag-offset-x": `${drag.offsetX}px`,
            "--drag-offset-y": `${drag.offsetY}px`,
          }}
        >
          <div className="card-rig">
            <div className="lanyard">
              <span className="lanyard-print">DAFFA • PPLG • METLAND</span>
            </div>
            <span className="card-clip" aria-hidden="true" />
            <article
              className="identity-card liquid-border"
              style={{
                "--tilt-x": `${tilt.x}deg`,
                "--tilt-y": `${tilt.y}deg`,
                "--pointer-x": `${tilt.pointerX}%`,
                "--pointer-y": `${tilt.pointerY}%`,
              }}
            >
            <div className="card-header">
              <img src={schoolLogo} alt="Logo Metland School" draggable={false} />
              <div>
                <span>METLAND SCHOOL</span>
                <small>CIBITUNG</small>
              </div>
            </div>
            <div className="card-role" aria-hidden="true">
              <span>JUNIOR</span>
              <strong>DEVELOPER</strong>
            </div>
            <div className="card-photo">
              <img src={profilePhoto} alt="Daffa Maulana Muzaky" draggable={false} />
              <span className="card-photo-label">PORTFOLIO ID</span>
            </div>
            <div className="card-name">
              <strong>DAFFA MAULANA MUZAKY</strong>
              <span>SOFTWARE ENGINEERING</span>
            </div>
            <div className="card-footer">
              <span>PPLG</span>
              <span>FULLSTACK DEVELOPER</span>
            </div>
            <span className="card-glint" aria-hidden="true" />
            </article>
          </div>
        </div>
      </div>
      <span className="card-index">01 / 01</span>
    </div>
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
      <IdentityCard />
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
          <img src={profilePhoto} alt="Daffa Maulana Muzaky" loading="lazy" />
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
