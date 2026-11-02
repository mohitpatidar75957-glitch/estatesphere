import React, { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, ArrowUp, Building2, ChevronRight, Menu, MousePointer2, Waves, X } from 'lucide-react'
import ResidenceScene from './components/ResidenceScene'
import ApartmentsPage from './components/ApartmentsPage'
import ContactPage from './components/ContactPage'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import { authService } from './admin/auth'
import Lenis from 'lenis'
import { dataStore } from './admin/dataStore'

const residences = [
  { type: 'Three Bedroom Residence', beds: '3', area: '178 — 202 m²', image: '/assets/estate-boutique-lounge.png', status: 'FOR SALE · READY RESIDENCE', price: 'From ₹3.25 Cr', description: 'A spacious family residence with curated interiors, generous living areas and private landscaped views.' },
  { type: 'Garden Apartment', beds: '2', area: '97 — 104 m²', image: '/assets/estate-apartment-exterior.png', status: 'FOR RENT · GARDEN HOME', price: '₹75,000 / month', description: 'A calm garden apartment shaped by natural light, private outdoor access and effortless everyday living.' },
  { type: 'Penthouse Duplex', beds: '3', area: '124 — 243 m²', image: '/assets/estate-private-terrace.png', status: 'LIMITED RELEASE · PENTHOUSE', price: 'Price on request', description: 'An elevated duplex home with expansive terraces, skyline views and beautifully curated entertainment spaces.' }
]
const amenities = [['Gated community', 'Private walking paths connect every residence.'], ['Swimming pool', 'Saltwater pool, children’s pool and wellness shower.'], ['Parking area', 'Private parking with optional EV charging.'], ['Gym', 'A calm space dedicated to movement and recovery.'], ['Landscaping', 'Mediterranean gardens soften every architectural line.']]
const introSlides = [
  { title: 'ESTATESPHERE RESIDENCES', image: '/assets/estate-apartment-exterior.png', description: 'A premium collection of spacious residences with landscaped gardens, secure access and a calm architectural identity created for refined city living.' },
  { title: 'PRIVATE TERRACES', image: '/assets/estate-private-terrace.png', description: 'Generous private terraces extend each apartment outdoors, combining city views, natural light and beautifully landscaped spaces for everyday relaxation.' },
  { title: 'CURATED INTERIORS', image: '/assets/estate-boutique-lounge.png', description: 'Warm natural materials, flowing layouts and carefully selected finishes create apartments that feel elegant, comfortable and effortless to live in.' }
]
const interiorSlides = [
  { name: 'MASTER BEDROOM', image: '/assets/interior-master-bedroom.png', alt: 'Luxury master bedroom with private terrace' },
  { name: 'GUEST BEDROOM', image: '/assets/interior-guest-bedroom.png', alt: 'Warm contemporary guest bedroom' },
  { name: 'THE KITCHEN', image: '/assets/interior-kitchen.png', alt: 'Luxury travertine kitchen with terrace view' },
  { name: 'LIVING HALL', image: '/assets/interior-living-hall.png', alt: 'Spacious luxury living hall at sunset' }
]

const communityFeatures = [
  { title: 'GATED COMMUNITY', image: '/assets/community_exterior_1787305142682.jpg', copy: 'INSTEAD OF CORRIDORS, WALKING\nPATHS CONNECT the APARTMENTS — MAKING\nDWELLORA FEEL CLOSER TO A GROUP OF\nPRIVATE HOMES THAN A STANDARD COMPLEX.' },
  { title: 'SWIMMING POOL', image: '/assets/community_pool_1787305166324.jpg', copy: 'A CALM OASIS FEATURING A SALTWATER\nPOOL, CHILDREN\'S POOL, AND DEDICATED\nRELAXATION AREAS FOR EVERYDAY WELLBEING.' },
  { title: 'PARKING AREA', image: '/assets/community_parking_1787305178991.jpg', copy: 'SECURE UNDERGROUND PARKING WITH\nOPTIONAL EV CHARGING STATIONS,\nENSURING CONVENIENCE AND PEACE OF MIND.' },
  { title: 'GYM', image: '/assets/community_gym_1787305191603.jpg', copy: 'A STATE-OF-THE-ART FITNESS CENTER\nDESIGNED FOR MOVEMENT AND RECOVERY,\nFEATURING PREMIUM EQUIPMENT.' },
  { title: 'LANDSCAPING', image: '/assets/community_landscaping_1787305205295.jpg', copy: 'MEDITERRANEAN GARDENS SOFTEN EVERY\nARCHITECTURAL LINE, INTERTWINING LUSH\nFOLIAGE WITH OUTDOOR LIVING SPACES.' }
]

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const [activeHotspot, setActiveHotspot] = useState(null)
  const [heroTime, setHeroTime] = useState('NIGHT')
  const [siteContent, setSiteContent] = useState(() => (typeof dataStore?.getSiteContent === 'function' ? dataStore.getSiteContent() : null))
  const [apartmentsList, setApartmentsList] = useState(() => (typeof dataStore?.getApartments === 'function' ? dataStore.getApartments() : []))

  useEffect(() => {
    const fn = () => setCurrentPath(window.location.pathname)
    window.addEventListener('popstate', fn)
    return () => window.removeEventListener('popstate', fn)
  }, [])

  useEffect(() => {
    const handleDataUpdate = () => {
      if (typeof dataStore?.getSiteContent === 'function') {
        setSiteContent(dataStore.getSiteContent())
      }
      if (typeof dataStore?.getApartments === 'function') {
        setApartmentsList(dataStore.getApartments())
      }
    }
    window.addEventListener('era_datastore_updated', handleDataUpdate)
    window.addEventListener('storage', handleDataUpdate)
    return () => {
      window.removeEventListener('era_datastore_updated', handleDataUpdate)
      window.removeEventListener('storage', handleDataUpdate)
    }
  }, [])

  const activeResidences = (apartmentsList && apartmentsList.length >= 3)
    ? apartmentsList.slice(0, 3).map((apt, idx) => ({
        type: apt.title || (idx === 0 ? 'Three Bedroom Residence' : idx === 1 ? 'Garden Apartment' : 'Penthouse Duplex'),
        beds: String(apt.bedrooms || (idx === 1 ? 2 : 3)),
        area: `${apt.areaSqm || (idx === 0 ? '178 — 202' : idx === 1 ? '97 — 104' : '124 — 243')} m²`,
        image: apt.imageUrl || residences[idx]?.image || '/assets/estate-boutique-lounge.png',
        status: apt.status === 'AVAILABLE' ? 'FOR SALE · READY RESIDENCE' : (apt.status === 'RESERVED' ? 'RESERVED · VIP CLIENT' : 'SOLD OUT'),
        price: apt.price ? `₹${(apt.price / 10000000).toFixed(2)} Cr` : (residences[idx]?.price || 'From ₹3.25 Cr'),
        description: apt.description || apt.headline || residences[idx]?.description || 'A spacious luxury residence with curated interiors, generous living areas and private landscaped views.'
      }))
    : residences;

  const heroDayPhoto = siteContent?.heroDayImage || '/assets/luxury_villa_day.jpg';

  const activeFeatures = siteContent?.communityFeatures && siteContent.communityFeatures.length > 0
    ? siteContent.communityFeatures
    : communityFeatures

  useEffect(() => {
    if (window.location.pathname.startsWith('/admin')) return
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });
    window.lenis = lenis;
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
      delete window.lenis;
    };
  }, []);
  const navigateTo = path => {
    window.history.pushState(null, '', path)
    setCurrentPath(path)
    if (window.lenis) window.lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
  }
  const [siteSettings, setSiteSettings] = useState(() => (dataStore.getSettings ? dataStore.getSettings() : {}))
  useEffect(() => {
    if (typeof dataStore.subscribe === 'function') {
      const unsub = dataStore.subscribe(() => {
        setSiteSettings(dataStore.getSettings())
      })
      return () => {
        if (typeof unsub === 'function') unsub()
      }
    }
  }, [])
  const [menu, setMenu] = useState(false), [form, setForm] = useState(false), [formClosing, setFormClosing] = useState(false), [cookies, setCookies] = useState(true), [railOnDark, setRailOnDark] = useState(true), [heroProgress, setHeroProgress] = useState(0), [pageProgress, setPageProgress] = useState(0), [storyProgress, setStoryProgress] = useState(0), [cinematicProgress, setCinematicProgress] = useState(0), [spaceProgress, setSpaceProgress] = useState(0), [interiorCinemaProgress, setInteriorCinemaProgress] = useState(0), [introSlide, setIntroSlide] = useState(0), [apartmentSlide, setApartmentSlide] = useState(0), [interiorSlide, setInteriorSlide] = useState(0), [cursor, setCursor] = useState({ x: 0, y: 0, nx: 0, ny: 0 }), [finalProgress, setFinalProgress] = useState(0), [lifestyleProgress, setLifestyleProgress] = useState(0), [activeCommunityTab, setActiveCommunityTab] = useState(0), [notification, setNotification] = useState(null)
  const lifestyleRef = useRef(null)
  const lifestyleProgressRef = useRef(0)
  const lifestyleTargetRef = useRef(0)
  const horizontalStoryRef = useRef(null)
  const cinematicRef = useRef(null)
  const heroProgressRef = useRef(0)
  const heroTargetRef = useRef(0)
  const spaceRevealRef = useRef(null)
  const spaceProgressRef = useRef(0)
  const spaceTargetRef = useRef(0)
  const interiorCinemaRef = useRef(null)
  const interiorCinemaProgressRef = useRef(0)
  const interiorCinemaTargetRef = useRef(0)
  const finalRef = useRef(null)
  const finalProgressRef = useRef(0)
  const finalTargetRef = useRef(0)
  const emblemSvgRef = useRef(null)
  const emblemAngleRef = useRef(0)
  const emblemLastScrollRef = useRef({ y: 0, time: 0 })
  useEffect(() => { const fn = e => setCursor({ x: e.clientX, y: e.clientY, nx: (e.clientX / window.innerWidth - .5) * 2, ny: (e.clientY / window.innerHeight - .5) * 2 }); window.addEventListener('mousemove', fn); return () => window.removeEventListener('mousemove', fn) }, [])
  useEffect(() => { emblemLastScrollRef.current = { y: window.scrollY, time: performance.now() }; let autoFrame = 0; const onScroll = () => { const now = performance.now(), nextY = window.scrollY, delta = nextY - emblemLastScrollRef.current.y; emblemAngleRef.current += delta * .52; emblemLastScrollRef.current = { y: nextY, time: now }; if (emblemSvgRef.current) emblemSvgRef.current.style.transform = `rotate(${emblemAngleRef.current}deg)` }; const autoRotate = now => { if (now - emblemLastScrollRef.current.time > 180) { emblemAngleRef.current += .11; if (emblemSvgRef.current) emblemSvgRef.current.style.transform = `rotate(${emblemAngleRef.current}deg)` } autoFrame = requestAnimationFrame(autoRotate) }; window.addEventListener('scroll', onScroll, { passive: true }); autoFrame = requestAnimationFrame(autoRotate); return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(autoFrame) } }, [])
  useEffect(() => { let frame = 0; const fn = () => { if (frame) return; frame = requestAnimationFrame(() => { heroTargetRef.current = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 2))); const available = Math.max(1, document.documentElement.scrollHeight - window.innerHeight); setPageProgress(Math.min(1, Math.max(0, window.scrollY / available))); if (horizontalStoryRef.current) { const start = horizontalStoryRef.current.offsetTop; const distance = Math.max(1, horizontalStoryRef.current.offsetHeight - window.innerHeight); setStoryProgress(Math.min(1, Math.max(0, (window.scrollY - start) / distance))) } if (cinematicRef.current) { const start = cinematicRef.current.offsetTop; const distance = Math.max(1, cinematicRef.current.offsetHeight - window.innerHeight); setCinematicProgress(Math.min(1, Math.max(0, (window.scrollY - start) / distance))) } if (spaceRevealRef.current) { const sectionStart = spaceRevealRef.current.offsetTop; const start = sectionStart + window.innerHeight * .22; const end = sectionStart + spaceRevealRef.current.offsetHeight - window.innerHeight; const distance = Math.max(1, end - start); spaceTargetRef.current = Math.min(1, Math.max(0, (window.scrollY - start) / distance)) } if (interiorCinemaRef.current) { const start = interiorCinemaRef.current.offsetTop; const distance = Math.max(1, interiorCinemaRef.current.offsetHeight - window.innerHeight); interiorCinemaTargetRef.current = Math.min(1, Math.max(0, (window.scrollY - start) / distance)) } if (lifestyleRef.current) { const start = lifestyleRef.current.offsetTop; const distance = Math.max(1, lifestyleRef.current.offsetHeight - window.innerHeight); lifestyleTargetRef.current = Math.min(1, Math.max(0, (window.scrollY - start) / distance)) } if (finalRef.current) { const start = finalRef.current.offsetTop; const distance = Math.max(1, finalRef.current.offsetHeight - window.innerHeight); finalTargetRef.current = Math.min(1, Math.max(0, (window.scrollY - start) / distance)) } const railSection = document.elementFromPoint(Math.min(80, window.innerWidth * .06), Math.min(90, window.innerHeight * .12))?.closest('section'); setRailOnDark(!railSection || railSection.matches('.era-hero-scroll,.era-location-intro,.concept-image,.cinematic-property-scroll,.community-feature,.amenities,.architecture,.era-contact,.interior-cinematic-scroll,.lifestyle-slides,.estate-final-view,.estate-footer') || (railSection.matches('.space-reveal-scroll') && spaceProgressRef.current < .42)); frame = 0 }) }; window.addEventListener('scroll', fn, { passive: true }); fn(); return () => { window.removeEventListener('scroll', fn); if (frame) cancelAnimationFrame(frame) } }, [])
  useEffect(() => { let animationFrame = 0; const animate = () => { const heroCurrent = heroProgressRef.current, heroTarget = heroTargetRef.current; const heroNext = Math.abs(heroTarget - heroCurrent) < .0005 ? heroTarget : heroCurrent + (heroTarget - heroCurrent) * .045; heroProgressRef.current = heroNext; setHeroProgress(heroNext); const current = spaceProgressRef.current, target = spaceTargetRef.current; const next = Math.abs(target - current) < .0005 ? target : current + (target - current) * .045; spaceProgressRef.current = next; setSpaceProgress(next); const cinemaCurrent = interiorCinemaProgressRef.current, cinemaTarget = interiorCinemaTargetRef.current; const cinemaNext = Math.abs(cinemaTarget - cinemaCurrent) < .0004 ? cinemaTarget : cinemaCurrent + (cinemaTarget - cinemaCurrent) * .055; interiorCinemaProgressRef.current = cinemaNext; setInteriorCinemaProgress(cinemaNext); const lifeCurrent = lifestyleProgressRef.current, lifeTarget = lifestyleTargetRef.current; const lifeNext = Math.abs(lifeTarget - lifeCurrent) < .0004 ? lifeTarget : lifeCurrent + (lifeTarget - lifeCurrent) * .055; lifestyleProgressRef.current = lifeNext; setLifestyleProgress(lifeNext); const finalCurrent = finalProgressRef.current, finalTarget = finalTargetRef.current; const finalNext = Math.abs(finalTarget - finalCurrent) < .0004 ? finalTarget : finalCurrent + (finalTarget - finalCurrent) * .055; finalProgressRef.current = finalNext; setFinalProgress(finalNext); animationFrame = requestAnimationFrame(animate) }; animationFrame = requestAnimationFrame(animate); return () => cancelAnimationFrame(animationFrame) }, [])
  useEffect(() => { const updateRailColor = () => { const section = document.elementFromPoint(Math.min(80, window.innerWidth * .06), Math.min(90, window.innerHeight * .12))?.closest('section'); setRailOnDark(Boolean(section && section.matches('.concept-image,.cinematic-property-scroll,.community-feature,.amenities,.architecture,.era-contact,.interior-cinematic-scroll,.estate-final-view,.estate-footer')) || (Boolean(section && section.matches('.space-reveal-scroll')) && spaceProgressRef.current < .42)) }; window.addEventListener('scroll', updateRailColor, { passive: true }); updateRailColor(); return () => window.removeEventListener('scroll', updateRailColor) }, [])
  useEffect(() => {
    setActiveCommunityTab(Math.min(communityFeatures.length - 1, Math.floor((spaceProgress / 0.65) * communityFeatures.length)))
  }, [spaceProgress])
  useEffect(() => { if (window.location.hash === '#residences') { window.history.replaceState(null, '', '#top'); window.scrollTo(0, 0) } }, [])
  useEffect(() => { const timer = setInterval(() => setIntroSlide(current => (current + 1) % introSlides.length), 4200); return () => clearInterval(timer) }, [])
  useEffect(() => { const timer = setInterval(() => setApartmentSlide(current => (current + 1) % (activeResidences.length || 1)), 5200); return () => clearInterval(timer) }, [activeResidences.length])
  useEffect(() => { const timer = setInterval(() => setInteriorSlide(current => (current + 1) % interiorSlides.length), 4800); return () => clearInterval(timer) }, [])
  useEffect(() => {
    if (window.location.pathname.startsWith('/admin') || window.location.pathname === '/apartments') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const sections = [...document.querySelectorAll('.era-site > section:not(.era-hero-scroll):not(.estate-horizontal-story):not(.cinematic-property-scroll):not(.space-reveal-scroll):not(.space-details-story):not(.interior-cinematic-scroll)')]
    sections.forEach(section => section.classList.add('scroll-depth-item'))
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-depth-visible'); observer.unobserve(entry.target) }
    }), { threshold: .08, rootMargin: '0px 0px -8% 0px' })
    sections.forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (window.location.pathname.startsWith('/admin') || window.location.pathname === '/apartments') return
    const previous = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    window.history.replaceState(null, '', '#top')
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    return () => { window.history.scrollRestoration = previous }
  }, [])

  useEffect(() => {
    if (window.location.pathname.startsWith('/admin') || window.location.pathname === '/apartments') return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const targets = document.querySelectorAll('.estate-credentials .credentials-image-wrap, .estate-credentials .credentials-copy')
    if (reduced) { targets.forEach(el => el.classList.add('is-revealed')); return }
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-revealed'); io.unobserve(entry.target) }
    }), { threshold: .15, rootMargin: '0px 0px -8% 0px' })
    targets.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
  const storyTop = horizontalStoryRef.current?.offsetTop ?? Number.POSITIVE_INFINITY
  const storyBottom = storyTop + (horizontalStoryRef.current?.offsetHeight ?? 0)
  const storyIsActive = typeof window !== 'undefined' && window.scrollY >= storyTop && window.scrollY <= storyBottom
  const isAtEnd = pageProgress >= 0.98
  const railNumber = isAtEnd ? 100 : (storyIsActive ? 25 + (storyProgress * 17) : (pageProgress * 99))
  const [bookingUnit, setBookingUnit] = useState('General Residence Inquiry')
  const openForm = (unit = 'General Residence Inquiry') => { 
    if (typeof unit === 'string' && unit) setBookingUnit(unit)
    else setBookingUnit('General Residence Inquiry')
    setFormClosing(false)
    setForm(true) 
  }
  const closeForm = () => { if (formClosing) return; setFormClosing(true); window.setTimeout(() => { setForm(false); setFormClosing(false) }, 620) }
  const cinemaPosition = Math.min(interiorSlides.length - .0001, interiorCinemaProgress * interiorSlides.length)
  const cinemaIndex = Math.floor(cinemaPosition)
  const cinemaLocal = cinemaPosition - cinemaIndex
  const cinemaEase = value => value < .5 ? 2 * value * value : 1 - Math.pow(-2 * value + 2, 2) / 2
  const cinemaJoin = cinemaEase(Math.min(1, Math.max(0, (cinemaLocal - .08) / .34)))
  const cinemaZoom = cinemaEase(Math.min(1, Math.max(0, (cinemaLocal - .43) / .31)))
  const cinemaReveal = Math.min(1, Math.max(0, (cinemaLocal - .69) / .16))
  const cinemaPanelWidth = 28 + cinemaZoom * 22
  const cinemaPanelHeight = 58 + cinemaZoom * 42
  const cinemaGap = (1 - cinemaJoin) * 4
  if (currentPath.startsWith('/admin/login')) {
    return <AdminLogin onLoginSuccess={() => navigateTo('/admin/dashboard')} />
  }

  if (currentPath.startsWith('/admin')) {
    if (!authService.isAuthenticated() || !authService.getUser()) {
      return <AdminLogin onLoginSuccess={() => navigateTo('/admin/dashboard')} />
    }
    return <AdminDashboard />
  }

  if (currentPath.startsWith('/contact')) {
    return <main className="era-site" style={{ overflow: 'auto' }}>
      <div className="custom-cursor" style={{ transform: `translate(${cursor.x}px,${cursor.y}px)` }} />
      <ContactPage navigateTo={navigateTo} openForm={openForm} />
      {form && <div className={`era-modal ${formClosing ? 'is-closing' : ''}`} onMouseDown={closeForm}><form onMouseDown={e => e.stopPropagation()} onSubmit={e => { e.preventDefault(); const formData = new FormData(e.target); const data = Object.fromEntries(formData); dataStore.addInquiry({ ...data, interestedApartment: bookingUnit || 'General Residence Inquiry' }); setNotification('Thank you! Your request has been successfully submitted to our sales team.'); closeForm(); }}><button type="button" className="modal-close" onClick={closeForm}><X /></button><h2>Book a<br /><span>call</span></h2><div className="modal-emblem">✣</div>{bookingUnit && bookingUnit !== 'General Residence Inquiry' && <p style={{ color: '#d4af37', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>INQUIRING FOR: {bookingUnit}</p>}<p className="modal-note">LEAVE YOUR DETAILS AND WE<br />WILL GET BACK TO YOU WITHIN<br />24 HOURS.</p><div className="modal-fields"><label>NAME:<input name="name" required /></label><label>EMAIL:<input name="email" required type="email" /></label><label>PHONE:<input name="phone" required /></label><label>MESSAGE:<textarea name="message" /></label><div className="modal-consent">By submitting, you agree to<br />our Privacy policy.</div><button>SUBMIT</button></div></form></div>}
      {notification && <div className="era-modal" style={{ zIndex: 9999 }} onClick={() => setNotification(null)}><div style={{ background: '#1a1a1a', padding: '60px 40px', color: '#fff', textAlign: 'center', maxWidth: '450px', margin: 'auto', marginTop: '30vh', border: '1px solid #333', position: 'relative' }}><h3 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 300, marginBottom: '30px', fontSize: '26px' }}>{notification}</h3><button onClick={() => setNotification(null)} style={{ background: '#fff', color: '#000', padding: '12px 35px', border: 'none', cursor: 'pointer', letterSpacing: '2px', fontSize: '12px' }}>CLOSE</button></div></div>}
    </main>
  }

  if (currentPath.startsWith('/apartments')) {
    return <main className="era-site">
      <div className="custom-cursor" style={{ transform: `translate(${cursor.x}px,${cursor.y}px)` }} />
      <ApartmentsPage navigateTo={navigateTo} openForm={openForm} />
      {cookies && <div className="cookie-panel"><div><span>COOKIES</span><p>This website uses cookies to ensure you get the best experience.</p></div><button onClick={() => setCookies(false)}>Accept</button><button onClick={() => setCookies(false)}>Decline</button></div>}
      {form && <div className={`era-modal ${formClosing ? 'is-closing' : ''}`} onMouseDown={closeForm}><form onMouseDown={e => e.stopPropagation()} onSubmit={e => { e.preventDefault(); const formData = new FormData(e.target); const data = Object.fromEntries(formData); dataStore.addInquiry({ ...data, interestedApartment: bookingUnit || 'General Residence Inquiry' }); setNotification('Thank you! Your request has been successfully submitted to our sales team.'); closeForm(); }}><button type="button" className="modal-close" onClick={closeForm}><X /></button><h2>Book a<br /><span>call</span></h2><div className="modal-emblem">✣</div>{bookingUnit && bookingUnit !== 'General Residence Inquiry' && <p style={{ color: '#d4af37', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>INQUIRING FOR: {bookingUnit}</p>}<p className="modal-note">LEAVE YOUR DETAILS AND WE<br />WILL GET BACK TO YOU WITHIN<br />24 HOURS.</p><div className="modal-fields"><label>NAME:<input name="name" required /></label><label>EMAIL:<input name="email" required type="email" /></label><label>PHONE:<input name="phone" required /></label><label>MESSAGE:<textarea name="message" /></label><div className="modal-consent">By submitting, you agree to<br />our Privacy policy.</div><button>SUBMIT</button></div></form></div>}
      {notification && <div className="era-modal" style={{ zIndex: 9999 }} onClick={() => setNotification(null)}><div style={{ background: '#1a1a1a', padding: '60px 40px', color: '#fff', textAlign: 'center', maxWidth: '450px', margin: 'auto', marginTop: '30vh', border: '1px solid #333', position: 'relative' }}><h3 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 300, marginBottom: '30px', fontSize: '26px' }}>{notification}</h3><button onClick={() => setNotification(null)} style={{ background: '#fff', color: '#000', padding: '12px 35px', border: 'none', cursor: 'pointer', letterSpacing: '2px', fontSize: '12px' }}>CLOSE</button></div></div>}
    </main>
  }

  return <main className="era-site">
    <div className="custom-cursor" style={{ transform: `translate(${cursor.x}px,${cursor.y}px)` }} />
    <aside className={`persistent-era-rail ${railOnDark ? 'rail-on-dark' : 'rail-on-light'}`}><div className="persistent-emblem"><svg ref={emblemSvgRef} viewBox="0 0 120 120"><defs><path id="persistentEmblemPath" d="M60,60 m-43,0 a43,43 0 1,1 86,0 a43,43 0 1,1 -86,0" /></defs><text><textPath href="#persistentEmblemPath" textLength="270">D W E L L O R A　•　R E S I D E N C E　•　</textPath></text></svg><span>✣</span></div><b>{String(Math.round(railNumber)).padStart(2, '0')}</b><i />{isAtEnd ? (<><small style={{ cursor: 'pointer', pointerEvents: 'auto' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>TO TOP</small><ArrowUp style={{ cursor: 'pointer', pointerEvents: 'auto' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} /></>) : (<><small>SCROLL</small><ArrowDown /></>)}</aside>
    <header className={`era-nav ${heroProgress < .98 ? 'nav-on-hero' : ''}`}><a href="#top" className="era-mark" onClick={e => { e.preventDefault(); navigateTo('/') }}><span>Dwellora</span></a><div className="nav-actions"><a href="/apartments" onClick={e => { e.preventDefault(); navigateTo('/apartments') }}>Select an apartment</a><button onClick={openForm}>Book a call</button><a className="nav-contact" href="/contact" onClick={e => { e.preventDefault(); navigateTo('/contact') }}>Contact</a><button className="era-menu" onClick={() => setMenu(!menu)}><Menu /></button></div></header>
    {menu && <div className="menu-panel"><button onClick={() => setMenu(false)}><X /></button><p>THE MENU</p>{['Home', 'Concept', 'Location', 'Residences', 'Amenities', 'Architecture', 'Contact'].map(x => <a key={x} href={`#${x.toLowerCase()}`} onClick={() => setMenu(false)}>{x}</a>)}<a href="/admin/login" onClick={e => { e.preventDefault(); setMenu(false); navigateTo('/admin/login') }} style={{ color: '#d4af37', marginTop: '16px', borderTop: '1px solid rgba(212, 175, 55, 0.25)', paddingTop: '16px' }}>🔐 Admin Portal</a></div>}

    <section className="era-hero-scroll" id="top"><div className="era-hero" style={{ '--mx': `${cursor.nx * 18}px`, '--my': `${cursor.ny * 12}px` }}><img className="pool-stage day-image" src={heroDayPhoto} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 1.2s ease-in-out', opacity: heroTime === 'DAY' ? 1 : 0, transform: `scale(${1.035 - heroProgress * .035})` }} /><img className="pool-stage night-image" src={siteContent?.heroNightImage || "/assets/luxury_villa_night.jpg"} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 1.2s ease-in-out', opacity: heroTime === 'NIGHT' ? 1 : 0, transform: `scale(${1.035 - heroProgress * .035})` }} /><div className="era-emblem"><svg className="emblem-ring" viewBox="0 0 120 120" aria-hidden="true" style={{ transform: `rotate(${heroProgress * 720}deg)` }}><defs><path id="emblemPath" d="M60,60 m-43,0 a43,43 0 1,1 86,0 a43,43 0 1,1 -86,0" /></defs><text><textPath href="#emblemPath" startOffset="0%" textLength="270">D W E L L O R A　•　R E S I D E N C E　•　</textPath></text></svg><span className="emblem-core">✣</span></div><div className="era-title" style={{ opacity: Math.max(0, 1 - heroProgress * 3.2), transform: `translateY(${-heroProgress * 70}px)` }}><h1>{siteContent?.heroTitle || 'Dwellora'}</h1><div><span>A PLACE</span><i style={{ pointerEvents: 'auto', position: 'relative', zIndex: 9999, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><button style={{ all: 'unset', cursor: 'pointer', opacity: heroTime === 'DAY' ? 1 : 0.4, transition: 'opacity 0.3s', padding: '10px 5px', pointerEvents: 'auto' }} onClick={() => setHeroTime('DAY')}>BY DAY</button><span style={{ padding: '0 8px', opacity: 0.7 }}>—</span><button style={{ all: 'unset', cursor: 'pointer', opacity: heroTime === 'NIGHT' ? 1 : 0.4, transition: 'opacity 0.3s', padding: '10px 5px', pointerEvents: 'auto' }} onClick={() => setHeroTime('NIGHT')}>BY NIGHT</button></i><span>TO RETURN TO</span></div></div><button className="select-apartment" onClick={() => navigateTo('/apartments')}>SELECT<br />AN APARTMENT</button><div className="hero-links">BOOK A CALL<br />CONTACT</div><div className="hero-index">{String(Math.round(heroProgress * 16)).padStart(2, '0')}</div>
      <div className="pool-hotspots" style={{ opacity: Math.max(0, Math.min(1, (heroProgress - .15) * 5)) }}>
        <button onMouseEnter={() => setActiveHotspot(0)} onMouseLeave={() => setActiveHotspot(null)} />
        <button onMouseEnter={() => setActiveHotspot(1)} onMouseLeave={() => setActiveHotspot(null)} />
        <button onMouseEnter={() => setActiveHotspot(2)} onMouseLeave={() => setActiveHotspot(null)} />
        {activeHotspot === 0 && <div className="hotspot-card" style={{ left: '26%', top: '47%' }}><h4>Lush Gardens</h4><p>Private outdoor sanctuaries seamlessly connected to your living space.</p></div>}
        {activeHotspot === 1 && <div className="hotspot-card" style={{ left: '56%', top: '54%' }}><h4>Infinity Pool</h4><p>A tranquil infinity edge pool with panoramic horizon views.</p></div>}
        {activeHotspot === 2 && <div className="hotspot-card" style={{ right: '23%', top: '70%', transform: 'translate(50%, -120%)' }}><h4>Sunken Lounge</h4><p>An elegant outdoor lounge perfect for evening gatherings.</p></div>}
      </div>
      <button className="view-apartments" style={{ opacity: Math.max(0, Math.min(1, (.52 - heroProgress) * 8)), pointerEvents: heroProgress < .52 ? 'auto' : 'none' }} onClick={() => navigateTo('/apartments')} onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--mag-x', `${(e.clientX - r.left - r.width / 2) * .16}px`); e.currentTarget.style.setProperty('--mag-y', `${(e.clientY - r.top - r.height / 2) * .16}px`) }} onMouseLeave={e => { e.currentTarget.style.setProperty('--mag-x', '0px'); e.currentTarget.style.setProperty('--mag-y', '0px') }}>VIEW AVAILABLE<br />APARTMENTS</button><div className="elegant-statement-container" style={{ opacity: Math.max(0, Math.min(1, (heroProgress - .54) / .18)), transform: `translate3d(0,${50 - Math.max(0, Math.min(1, (heroProgress - .54) / .46)) * 50}%,0)` }}><div className="elegant-statement"><h2>{siteContent?.heroStatementTitle || <>Designed to elevate<br />everyday living</>}</h2><div className="statement-divider"></div><p>{siteContent?.heroStatementText || <>A harmonious blend of coastal serenity and<br />modern architectural sophistication.</>}</p></div></div><div className="scroll-note"><p>SCROLL</p><ArrowDown /></div></div></section>
    {cookies && <div className="cookie-panel"><div><span>COOKIES</span><p>This website uses cookies to ensure you get the best experience.</p></div><button onClick={() => setCookies(false)}>Accept</button><button onClick={() => setCookies(false)}>Decline</button></div>}

    <section className="manifesto era-location-intro" id="concept"><h2 key={`title-${introSlide}`} className="intro-changing">{introSlides[introSlide].title}</h2><div className="location-slider"><div className="intro-media"><img key={introSlides[introSlide].image} src={introSlides[introSlide].image} alt={introSlides[introSlide].title} /></div><div className="slider-nav"><button onClick={() => setIntroSlide(current => (current + 2) % 3)}>‹</button><b>{introSlide + 1}</b><i style={{ '--slide': introSlide }} /><b>{(introSlide + 1) % 3 + 1}</b><button onClick={() => setIntroSlide(current => (current + 1) % 3)}>›</button></div></div><p key={`copy-${introSlide}`} className="location-description intro-changing">{introSlides[introSlide].description}</p><strong>DESIGNED AS A COMMUNITY,<br />NOT A COMPLEX</strong></section>

    <section className="concept-image estate-exterior-reveal"><img src={siteContent?.revealImage || "/assets/estate-exterior-reveal.png"} /><div><span>{siteContent?.revealBadge || 'ESTATESPHERE RESIDENCES'}</span><h2>{siteContent?.revealTitle || <>Designed to<br />feel like home</>}</h2><p>{siteContent?.revealDescription || 'Landscaped terraces, timeless materials and generous openings connect every residence to light, greenery and calm.'}</p></div></section>

    <section className="estate-horizontal-story" ref={horizontalStoryRef}>
      <div className="horizontal-sticky">
        <div className="horizontal-track" style={{ transform: `translate3d(${-storyProgress * 200}vw,0,0)` }}>
          <article className="estate-concept-panel story-concept">
            <video className="concept-left-flower-video" autoPlay muted loop playsInline preload="auto" aria-hidden="true" poster="/assets/era-reference-flowers.avif"><source src="/assets/era-reference-flowers.webm" type="video/webm" /></video>
            <span>{siteContent?.conceptKicker || 'THE CONCEPT'}</span>
            <h2>{siteContent?.conceptHeading || <>ESTATESPHERE IS A BOUTIQUE RESIDENTIAL COMMUNITY,<br />DESIGNED AROUND PRIVACY, WELLBEING AND<br />TIMELESS CONTEMPORARY LIVING</>}</h2>
            <p>{siteContent?.conceptDescription || 'Created for modern city life, the community combines thoughtful architecture with warm materials, natural landscaping and carefully curated spaces.'}</p>
            <b>✣</b>
          </article>
          <img className="story-shared-image" src="/assets/estate-private-terrace.png" alt="EstateSphere private terrace" />
          <article className="story-intro">
            <h2>{siteContent?.locationKicker ? siteContent.locationKicker.split('\n').map((l, i) => <React.Fragment key={i}>{l}<br /></React.Fragment>) : <>NEW<br />GOLDEN<br />MILE</>}</h2>
            <img src="/assets/estate-flower-complete.png" alt="Bougainvillea landscaping" />
            <div className="story-copy"><h3>{siteContent?.locationTitle || 'BETWEEN MARBELLA AND ESTEPONA'}</h3><p>{siteContent?.locationCopy || 'Surrounded by beaches, golf courses, wellness clubs and established amenities, with the coast always close.'}</p></div>
          </article>
          <article className="story-route">
            <h2>{siteContent?.routeHeading ? (siteContent.routeHeading.includes('yours') ? siteContent.routeHeading.split('yours').map((part, i) => <React.Fragment key={i}>{i > 0 && <em>yours</em>}{part}</React.Fragment>) : siteContent.routeHeading) : <>THE COAST YOU WANTED<br /><em>yours</em><br />THIS YEAR</>}</h2>
            <video className="route-flower-video" autoPlay muted loop playsInline preload="auto" aria-hidden="true" poster="/assets/era-reference-flowers.avif"><source src="/assets/era-reference-flowers.webm" type="video/webm" /></video>
            <button onClick={() => navigateTo('/apartments')}>VIEW AVAILABLE<br />APARTMENTS</button>
            <div className="route-line" style={{ '--draw-progress': Math.max(0, Math.min(1, (storyProgress - 0.75) / 0.25)) }}>
              <span>GIBRALTAR<br /><b>50 MIN</b></span>
              <span>ESTEPONA<br /><b>10 MIN</b></span>
              <span>KEMPINSKI<br /><b>5 MIN</b></span>
              <span>✣</span>
              <span>PUERTO BANUS<br /><b>20 MIN</b></span>
              <span>MARBELLA<br /><b>25 MIN</b></span>
              <span>MALAGA AIRPORT<br /><b>45 MIN</b></span>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section className="cinematic-property-scroll" ref={cinematicRef} aria-label="EstateSphere residence reveal">
      <div className="cinematic-property-sticky">
        <img src="/assets/estate-apartment-exterior.png" alt="EstateSphere landscaped residence" style={{ opacity: Math.min(1, .08 + cinematicProgress * 3.2), transform: `scale(${1.11 - cinematicProgress * .07}) translate3d(0,${8 - cinematicProgress * 12}%,0)`, filter: `saturate(${.78 + cinematicProgress * .22}) contrast(${.94 + cinematicProgress * .06})` }} />
        <div className="cinematic-property-wash" style={{ opacity: Math.max(0, 1 - cinematicProgress * 1.65) }} />
        <div className="cinematic-property-caption" style={{ opacity: Math.max(0, Math.min(1, (cinematicProgress - .48) * 3.5)), transform: `translate3d(0,${28 - (Math.max(0, Math.min(1, (cinematicProgress - .48) * 3.5)) * 28)}px,0)` }}><b>ESTATESPHERE RESIDENCES</b><span>LANDSCAPED LIVING · PRIVATE HOMES</span></div>
      </div>
    </section>

    <section className="apartment-showcase" id="residences">
      <div className="apartment-showcase-stats"><span>BEDROOMS</span><b>{activeResidences[apartmentSlide]?.beds}</b><span>AREA UP TO</span><strong>{activeResidences[apartmentSlide]?.area}</strong></div>
      <div className="apartment-showcase-media"><img key={activeResidences[apartmentSlide]?.image} src={activeResidences[apartmentSlide]?.image} alt={activeResidences[apartmentSlide]?.type} /></div>
      <div className="apartment-showcase-copy"><small>{activeResidences[apartmentSlide]?.status}</small><strong>{activeResidences[apartmentSlide]?.price}</strong><p>{activeResidences[apartmentSlide]?.description}</p><button onClick={openForm}>VIEW THIS APARTMENT</button></div>
      <h2>{activeResidences[apartmentSlide]?.type}</h2>
      <div className="apartment-showcase-nav"><button onClick={() => setApartmentSlide(current => (current + activeResidences.length - 1) % activeResidences.length)}>‹</button><b>{apartmentSlide + 1}</b><i><span style={{ width: `${((apartmentSlide + 1) / activeResidences.length) * 100}%` }} /></i><b>{activeResidences.length}</b><button onClick={() => setApartmentSlide(current => (current + 1) % activeResidences.length)}>›</button></div>
    </section>

    <section className="residence-statement" style={{ '--flower-x': `${cursor.nx * 13}px`, '--flower-y': `${cursor.ny * 9}px` }}>
      <div className="residence-breath-line" />
      <p className="statement-kicker">{siteContent?.residencesStatementKicker || <>A PLACE TO LIVE — TO<br />RETURN YEAR AFTER YEAR</>}</p>
      <img className="statement-flower" src="/assets/estate-reference-branch.png" alt="Bougainvillea landscaping" />
      <h2>{siteContent?.residencesStatementTitle || <>RESIDENCES RANGE FROM 104 TO 244 SQ.M., OFFERING<br />SPACIOUS SINGLE-LEVEL AND DUPLEX LAYOUTS WITH<br />GENEROUS TERRACES AND ROOFTOP SOLARIUMS.</>}</h2>
      <span className="statement-mark">✣</span>
    </section>
    <section className="community-feature space-reveal-scroll" ref={spaceRevealRef} aria-label="EstateSphere gated community">
      <div className="community-feature-sticky space-reveal-sticky">
        {activeFeatures.map((feat, idx) => (
          <img key={feat.title || idx} src={feat.image} alt={feat.title} style={{ opacity: activeCommunityTab === idx ? 1 : 0, transition: 'opacity 0.6s ease' }} />
        ))}
        <div className="community-shade" />
        <div className="community-list">
          {activeFeatures.map((feat, idx) => (
            <span key={feat.title || idx} style={{ cursor: 'pointer', borderLeft: activeCommunityTab === idx ? '2px solid #fff' : '2px solid transparent', opacity: activeCommunityTab === idx ? 1 : 0.42, fontWeight: activeCommunityTab === idx ? 'bold' : 'normal', transition: 'all 0.3s ease' }} onClick={() => setActiveCommunityTab(idx)}>{feat.title}</span>
          ))}
        </div>
        <div className="community-copy"><small>{activeFeatures[activeCommunityTab]?.title}</small><h2>{activeFeatures[activeCommunityTab]?.copy?.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br /></React.Fragment>)}</h2></div>
        <button className="community-call" onClick={openForm} onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--call-x', `${(e.clientX - r.left - r.width / 2) * .12}px`); e.currentTarget.style.setProperty('--call-y', `${(e.clientY - r.top - r.height / 2) * .12}px`) }} onMouseLeave={e => { e.currentTarget.style.setProperty('--call-x', '0px'); e.currentTarget.style.setProperty('--mag-y', '0px') }}>BOOK A CALL<br />NOW</button>
        <div className="space-reveal-cream" style={{ clipPath: `circle(${Math.max(0, (spaceProgress - 0.65) * (1 / 0.35) * 137)}% at 50% 112%)` }} />
        <h2 style={{ opacity: Math.max(0, Math.min(1, (spaceProgress - 0.65) * 3)), transform: `translate3d(-50%,${70 - Math.max(0, Math.min(1, (spaceProgress - 0.65) * 3)) * 70}px,0)` }}>THE<br />SPACE<br />TO <em>Live in</em></h2>
      </div>
    </section>
    <section className="lifestyle-slides" ref={lifestyleRef}>
      <div className="lifestyle-sticky">
        <div className="lifestyle-wrap">
          <div className="lifestyle-text-col">
            <div className="lifestyle-text-content">
              <div className={`lifestyle-text-slide ${lifestyleProgress < 0.33 ? 'is-active' : ''}`}>
                <h2>WELLNESS-CENTERED<br />AMENITIES</h2>
                <p>Designed as a retreat, our spaces foster a sense of well-being. A state-of-the-art gym, indoor pools, and dedicated wellness areas seamlessly connect the physical and mental elements of a balanced life.</p>
              </div>
              <div className={`lifestyle-text-slide ${lifestyleProgress >= 0.33 && lifestyleProgress < 0.66 ? 'is-active' : ''}`}>
                <h2>ART INSPIRED<br />SPACES</h2>
                <p>From artful communal lounges to thoughtfully curated design details, every environment celebrates a rich sense of place, blending classic proportions with contemporary aesthetics.</p>
              </div>
              <div className={`lifestyle-text-slide ${lifestyleProgress >= 0.66 ? 'is-active' : ''}`}>
                <h2>NATURE INFUSED<br />RETREATS</h2>
                <p>Intertwining lush foliage with architectural brilliance, our outdoor areas provide a sanctuary where residents can connect deeply with nature, bringing the outside in.</p>
              </div>
            </div>
          </div>
          <div className="lifestyle-image-col">
            <img
              src="/assets/wellness_gym_1786353488588.png"
              className="lifestyle-big-image"
              style={{ zIndex: 1 }}
            />
            <img
              src="/assets/art_lounge_1786353520419.png"
              className="lifestyle-big-image"
              style={{
                zIndex: 2,
                clipPath: `inset(${100 - Math.min(100, Math.max(0, (lifestyleProgress - 0.3) * 12 * 100))}% 0 0 0)`
              }}
            />
            <img
              src="/assets/nature_meditation_1786353553138.png"
              className="lifestyle-big-image"
              style={{
                zIndex: 3,
                clipPath: `inset(${100 - Math.min(100, Math.max(0, (lifestyleProgress - 0.63) * 12 * 100))}% 0 0 0)`
              }}
            />

            <img
              src="/assets/wellness_corridor_1786353498484.png"
              className="lifestyle-small-image"
              style={{
                opacity: Math.max(0, Math.min(1, 1 - (lifestyleProgress - 0.28) * 15)),
                transform: `translateY(${lifestyleProgress < 0.33 ? Math.max(0, 20 - (lifestyleProgress * 15 * 20)) : 0}%)`,
                pointerEvents: lifestyleProgress < 0.33 ? 'auto' : 'none'
              }}
            />
            <img
              src="/assets/art_hallway_1786353532366.png"
              className="lifestyle-small-image"
              style={{
                opacity: Math.max(0, Math.min(1, (lifestyleProgress - 0.3) * 15)) * Math.max(0, Math.min(1, 1 - (lifestyleProgress - 0.61) * 15)),
                transform: `translateY(${lifestyleProgress >= 0.33 && lifestyleProgress < 0.66 ? Math.max(0, 20 - ((lifestyleProgress - 0.33) * 15 * 20)) : 20}%)`,
                pointerEvents: lifestyleProgress >= 0.33 && lifestyleProgress < 0.66 ? 'auto' : 'none'
              }}
            />
            <img
              src="/assets/nature_cabin_1786353568381.png"
              className="lifestyle-small-image"
              style={{
                opacity: Math.max(0, Math.min(1, (lifestyleProgress - 0.63) * 15)),
                transform: `translateY(${lifestyleProgress >= 0.66 ? Math.max(0, 20 - ((lifestyleProgress - 0.66) * 15 * 20)) : 20}%)`,
                pointerEvents: lifestyleProgress >= 0.66 ? 'auto' : 'none'
              }}
            />
          </div>
        </div>
      </div>
    </section>
    <section className="interior-cinematic-scroll" ref={interiorCinemaRef} aria-label="Luxury two bedroom apartment cinematic tour">
      <div className="interior-cinematic-sticky">
        {interiorSlides.map((slide, index) => <div key={slide.name} className={`cinema-room ${index === cinemaIndex ? 'is-current' : ''}`}>
          <div className="cinema-panel cinema-panel-left" style={{ width: `${cinemaPanelWidth}vw`, height: `${cinemaPanelHeight}vh`, right: `calc(50% + ${cinemaGap / 2}vw)` }}><img src={slide.image} alt="" /></div>
          <div className="cinema-panel cinema-panel-right" style={{ width: `${cinemaPanelWidth}vw`, height: `${cinemaPanelHeight}vh`, left: `calc(50% + ${cinemaGap / 2}vw)` }}><img src={slide.image} alt={slide.alt} /></div>
        </div>)}
        <div className="cinema-room-title" style={{ opacity: cinemaReveal, transform: `translate3d(-50%,${(1 - cinemaReveal) * 55}px,0)` }}><small>ESTATESPHERE · ONE LUXURY 2 BHK</small><h2>{interiorSlides[cinemaIndex].name}</h2><p>{cinemaIndex === 0 ? 'A calm master suite opening to a private landscaped terrace.' : cinemaIndex === 1 ? 'A warm second bedroom designed for rest, work and visiting family.' : cinemaIndex === 2 ? 'A sculpted kitchen with generous storage and seamless dining flow.' : 'A light-filled living hall made for everyday life and entertaining.'}</p><span>{String(cinemaIndex + 1).padStart(2, '0')} / 04</span></div>
        <div className="cinema-progress"><i style={{ height: `${interiorCinemaProgress * 100}%` }} /><b>2 BHK<br />INTERIOR TOUR</b></div>
      </div>
    </section>
    <section className="location" id="location"><div className="location-copy"><span>INDIA</span><h2>Golf Course<br />Extension Road</h2><h3>Between Gurugram<br />and the Aravallis</h3><p>Connected to everything essential, while designed around the feeling of returning home.</p></div><div className="location-image"><img src="/assets/exterior-garden-8k.jpg" /><span>DRAG TO SEE MORE →</span></div></section>

    <section className="residence-section" id="residences"><div className="era-section-head"><span>{siteContent?.residencesHeadTitle || 'THE RESIDENCES'}</span><h2>{siteContent?.residencesHeadSubtitle || <>Space to make<br />your own</>}</h2><p>{siteContent?.residencesHeadCopy || 'Single-level and duplex layouts with generous terraces, gardens and private outdoor access.'}</p></div><div className="residence-cards">{activeResidences.map((r, i) => <article key={r.type}><img src={r.image} alt={r.type} /><span>0{i + 1}</span><div><h3>{r.type}</h3><p>Bedrooms <b>{r.beds}</b></p><p>Area up to <b>{r.area}</b></p><button onClick={() => navigateTo('/apartments')}>Explore <ArrowRight /></button></div></article>)}</div></section>

    <section className="amenities" id="amenities"><div className="amenity-visual"><img src="/assets/kiara-interior-8k.jpg" alt="EstateSphere interior" /><div><Waves /><span>Designed for<br />slower living</span></div></div><div className="amenity-list"><span>AMENITIES</span><h2>Made to live<br />well in</h2>{amenities.map(([x, p], i) => <article key={x}><b>0{i + 1}</b><div><h3>{x}</h3><p>{p}</p></div><ChevronRight /></article>)}</div></section>

    <section className="details"><div><span>THE SPACE TO</span><h2>Live in</h2></div><img src="/assets/bedroom-8k.jpg" /><article><h3>{siteContent?.detailsTitle || 'Every detail selected for effortless living'}</h3><p>{siteContent?.detailsCopy || 'Underfloor heating. Climate automation. Smart access. Adjustable shutters. Materials chosen to age beautifully.'}</p></article></section>

    <section className="architecture" id="architecture"><div className="architecture-3d"><ResidenceScene /></div><div><span>ARCHITECTURE</span><h2>{siteContent?.architectureTitle || <>Clean lines.<br />Mediterranean warmth.</>}</h2><p>{siteContent?.architectureCopy || 'Natural stone, layered terraces and expansive openings connect the residences to landscape and light.'}</p></div></section>

    <section className="era-contact" id="contact"><p>{siteContent?.ctaKicker || 'A short conversation is enough to understand which residence fits your life.'}</p><h2>{siteContent?.ctaTitle || <>Perfect<br />city views</>}</h2><button onClick={openForm}>{siteContent?.ctaButtonText || 'Book a private call'} <ArrowRight /></button></section>
    <section className="estate-credentials" aria-label="EstateSphere credentials">
      <p className="credentials-kicker">A PLACE TO LIVE — TO<br />RETURN YEAR AFTER YEAR</p>
      <div style={{ textAlign: 'center', marginTop: '18vh', marginBottom: '4vh', position: 'relative', zIndex: 2 }}>
        <span className="credentials-eyebrow" style={{ margin: 0, background: '#dedbd1' }}>RESIDENCE BENEFITS</span>
      </div>
      <div className="credentials-promise">
        <div className="credentials-image-wrap">
          <img className="credentials-3d-image" src="/assets/happy_family_keys_moving.jpg" alt="A happy family holding keys in their new luxury apartment at Dwellora" />
          <span className="credentials-image-edge" />
        </div>
        <div className="credentials-copy">
          <h2>ELEVATED<br />LIVING<br /><em>Experience</em></h2>
          <p>Every residence is designed to offer an unparalleled lifestyle, blending modern luxury with ultimate comfort. Discover the exclusive benefits that come with living at EstateSphere.</p>
          <ul className="credentials-points">
            <li><b>01</b><div><strong>Smart Home Integration</strong><span>Seamlessly control lighting, climate, and security from your device for effortless everyday living.</span></div></li>
            <li><b>02</b><div><strong>Private Outdoor Spaces</strong><span>Expansive terraces and balconies that seamlessly connect your interior living spaces with the outdoors.</span></div></li>
            <li><b>03</b><div><strong>Premium Finishes</strong><span>Carefully curated materials including Italian marble, custom oak cabinetry, and designer fixtures.</span></div></li>
          </ul>
        </div>
      </div>
      <h2 className="credentials-license">DEVELOPER<br />SALES AND MARKETING<br />LICENSE OBTAINED<br /><span>2026</span></h2>
    </section>
    <section className="estate-final-view" ref={finalRef} aria-label="EstateSphere terrace views" style={{ visibility: pageProgress > .85 ? 'visible' : 'hidden' }}>
      <div className="estate-final-view-sticky">
        <img src="/assets/estate-private-terrace.png" alt="EstateSphere private terrace view" style={{ transform: `scale(1.05) translate3d(0,${-finalProgress * 30}%,0)` }} />
        <div className="final-view-title" style={{ opacity: Math.max(0, 1 - finalProgress * 2.8), transform: `translate3d(0,${-finalProgress * 90}px,0)` }}><h2>PERFECT<br />CITY VIEWS</h2><p>FROM PRIVATE TERRACES</p></div>
        <button className="final-view-cta" onClick={() => navigateTo('/apartments')} style={{ opacity: Math.max(0, Math.min(1, (finalProgress - 0.22) * 2.8)), transform: `translate3d(-50%,calc(-50% + ${(1 - finalProgress) * 110}px),0)` }}>VIEW AVAILABLE<br />APARTMENTS</button>
      </div>
    </section>
    <section className="estate-footer" aria-label="EstateSphere footer" style={{ visibility: pageProgress > .85 ? 'visible' : 'hidden' }}>
      <div className="estate-footer-content">
        <div className="estate-footer-logo">✣</div>
        <div className="estate-footer-phone">
          <a href={`tel:${siteSettings?.supportPhone || '+91 (798) 788-0769'}`} style={{ color: 'inherit', textDecoration: 'none' }}>
            {siteSettings?.supportPhone || '+91 (798) 788-0769'}
          </a>
          {siteSettings?.whatsappNumber && (
            <div style={{ marginTop: '6px' }}>
              <a 
                href={`https://wa.me/${siteSettings.whatsappNumber.replace(/[^0-9]/g, '')}`} 
                target="_blank" 
                rel="noreferrer"
                style={{ color: '#25D366', textDecoration: 'none', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '5px', letterSpacing: '1px' }}
              >
                WHATSAPP: {siteSettings.whatsappNumber}
              </a>
            </div>
          )}
        </div>
        <div className="estate-footer-address">
          {siteSettings?.officeAddress ? (
            siteSettings.officeAddress.split('\n').map((line, idx) => (
              <React.Fragment key={idx}>{line}<br /></React.Fragment>
            ))
          ) : (
            <>
              302-B, 3RD FLOOR,<br />
              SWADESH BHAWAN INDORE (452001)<br />
            </>
          )}
          {siteSettings?.supportEmail ? siteSettings.supportEmail.toUpperCase() : 'INFO@CODERVU.COM'}
        </div>
      </div>
      <div className="estate-footer-bottom">
        <div className="estate-footer-credits-left">
          <b>DWELLORA.</b><br />
          <span>©2026 ALL RIGHTS RESERVED</span><br />
          <a href="#privacy" onClick={e => e.preventDefault()}>PRIVACY POLICY, TERMS OF USE</a>
        </div>
        <div className="estate-footer-credits-right">
          <div className="made-by-icon">
            <svg viewBox="0 0 100 100" width="18" height="18" fill="currentColor">
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="6" fill="none" />
              <path d="M50,15 A35,35 0 0,1 85,50" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          <span>MADE BY</span>
          <b>DWELLORA</b>
        </div>
      </div>
    </section>
    {form && <div className={`era-modal ${formClosing ? 'is-closing' : ''}`} onMouseDown={closeForm}><form onMouseDown={e => e.stopPropagation()} onSubmit={e => { e.preventDefault(); const formData = new FormData(e.target); const data = Object.fromEntries(formData); dataStore.addInquiry(data); setNotification('Thank you! Your request has been successfully submitted.'); closeForm(); }}><button type="button" className="modal-close" onClick={closeForm}><X /></button><h2>Book a<br /><span>call</span></h2><div className="modal-emblem">✣</div><p className="modal-note">LEAVE YOUR DETAILS AND WE<br />WILL GET BACK TO YOU WITHIN<br />24 HOURS.</p><div className="modal-fields"><label>NAME:<input name="name" required /></label><label>EMAIL:<input name="email" required type="email" /></label><label>PHONE:<input name="phone" required /></label><label>MESSAGE:<textarea name="message" /></label><div className="modal-consent">By submitting, you agree to<br />our Privacy policy.</div><button>SUBMIT</button></div></form></div>}
    {notification && <div className="era-modal" style={{ zIndex: 9999 }} onClick={() => setNotification(null)}><div style={{ background: '#1a1a1a', padding: '60px 40px', color: '#fff', textAlign: 'center', maxWidth: '450px', margin: 'auto', marginTop: '30vh', border: '1px solid #333', position: 'relative' }}><h3 style={{ fontFamily: '"Playfair Display", serif', fontWeight: 300, marginBottom: '30px', fontSize: '26px' }}>{notification}</h3><button onClick={() => setNotification(null)} style={{ background: '#fff', color: '#000', padding: '12px 35px', border: 'none', cursor: 'pointer', letterSpacing: '2px', fontSize: '12px' }}>CLOSE</button></div></div>}
  </main>
}
