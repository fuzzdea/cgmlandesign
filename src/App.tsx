import { useEffect, useMemo, useRef, useState } from 'react';
import portfolioData from './portfolio.json';

type Lang = 'es' | 'en';
type Category = 'all' | 'landscape' | 'masterplan' | 'archive';
type Project = {
  id: number;
  src: string;
  title: string;
  detail: string;
  category: Exclude<Category, 'all'>;
  originalWidth: number;
  originalHeight: number;
};

const portfolio = portfolioData as Project[];
const categories: Category[] = ['all', 'landscape', 'masterplan', 'archive'];

const copy = {
  es: {
    nav: ['Proyectos', 'Carlos', 'Servicios', 'Contacto'],
    location: 'ESTEPONA · ESPAÑA',
    headline: <>Paisajes que<br/><em>permanecen.</em></>,
    lead: 'Arquitectura, urbanismo y paisaje concebidos como un todo.',
    explore: 'Explorar proyectos',
    meet: 'Conoce a Carlos',
    years: 'años de experiencia\nen 4 países',
    manifesto: 'Diseñar el paisaje no es decorar el espacio. Es darle forma al tiempo.',
    selected: 'ARCHIVO DE PROYECTOS',
    projects: 'Más de cuatro décadas de paisaje, arquitectura y territorio.',
    filters: ['Todos', 'Paisajismo', 'Master plans', 'Archivo'],
    view: 'Ver imagen',
    loadMore: 'Mostrar más proyectos',
    shown: 'imágenes visibles',
    profileLabel: 'CARLOS ALFONSO GONZÁLEZ MORA',
    profileTitle: 'Una mirada integral, construida a lo largo de más de cuatro décadas.',
    profileBody: 'Arquitecto y paisajista con experiencia en Venezuela, Estados Unidos, México y España. Su trabajo une planeamiento, arquitectura y paisaje para llevar cada proyecto desde el primer trazado hasta el último detalle del jardín.',
    profileCta: 'Descubrir su trayectoria',
    aboutLabel: 'BIOGRAFÍA',
    aboutTitle: 'Sobre Carlos González Mora',
    aboutIntro: 'Con más de 45 años de trayectoria en Venezuela, Estados Unidos, México y España, Carlos Alfonso González Mora ha dedicado su carrera a diseñar espacios donde el paisaje, la arquitectura y el urbanismo funcionan como un todo. Formado en las tres disciplinas, ha llevado grandes desarrollos turísticos y residenciales desde el primer trazado urbanístico hasta el último detalle del jardín.',
    expertise: 'Especialidades',
    expertiseItems: [
      'Paisajismo de campos de golf, resorts y complejos turísticos',
      'Planificación urbanística de grandes desarrollos residenciales y turísticos',
      'Arquitectura residencial y de ocio',
      'Dirección de proyecto y supervisión de obra',
    ],
    career: 'Trayectoria',
    careerBlocks: [
      ['Venezuela', 'Su carrera comienza como arquitecto de la gobernación del estado Yaracuy, donde diseña escuelas granjas, iglesias rurales y edificios administrativos; además supervisa obras y coordina proyectos para el desarrollo rural del estado.'],
      ['Estados Unidos', 'Completa un Máster en Arquitectura Paisajística en la Universidad de Colorado y recibe el premio Design Excellence. Más tarde se incorpora a TEAM-PLAN en Florida, trabajando en grandes desarrollos turísticos de golf de la costa este, algunos bajo supervisión del PGA National of America.'],
      ['España · México', 'En 1994 es socio fundador de González & Jacobson Arquitectura en la Costa del Sol, estudio que dirige durante casi dos décadas. Entre 2012 y 2017 lidera la oficina de Querétaro, México, con más de 40 proyectos. Desde 2017 trabaja desde Estepona y colabora con G&J Arquitectura, La Cala Golf Resort y MDCI Project Management, entre otros.'],
    ],
    education: 'Formación',
    educationItems: [
      ['Máster en Arquitectura Paisajística', 'Universidad de Colorado, Denver · EE. UU.', 'Premio Design Excellence'],
      ['Diplomado en Nuevo Urbanismo Sustentable', 'Tecnológico de Monterrey, Querétaro · México', ''],
      ['Licenciatura en Arquitectura', 'Universidad Central de Venezuela, Caracas', ''],
    ],
    servicesLabel: 'QUÉ HACEMOS',
    servicesTitle: 'Del territorio al detalle.',
    services: [
      ['01', 'Paisajismo', 'Diseño de jardines, campos de golf, resorts y complejos turísticos.'],
      ['02', 'Planeamiento urbano', 'Master plans para grandes desarrollos residenciales y turísticos.'],
      ['03', 'Arquitectura', 'Arquitectura residencial, de ocio y espacios integrados al paisaje.'],
      ['04', 'Dirección de proyecto', 'Coordinación técnica, supervisión de obra y acompañamiento integral.'],
    ],
    contactLabel: 'HABLEMOS',
    contactTitle: 'Todo gran paisaje empieza con una conversación.',
    contactBody: 'Cuéntanos sobre tu proyecto, su ubicación y el desafío que quieres resolver.',
    name: 'Nombre',
    email: 'Email',
    phone: 'Teléfono',
    message: 'Háblanos de tu proyecto',
    send: 'Enviar consulta',
    rights: 'Todos los derechos reservados.',
    close: 'Cerrar imagen',
    previous: 'Anterior',
    next: 'Siguiente',
    keyboard: 'Usa las flechas para navegar · ESC para cerrar',
  },
  en: {
    nav: ['Projects', 'Carlos', 'Services', 'Contact'],
    location: 'ESTEPONA · SPAIN',
    headline: <>Landscapes<br/><em>that endure.</em></>,
    lead: 'Architecture, urban planning and landscape conceived as one.',
    explore: 'Explore projects',
    meet: 'Meet Carlos',
    years: 'years of experience\nacross 4 countries',
    manifesto: 'Landscape design is not decoration. It is the art of giving shape to time.',
    selected: 'PROJECT ARCHIVE',
    projects: 'More than four decades of landscape, architecture and territory.',
    filters: ['All', 'Landscape', 'Master plans', 'Archive'],
    view: 'View image',
    loadMore: 'Show more projects',
    shown: 'images visible',
    profileLabel: 'CARLOS ALFONSO GONZÁLEZ MORA',
    profileTitle: 'An integrated perspective shaped over more than four decades.',
    profileBody: 'Architect and landscape architect with experience across Venezuela, the United States, Mexico and Spain. His work brings planning, architecture and landscape together, guiding each project from its first master plan to the final detail of the garden.',
    profileCta: 'Explore his career',
    aboutLabel: 'BIOGRAPHY',
    aboutTitle: 'About Carlos González Mora',
    aboutIntro: 'With more than 45 years of experience across Venezuela, the United States, Mexico and Spain, Carlos Alfonso González Mora has built his career designing places where landscape, architecture and urban planning work as one. Trained in all three disciplines, he has guided large tourism and residential developments from the first master plan to the final detail of the garden.',
    expertise: 'Areas of expertise',
    expertiseItems: [
      'Landscape design for golf courses, resorts and tourism complexes',
      'Urban planning for large residential and tourism developments',
      'Residential and leisure architecture',
      'Project direction and construction supervision',
    ],
    career: 'Career',
    careerBlocks: [
      ['Venezuela', 'His career began as an architect for the Yaracuy state government, where he designed farm schools, rural churches and administrative buildings, while supervising construction and coordinating rural development projects.'],
      ['United States', 'He completed a Master’s Degree in Landscape Architecture at the University of Colorado and received the Design Excellence Award. He then joined TEAM-PLAN in Florida, working on major golf resort developments along the East Coast, some overseen by the PGA National of America.'],
      ['Spain · Mexico', 'In 1994 he co-founded González & Jacobson Arquitectura on the Costa del Sol, leading the studio for nearly two decades. From 2012 to 2017 he headed its Querétaro office, overseeing more than 40 projects. Since 2017 he has worked from Estepona with G&J Arquitectura, La Cala Golf Resort and MDCI Project Management, among others.'],
    ],
    education: 'Education',
    educationItems: [
      ['Master’s in Landscape Architecture', 'University of Colorado, Denver · USA', 'Design Excellence Award'],
      ['Diploma in Sustainable New Urbanism', 'Tecnológico de Monterrey, Querétaro · Mexico', ''],
      ['Bachelor of Architecture', 'Universidad Central de Venezuela, Caracas', ''],
    ],
    servicesLabel: 'WHAT WE DO',
    servicesTitle: 'From territory to detail.',
    services: [
      ['01', 'Landscape design', 'Gardens, golf courses, resorts and tourism complexes.'],
      ['02', 'Urban planning', 'Master plans for large residential and tourism developments.'],
      ['03', 'Architecture', 'Residential and leisure architecture integrated with landscape.'],
      ['04', 'Project direction', 'Technical coordination, construction supervision and end-to-end guidance.'],
    ],
    contactLabel: 'LET’S TALK',
    contactTitle: 'Every great landscape begins with a conversation.',
    contactBody: 'Tell us about your project, its location and the challenge you want to solve.',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    message: 'Tell us about your project',
    send: 'Send enquiry',
    rights: 'All rights reserved.',
    close: 'Close image',
    previous: 'Previous',
    next: 'Next',
    keyboard: 'Use arrow keys to navigate · ESC to close',
  },
};

export default function App() {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('cgm-lang') as Lang) || 'es');
  const [dark, setDark] = useState(() => localStorage.getItem('cgm-theme') === 'dark');
  const [filter, setFilter] = useState<Category>('all');
  const [limit, setLimit] = useState(24);
  const [modal, setModal] = useState<number | null>(null);
  const [menu, setMenu] = useState(false);
  const touchStart = useRef(0);
  const t = copy[lang];

  const filtered = useMemo(
    () => portfolio.filter((project) => filter === 'all' || project.category === filter),
    [filter],
  );
  const visible = filtered.slice(0, limit);
  const hero = portfolio.find((item) => item.title.toUpperCase() === 'ELVIRIA HILLS' && item.detail === '1') || portfolio[0];

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.documentElement.lang = lang;
    localStorage.setItem('cgm-theme', dark ? 'dark' : 'light');
    localStorage.setItem('cgm-lang', lang);
  }, [dark, lang]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.12, rootMargin: '0px 0px -45px' },
    );
    const elements = document.querySelectorAll('[data-reveal]');
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [limit, filter, lang]);

  useEffect(() => {
    if (modal === null) return;
    const current = filtered[modal];
    const next = filtered[(modal + 1) % filtered.length];
    const previous = filtered[(modal - 1 + filtered.length) % filtered.length];
    [current, next, previous].forEach((item) => { if (item) new Image().src = item.src; });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setModal(null);
      if (event.key === 'ArrowRight') setModal((modal + 1) % filtered.length);
      if (event.key === 'ArrowLeft') setModal((modal - 1 + filtered.length) % filtered.length);
    };
    document.body.classList.add('modal-open');
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', onKey);
    };
  }, [modal, filtered]);

  const selectFilter = (category: Category) => {
    setFilter(category);
    setLimit(24);
    setModal(null);
  };
  const go = (step: number) => setModal(modal === null ? null : (modal + step + filtered.length) % filtered.length);
  const closeMenu = () => setMenu(false);
  const modalProject = modal === null ? null : filtered[modal];

  return <main>
    <header className="nav shell" id="inicio">
      <a className="brand" href="#inicio" aria-label="CGM Landesign" onClick={closeMenu}>
        <img src="/brand/logo-original.png" alt=""/>
        <span><strong>CGM</strong><small>LANDESIGN</small></span>
      </a>
      <nav className={menu ? 'open' : ''} aria-label={lang === 'es' ? 'Navegación principal' : 'Main navigation'}>
        {['proyectos', 'carlos', 'servicios', 'contacto'].map((id, index) =>
          <a key={id} href={`#${id}`} onClick={closeMenu}>{t.nav[index]}</a>
        )}
      </nav>
      <div className="nav-actions">
        <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} aria-label="Change language">{lang === 'es' ? 'EN' : 'ES'}</button>
        <button onClick={() => setDark(!dark)} aria-label={dark ? 'Light mode' : 'Dark mode'}>{dark ? '☀' : '◐'}</button>
        <button className="menu-toggle" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-label="Menu">{menu ? '×' : '≡'}</button>
      </div>
    </header>

    <section className="hero shell">
      <div className="hero-copy" data-reveal>
        <p className="eyebrow">{t.location}</p>
        <h1>{t.headline}</h1>
        <p className="lead">{t.lead}</p>
        <div className="hero-actions">
          <a className="button primary" href="#proyectos">{t.explore}<span>↗</span></a>
          <a className="text-link" href="#carlos">{t.meet}<span>→</span></a>
        </div>
        <div className="experience"><strong>45+</strong><span>{t.years}</span></div>
      </div>
      <div className="hero-visual" data-reveal>
        <img src={hero.src} alt={hero.title}/>
        <div className="image-tag"><span>01</span><p>{hero.title}</p></div>
      </div>
    </section>

    <section className="manifesto"><div className="shell" data-reveal><span className="ginkgo">❧</span><blockquote>{t.manifesto}</blockquote><span className="manifesto-line"/></div></section>

    <section className="projects-section shell" id="proyectos">
      <div className="section-heading" data-reveal>
        <div><p className="eyebrow">{t.selected}</p><h2>{t.projects}</h2></div>
        <p className="project-count">{portfolio.length.toLocaleString()}<span> PNG</span></p>
      </div>
      <div className="filters" role="group" aria-label="Project filters">
        {categories.map((category, index) =>
          <button className={filter === category ? 'active' : ''} onClick={() => selectFilter(category)} key={category}>{t.filters[index]}</button>
        )}
      </div>
      <div className="project-grid">
        {visible.map((project, index) =>
          <button className="project-card" data-reveal key={project.id} onClick={() => setModal(index)} aria-label={`${t.view}: ${project.title}`}>
            <div className="project-image">
              <img loading="lazy" decoding="async" src={project.src} alt={project.title}/>
              <span>↗</span>
            </div>
            <div className="project-meta">
              <p>{project.title}</p><b>{String(project.id).padStart(4, '0')}</b>
            </div>
          </button>
        )}
      </div>
      <div className="load-more" data-reveal>
        <p>{Math.min(limit, filtered.length).toLocaleString()} / {filtered.length.toLocaleString()} {t.shown}</p>
        {limit < filtered.length && <button className="button outline" onClick={() => setLimit(limit + 24)}>{t.loadMore}<span>＋</span></button>}
      </div>
    </section>

    <section className="profile-section" id="perfil">
      <div className="shell profile-grid">
        <div className="profile-image portrait" data-reveal><img loading="lazy" src="/brand/carlos-gonzalez-mora.png" alt="Retrato de Carlos Alfonso González Mora"/><span>+45</span><a className="portrait-instagram" href="https://www.instagram.com/cgm.landesign/p/CbK1L-ztwjg/" target="_blank" rel="noreferrer">Instagram ↗</a></div>
        <div className="profile-copy" data-reveal>
          <p className="eyebrow">{t.profileLabel}</p><h2>{t.profileTitle}</h2><p className="profile-intro">{t.profileBody}</p>
          <a className="text-link profile-link" href="#carlos">{t.profileCta}<span>↓</span></a>
        </div>
      </div>
    </section>

    <section className="biography shell" id="carlos">
      <header className="bio-header" data-reveal><p className="eyebrow">{t.aboutLabel}</p><h2>{t.aboutTitle}</h2><p>{t.aboutIntro}</p></header>
      <div className="expertise" data-reveal><h3>{t.expertise}</h3><div>{t.expertiseItems.map((item, index) => <article key={item}><span>0{index + 1}</span><p>{item}</p></article>)}</div></div>
      <div className="career" data-reveal><div className="career-title"><p className="eyebrow">{t.career}</p><span>1970s — 2026</span></div><div className="career-list">{t.careerBlocks.map(([place, body], index) => <article key={place}><span>{String(index + 1).padStart(2, '0')}</span><h3>{place}</h3><p>{body}</p></article>)}</div></div>
      <div className="education" data-reveal><p className="eyebrow">{t.education}</p><div>{t.educationItems.map(([degree, institution, award]) => <article key={degree}><span>✦</span><h3>{degree}</h3><p>{institution}</p>{award && <small>{award}</small>}</article>)}</div></div>
    </section>

    <section className="services shell" id="servicios">
      <div className="services-head" data-reveal><p className="eyebrow">{t.servicesLabel}</p><h2>{t.servicesTitle}</h2></div>
      <div className="service-list">{t.services.map(([number, title, description]) => <article key={number} data-reveal><span>{number}</span><h3>{title}</h3><p>{description}</p><b>↗</b></article>)}</div>
    </section>

    <section className="contact" id="contacto">
      <div className="shell contact-grid">
        <div className="contact-copy" data-reveal><p className="eyebrow">{t.contactLabel}</p><h2>{t.contactTitle}</h2><p>{t.contactBody}</p><div className="direct-contact"><a href="tel:+34627766248">+34 627 76 62 48</a><a href="mailto:cgm.landesign@gmail.com">cgm.landesign@gmail.com</a><a href="https://wa.me/34627766248" target="_blank" rel="noreferrer">WhatsApp ↗</a></div></div>
        <form name="contacto" method="POST" data-netlify="true" netlify-honeypot="bot-field" data-reveal>
          <input type="hidden" name="form-name" value="contacto"/><p className="hidden"><label>Don’t fill this out: <input name="bot-field"/></label></p>
          <label><span>{t.name}</span><input name="nombre" required placeholder="Carlos González"/></label>
          <div className="form-row"><label><span>{t.email}</span><input name="email" type="email" required placeholder="nombre@email.com"/></label><label><span>{t.phone}</span><input name="telefono" type="tel" placeholder="+34"/></label></div>
          <label><span>{t.message}</span><textarea name="mensaje" rows={4} required placeholder="..."/></label>
          <button className="button form-submit" type="submit">{t.send}<span>↗</span></button>
        </form>
      </div>
    </section>

    <footer>
      <div className="shell footer-top"><a className="footer-brand" href="#inicio">CGM<small>LANDESIGN</small></a><div><a href="https://www.instagram.com/cgm.landesign/" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://www.linkedin.com/in/carlos-a-gonzalez-mora-41266b28/" target="_blank" rel="noreferrer">LinkedIn ↗</a></div><a href="https://cgmlandesign.com">cgmlandesign.com</a></div>
      <div className="shell footer-bottom"><span>© {new Date().getFullYear()} CGM Landesign. {t.rights}</span><span>with <b>♥</b> by <a href="https://fuzzdea.com/" target="_blank" rel="noreferrer">fuzzdea</a></span></div>
    </footer>

    {modalProject && <div className="lightbox" role="dialog" aria-modal="true" aria-label={modalProject.title} onClick={() => setModal(null)} onTouchStart={(event) => { touchStart.current = event.changedTouches[0].clientX; }} onTouchEnd={(event) => { const distance = event.changedTouches[0].clientX - touchStart.current; if (Math.abs(distance) > 55) go(distance < 0 ? 1 : -1); }}>
      <div className="lightbox-top"><p>{modalProject.title}</p><small>{t.keyboard}</small><button className="lightbox-close" onClick={() => setModal(null)} aria-label={t.close}>×</button></div>
      <button className="lightbox-nav prev" onClick={(event) => { event.stopPropagation(); go(-1); }} aria-label={t.previous}>←</button>
      <figure key={modalProject.src} onClick={(event) => event.stopPropagation()}>
        <img src={modalProject.src} alt={modalProject.title}/>
        <figcaption><strong>{modalProject.title}</strong><small>{String((modal || 0) + 1).padStart(4, '0')} / {String(filtered.length).padStart(4, '0')}</small></figcaption>
      </figure>
      <button className="lightbox-nav next" onClick={(event) => { event.stopPropagation(); go(1); }} aria-label={t.next}>→</button>
      <div className="lightbox-progress"><span style={{ width: `${(((modal || 0) + 1) / filtered.length) * 100}%` }}/></div>
    </div>}
  </main>;
}
