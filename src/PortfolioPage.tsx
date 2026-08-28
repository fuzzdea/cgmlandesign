import { useEffect, useMemo, useRef, useState } from 'react';
import MotionEnhancements from './MotionEnhancements';
import portfolioData from './portfolio.json';

type Lang = 'es' | 'en';
type Category = 'all' | 'landscape' | 'masterplan' | 'archive';
type PortfolioCategory = Exclude<Category, 'all'>;
type PortfolioImage = { id: number; src: string; title: string; detail: string; category: PortfolioCategory; originalWidth?: number; originalHeight?: number };
type ProjectGroup = { slug: string; title: string; category: PortfolioCategory; images: PortfolioImage[]; cover: PortfolioImage };

const categories: Category[] = ['all', 'landscape', 'masterplan', 'archive'];
const images = portfolioData as PortfolioImage[];
const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const slugify = (value: string) => normalize(value).replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const projects = Array.from(images.reduce((groups, image) => {
  const key = `${image.category}::${image.title}`;
  const group = groups.get(key) || [];
  group.push(image);
  groups.set(key, group);
  return groups;
}, new Map<string, PortfolioImage[]>())).map(([key, projectImages]) => ({
  slug: slugify(key),
  title: projectImages[0].title,
  category: projectImages[0].category,
  images: projectImages,
  cover: projectImages.find((image) => (image.originalWidth || 0) >= (image.originalHeight || 0)) || projectImages[0],
})).sort((a, b) => a.title.localeCompare(b.title, 'es')) as ProjectGroup[];

const words = {
  es: {
    home: 'Inicio', carlos: 'Carlos', services: 'Servicios', contact: 'Contacto', label: 'CGM LANDESIGN · PORTAFOLIO POR PROYECTOS', title: 'Explora por proyecto',
    intro: 'Selecciona un proyecto para recorrer únicamente sus imágenes y conocer la experiencia de CGM Landesign en trabajos de escala similar.',
    filters: ['Todos', 'Paisajismo', 'Master plans', 'Otros proyectos'], categoryNames: { landscape: 'Paisajismo', masterplan: 'Master plan', archive: 'Otros proyectos' },
    search: 'Buscar un proyecto — La Trinidad, La Cala Golf…', clear: 'Limpiar búsqueda', more: 'Mostrar más proyectos', shown: 'proyectos visibles', projects: 'proyectos', photos: 'imágenes',
    open: 'Abrir proyecto', empty: 'No encontramos proyectos con ese nombre.', backProjects: 'Volver a todos los proyectos', view: 'Ver imagen', close: 'Cerrar imagen', previous: 'Anterior', next: 'Siguiente',
    keyboard: 'Flechas para navegar · ESC para cerrar', back: 'Volver al inicio', rights: 'Todos los derechos reservados.',
  },
  en: {
    home: 'Home', carlos: 'Carlos', services: 'Services', contact: 'Contact', label: 'CGM LANDESIGN · PORTFOLIO BY PROJECT', title: 'Explore by project',
    intro: 'Choose a project to browse only its images and discover CGM Landesign’s experience in work of a similar scale.',
    filters: ['All', 'Landscape', 'Master plans', 'Other projects'], categoryNames: { landscape: 'Landscape', masterplan: 'Master plan', archive: 'Other projects' },
    search: 'Search a project — La Trinidad, La Cala Golf…', clear: 'Clear search', more: 'Show more projects', shown: 'projects visible', projects: 'projects', photos: 'images',
    open: 'Open project', empty: 'We could not find a project with that name.', backProjects: 'Back to all projects', view: 'View image', close: 'Close image', previous: 'Previous', next: 'Next',
    keyboard: 'Arrow keys to navigate · ESC to close', back: 'Back to home', rights: 'All rights reserved.',
  },
};

const getProjectFromUrl = () => new URLSearchParams(window.location.search).get('project');

export default function PortfolioPage() {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('cgm-lang') as Lang) || 'es');
  const [dark, setDark] = useState(() => localStorage.getItem('cgm-theme') === 'dark');
  const [filter, setFilter] = useState<Category>('all');
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(24);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(getProjectFromUrl);
  const [modal, setModal] = useState<number | null>(null);
  const [menu, setMenu] = useState(false);
  const touchStart = useRef(0);
  const t = words[lang];
  const selectedProject = useMemo(() => projects.find((project) => project.slug === selectedSlug) || null, [selectedSlug]);
  const filteredProjects = useMemo(() => {
    const term = normalize(search.trim());
    return projects.filter((project) => (filter === 'all' || project.category === filter) && (!term || normalize(project.title).includes(term)));
  }, [filter, search]);
  const visibleProjects = filteredProjects.slice(0, limit);
  const activeImages = selectedProject?.images || [];
  const modalImage = modal === null ? null : activeImages[modal];
  const cover = projects.find((project) => normalize(project.title).includes('la cala golf'))?.cover || projects[0].cover;

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.documentElement.lang = lang;
    document.title = `${selectedProject?.title || t.title} · CGM Landesign`;
    localStorage.setItem('cgm-theme', dark ? 'dark' : 'light');
    localStorage.setItem('cgm-lang', lang);
  }, [dark, lang, selectedProject, t.title]);

  useEffect(() => {
    const onPopState = () => { setSelectedSlug(getProjectFromUrl()); setModal(null); };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')), { threshold: 0.08, rootMargin: '0px 0px -25px' });
    document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [limit, filter, search, selectedSlug]);

  useEffect(() => {
    if (modal === null || !activeImages.length) return;
    [activeImages[modal], activeImages[(modal + 1) % activeImages.length], activeImages[(modal - 1 + activeImages.length) % activeImages.length]].forEach((item) => { if (item) new Image().src = item.src; });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setModal(null);
      if (event.key === 'ArrowRight') setModal((modal + 1) % activeImages.length);
      if (event.key === 'ArrowLeft') setModal((modal - 1 + activeImages.length) % activeImages.length);
    };
    document.body.classList.add('modal-open');
    window.addEventListener('keydown', onKey);
    return () => { document.body.classList.remove('modal-open'); window.removeEventListener('keydown', onKey); };
  }, [modal, activeImages]);

  const openProject = (project: ProjectGroup) => {
    const url = new URL(window.location.href);
    url.searchParams.set('project', project.slug);
    window.history.pushState({}, '', `${url.pathname}${url.search}`);
    setSelectedSlug(project.slug);
    setModal(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const closeProject = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('project');
    window.history.pushState({}, '', `${url.pathname}${url.search}`);
    setSelectedSlug(null);
    setModal(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const go = (step: number) => setModal(modal === null ? null : (modal + step + activeImages.length) % activeImages.length);

  return <main className="portfolio-page">
    <MotionEnhancements/>
    <header className="nav shell">
      <a className="brand" href="/" aria-label="CGM Landesign"><img src="/brand/logo-original.png" alt=""/><span><strong>CGM</strong><small>LANDESIGN</small></span></a>
      <nav className={menu ? 'open' : ''}><a href="/">{t.home}</a><a href="/#carlos">{t.carlos}</a><a href="/#servicios">{t.services}</a><a href="/#contacto">{t.contact}</a></nav>
      <div className="nav-actions"><button onClick={() => setLang(lang === 'es' ? 'en' : 'es')}>{lang === 'es' ? 'EN' : 'ES'}</button><button onClick={() => setDark(!dark)}>{dark ? '☀' : '◐'}</button><button className="menu-toggle" onClick={() => setMenu(!menu)} aria-expanded={menu}>{menu ? '×' : '≡'}</button></div>
    </header>

    {selectedProject ? <>
      <section className="project-detail-hero">
        <div className="project-detail-cover" aria-hidden="true"><img src={selectedProject.cover.src} alt=""/></div>
        <div className="shell project-detail-heading" data-reveal>
          <button className="project-detail-back" onClick={closeProject}>← {t.backProjects}</button>
          <p className="eyebrow">{t.categoryNames[selectedProject.category]}</p>
          <h1>{selectedProject.title}</h1>
          <div className="project-detail-summary"><span>{String(selectedProject.images.length).padStart(2, '0')}</span><p>{t.photos}<br/>CGM Landesign</p></div>
        </div>
      </section>
      <section className="project-detail-gallery shell" aria-label={selectedProject.title}>
        {selectedProject.images.map((image, index) => <button className="project-detail-image" data-reveal key={image.id} onClick={() => setModal(index)} aria-label={`${t.view}: ${selectedProject.title}`}><img loading="lazy" decoding="async" src={image.src} alt={`${selectedProject.title} ${index + 1}`}/><span>{String(index + 1).padStart(2, '0')} ↗</span></button>)}
      </section>
    </> : <>
      <section className="portfolio-hero">
        <div className="portfolio-cover" aria-hidden="true"><img src={cover.src} alt=""/></div>
        <div className="shell portfolio-hero-content" data-reveal><p className="eyebrow">{t.label}</p><h1>{t.title}</h1><div><p>{t.intro}</p><strong>{projects.length.toLocaleString()}<small> {t.projects}</small></strong></div></div>
        <span className="portfolio-orbit" aria-hidden="true"/>
      </section>
      <div className="motion-marquee" aria-hidden="true"><div><span>PAISAJISMO</span><i>✦</i><span>ARQUITECTURA</span><i>✦</i><span>URBANISMO</span><i>✦</i><span>GOLF & RESORTS</span><i>✦</i><span>PAISAJISMO</span><i>✦</i><span>ARQUITECTURA</span><i>✦</i><span>URBANISMO</span><i>✦</i></div></div>
      <section className="projects-section shell portfolio-directory">
        <div className="portfolio-tools" data-reveal>
          <div className="filters" role="group">{categories.map((category, index) => <button className={filter === category ? 'active' : ''} onClick={() => { setFilter(category); setLimit(24); }} key={category}>{t.filters[index]}</button>)}</div>
          <label className="project-search"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => { setSearch(event.target.value); setLimit(24); }} placeholder={t.search} aria-label={t.search}/>{search && <button onClick={() => setSearch('')} aria-label={t.clear}>×</button>}</label>
        </div>
        {visibleProjects.length ? <div className="project-folder-grid">{visibleProjects.map((project) => <button className="project-folder-card" data-reveal key={project.slug} onClick={() => openProject(project)} aria-label={`${t.open}: ${project.title}`}>
          <div className="project-folder-cover"><img loading="lazy" decoding="async" src={project.cover.src} alt=""/><span>↗</span></div>
          <div className="project-folder-meta"><small>{t.categoryNames[project.category]}</small><h2>{project.title}</h2><p>{project.images.length} {t.photos}</p></div>
        </button>)}</div> : <div className="empty-projects" data-reveal><p>{t.empty}</p><button onClick={() => setSearch('')}>{t.clear}</button></div>}
        <div className="load-more" data-reveal><p>{Math.min(limit, filteredProjects.length).toLocaleString()} / {filteredProjects.length.toLocaleString()} {t.shown}</p>{limit < filteredProjects.length && <button className="button outline" onClick={() => setLimit(limit + 24)}>{t.more}<span>＋</span></button>}</div>
      </section>
    </>}

    <a className="portfolio-back" href="/">← {t.back}</a>
    <footer><div className="shell footer-top"><a className="footer-brand" href="/">CGM<small>LANDESIGN</small></a><div><a href="https://www.instagram.com/cgm.landesign/" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://www.linkedin.com/in/carlos-a-gonzalez-mora-41266b28/" target="_blank" rel="noreferrer">LinkedIn ↗</a></div><a href="https://cgmlandesign.com">cgmlandesign.com</a></div><div className="shell footer-bottom"><span>© {new Date().getFullYear()} CGM Landesign. {t.rights}</span><span>with <b>♥</b> by <a href="https://fuzzdea.com/" target="_blank" rel="noreferrer">fuzzdea</a></span></div></footer>

    {modalImage && selectedProject && <div className="lightbox" role="dialog" aria-modal="true" aria-label={selectedProject.title} onClick={() => setModal(null)} onTouchStart={(event) => { touchStart.current = event.changedTouches[0].clientX; }} onTouchEnd={(event) => { const distance = event.changedTouches[0].clientX - touchStart.current; if (Math.abs(distance) > 55) go(distance < 0 ? 1 : -1); }}><div className="lightbox-top"><p>{selectedProject.title}</p><small>{t.keyboard}</small><button className="lightbox-close" onClick={() => setModal(null)} aria-label={t.close}>×</button></div><button className="lightbox-nav prev" onClick={(event) => { event.stopPropagation(); go(-1); }} aria-label={t.previous}>←</button><figure key={modalImage.src} onClick={(event) => event.stopPropagation()}><img src={modalImage.src} alt={`${selectedProject.title} ${(modal || 0) + 1}`}/><figcaption><strong>{selectedProject.title}</strong><small>{String((modal || 0) + 1).padStart(2, '0')} / {String(activeImages.length).padStart(2, '0')}</small></figcaption></figure><button className="lightbox-nav next" onClick={(event) => { event.stopPropagation(); go(1); }} aria-label={t.next}>→</button><div className="lightbox-progress"><span style={{ width: `${(((modal || 0) + 1) / activeImages.length) * 100}%` }}/></div></div>}
  </main>;
}
