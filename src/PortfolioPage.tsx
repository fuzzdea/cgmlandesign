import { useEffect, useMemo, useRef, useState } from 'react';
import MotionEnhancements from './MotionEnhancements';
import portfolioData from './portfolio.json';

type Lang = 'es' | 'en';
type Category = 'all' | 'landscape' | 'masterplan' | 'archive';
type Project = { id: number; src: string; title: string; detail: string; category: Exclude<Category, 'all'> };
const portfolio = [...(portfolioData as Project[])].sort((a, b) => b.id - a.id);
const categories: Category[] = ['all', 'landscape', 'masterplan', 'archive'];

const words = {
  es: { home: 'Inicio', carlos: 'Carlos', services: 'Servicios', contact: 'Contacto', label: 'CGM LANDESIGN · PORTAFOLIO', title: 'Portafolio de proyectos', intro: 'Paisaje, arquitectura y planeamiento reunidos en una colección de más de cuatro décadas de trabajo.', filters: ['Todos', 'Paisajismo', 'Master plans', 'Selección'], more: 'Mostrar más proyectos', shown: 'imágenes visibles', view: 'Ver imagen', close: 'Cerrar imagen', previous: 'Anterior', next: 'Siguiente', keyboard: 'Flechas para navegar · ESC para cerrar', back: 'Volver al inicio', rights: 'Todos los derechos reservados.' },
  en: { home: 'Home', carlos: 'Carlos', services: 'Services', contact: 'Contact', label: 'CGM LANDESIGN · PORTFOLIO', title: 'Project portfolio', intro: 'Landscape, architecture and planning brought together in a collection spanning more than four decades of work.', filters: ['All', 'Landscape', 'Master plans', 'Selection'], more: 'Show more projects', shown: 'images visible', view: 'View image', close: 'Close image', previous: 'Previous', next: 'Next', keyboard: 'Arrow keys to navigate · ESC to close', back: 'Back to home', rights: 'All rights reserved.' },
};

export default function PortfolioPage() {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('cgm-lang') as Lang) || 'es');
  const [dark, setDark] = useState(() => localStorage.getItem('cgm-theme') === 'dark');
  const [filter, setFilter] = useState<Category>('all');
  const [limit, setLimit] = useState(24);
  const [modal, setModal] = useState<number | null>(null);
  const [menu, setMenu] = useState(false);
  const touchStart = useRef(0);
  const t = words[lang];
  const filtered = useMemo(() => portfolio.filter((project) => filter === 'all' || project.category === filter), [filter]);
  const visible = filtered.slice(0, limit);
  const cover = portfolio.find((item) => item.title.toUpperCase() === 'EL DESEO. SAN MIGUEL DE ALLENDE, MEXICO' && item.id === 30) || portfolio[29];
  const modalProject = modal === null ? null : filtered[modal];

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.documentElement.lang = lang;
    document.title = `${t.title} · CGM Landesign`;
    localStorage.setItem('cgm-theme', dark ? 'dark' : 'light');
    localStorage.setItem('cgm-lang', lang);
  }, [dark, lang, t.title]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')), { threshold: 0.1, rootMargin: '0px 0px -35px' });
    document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [limit, filter]);

  useEffect(() => {
    if (modal === null) return;
    [filtered[modal], filtered[(modal + 1) % filtered.length], filtered[(modal - 1 + filtered.length) % filtered.length]].forEach((item) => { if (item) new Image().src = item.src; });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setModal(null);
      if (event.key === 'ArrowRight') setModal((modal + 1) % filtered.length);
      if (event.key === 'ArrowLeft') setModal((modal - 1 + filtered.length) % filtered.length);
    };
    document.body.classList.add('modal-open');
    window.addEventListener('keydown', onKey);
    return () => { document.body.classList.remove('modal-open'); window.removeEventListener('keydown', onKey); };
  }, [modal, filtered]);

  const go = (step: number) => setModal(modal === null ? null : (modal + step + filtered.length) % filtered.length);

  return <main className="portfolio-page">
    <MotionEnhancements/>
    <header className="nav shell">
      <a className="brand" href="/" aria-label="CGM Landesign"><img src="/brand/logo-original.png" alt=""/><span><strong>CGM</strong><small>LANDESIGN</small></span></a>
      <nav className={menu ? 'open' : ''}><a href="/">{t.home}</a><a href="/#carlos">{t.carlos}</a><a href="/#servicios">{t.services}</a><a href="/#contacto">{t.contact}</a></nav>
      <div className="nav-actions"><button onClick={() => setLang(lang === 'es' ? 'en' : 'es')}>{lang === 'es' ? 'EN' : 'ES'}</button><button onClick={() => setDark(!dark)}>{dark ? '☀' : '◐'}</button><button className="menu-toggle" onClick={() => setMenu(!menu)} aria-expanded={menu}>{menu ? '×' : '≡'}</button></div>
    </header>

    <section className="portfolio-hero">
      <div className="portfolio-cover" aria-hidden="true"><img src={cover.src} alt=""/></div>
      <div className="shell portfolio-hero-content" data-reveal><p className="eyebrow">{t.label}</p><h1>{t.title}</h1><div><p>{t.intro}</p><strong>{portfolio.length.toLocaleString()}<small> PNG</small></strong></div></div>
      <span className="portfolio-orbit" aria-hidden="true"/>
    </section>
    <div className="motion-marquee" aria-hidden="true"><div><span>PAISAJISMO</span><i>✦</i><span>ARQUITECTURA</span><i>✦</i><span>URBANISMO</span><i>✦</i><span>GOLF & RESORTS</span><i>✦</i><span>PAISAJISMO</span><i>✦</i><span>ARQUITECTURA</span><i>✦</i><span>URBANISMO</span><i>✦</i></div></div>

    <section className="projects-section shell portfolio-gallery">
      <div className="filters" role="group">{categories.map((category, index) => <button className={filter === category ? 'active' : ''} onClick={() => { setFilter(category); setLimit(24); }} key={category}>{t.filters[index]}</button>)}</div>
      <div className="project-grid">{visible.map((project, index) => <button className="project-card" data-reveal key={project.id} onClick={() => setModal(index)} aria-label={`${t.view}: ${project.title}`}><div className="project-image"><img loading="lazy" decoding="async" src={project.src} alt={project.title}/><span>↗</span></div><div className="project-meta"><p>{project.title}</p><b>{String(project.id).padStart(4, '0')}</b></div></button>)}</div>
      <div className="load-more" data-reveal><p>{Math.min(limit, filtered.length).toLocaleString()} / {filtered.length.toLocaleString()} {t.shown}</p>{limit < filtered.length && <button className="button outline" onClick={() => setLimit(limit + 24)}>{t.more}<span>＋</span></button>}</div>
    </section>

    <a className="portfolio-back" href="/">← {t.back}</a>
    <footer><div className="shell footer-top"><a className="footer-brand" href="/">CGM<small>LANDESIGN</small></a><div><a href="https://www.instagram.com/cgm.landesign/" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://www.linkedin.com/in/carlos-a-gonzalez-mora-41266b28/" target="_blank" rel="noreferrer">LinkedIn ↗</a></div><a href="https://cgmlandesign.com">cgmlandesign.com</a></div><div className="shell footer-bottom"><span>© {new Date().getFullYear()} CGM Landesign. {t.rights}</span><span>with <b>♥</b> by <a href="https://fuzzdea.com/" target="_blank" rel="noreferrer">fuzzdea</a></span></div></footer>

    {modalProject && <div className="lightbox" role="dialog" aria-modal="true" aria-label={modalProject.title} onClick={() => setModal(null)} onTouchStart={(event) => { touchStart.current = event.changedTouches[0].clientX; }} onTouchEnd={(event) => { const distance = event.changedTouches[0].clientX - touchStart.current; if (Math.abs(distance) > 55) go(distance < 0 ? 1 : -1); }}><div className="lightbox-top"><p>{modalProject.title}</p><small>{t.keyboard}</small><button className="lightbox-close" onClick={() => setModal(null)} aria-label={t.close}>×</button></div><button className="lightbox-nav prev" onClick={(event) => { event.stopPropagation(); go(-1); }} aria-label={t.previous}>←</button><figure key={modalProject.src} onClick={(event) => event.stopPropagation()}><img src={modalProject.src} alt={modalProject.title}/><figcaption><strong>{modalProject.title}</strong><small>{String((modal || 0) + 1).padStart(4, '0')} / {String(filtered.length).padStart(4, '0')}</small></figcaption></figure><button className="lightbox-nav next" onClick={(event) => { event.stopPropagation(); go(1); }} aria-label={t.next}>→</button><div className="lightbox-progress"><span style={{ width: `${(((modal || 0) + 1) / filtered.length) * 100}%` }}/></div></div>}
  </main>;
}
