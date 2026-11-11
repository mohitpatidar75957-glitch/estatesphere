import React, { useState, useEffect, useRef } from 'react'
import FloorPlanSVG from './FloorPlanSVG'
import ApartmentScene from './ApartmentScene'
import { ArrowDown, ArrowUp, X } from 'lucide-react'
import { dataStore } from '../admin/dataStore'
import { openApartmentBrochure } from '../utils/brochureGenerator'

// Progressive 360° loader: shows a blurred low-res preview OVER the
// canvas while the full 8K panorama streams in, then fades the preview
// away to reveal the sharp interactive view. The canvas is always mounted
// so there is no black-flash between mount and texture decode.
function PanoramaLoader({ url, thumbnail }) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(false)
    const img = new Image()
    img.onload = () => setLoaded(true)
    img.onerror = () => setLoaded(true)
    img.src = url
    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [url])

  return (
    <div className={`pano-loader ${loaded ? 'ready' : ''}`} style={{ width: '100%', height: '100%', position: 'relative', backgroundColor: '#1a1611' }}>
      {thumbnail && (
        <div
          className="pano-loader-thumbnail"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${thumbnail})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 5,
            opacity: loaded ? 0 : 1,
            transition: 'opacity 0.45s ease-in-out',
            pointerEvents: loaded ? 'none' : 'auto'
          }}
        />
      )}
      <ApartmentScene key={url} mode="room" panoramaUrl={url} autoRotate={false} />
    </div>
  )
}

const generateFallbackProperties = () => {
  const list = []
  const blocks = ["BLOCK B1", "BLOCK B2", "BLOCK B3"]
  const floors = ["0 FLOOR", "1 FLOOR", "2 FLOOR", "3 FLOOR"]
  const typologies = ["GROUND FLOOR + BASEMENT", "GROUND FLOOR", "PENTHOUSE DUPLEX"]

  for (let i = 1; i <= 25; i++) {
    const block = blocks[(i - 1) % blocks.length]
    const floorNum = (i - 1) % 4
    const floor = floors[floorNum]

    let typology
    if (floorNum === 0) {
      typology = (i - 1) % 8 === 0 ? typologies[0] : typologies[1]
    } else if (floorNum === 3) {
      typology = typologies[2]
    } else {
      typology = typologies[1]
    }

    const bedrooms = (i % 2 === 0) ? 2 : 3
    const areaSqm = 90 + (i * 6) % 160
    const terraceArea = 15 + (i * 5) % 45
    const aptNum = `No-${i < 10 ? '0' + i : i}`

    list.push({
      id: i,
      title: `${bedrooms} Bed Residence - Unit ${aptNum}`,
      apartmentNumber: aptNum,
      block: block,
      floor: floor,
      terraceArea: terraceArea,
      typology: typology,
      completion: "4Q 2026",
      bedrooms: bedrooms,
      areaSqm: areaSqm,
      price: 25000000 + i * 1250000
    })
  }
  return list
}

const getApartmentInfo = (apartment) => {
  if (!apartment) return { description: '', benefits: [] }
  const type = (apartment.typology || '').toUpperCase()
  if (type.includes('BASEMENT')) {
    return {
      description: `${apartment.bedrooms === 3 ? 'Three' : apartment.bedrooms || 'Three'} bedrooms, open-plan living, and a large terrace that connects directly to the communal garden and pool area.`,
      benefits: ["Pool & gym", "Storage", "Energy B", "Parking", "Aerothermal", "Stone floors", "Villeroy & Boch", "Underfloor heating"]
    }
  } else if (type.includes('PENTHOUSE')) {
    return {
      description: `${apartment.bedrooms === 3 ? 'Three' : apartment.bedrooms || 'Three'} bedrooms duplex penthouse with private solarium deck, lounge area, and panoramic coastal views.`,
      benefits: ["Pool & gym", "Storage", "Energy A", "Private Solarium", "Aerothermal", "Stone floors", "Villeroy & Boch", "Underfloor heating"]
    }
  } else {
    return {
      description: `${apartment.bedrooms === 2 ? 'Two' : apartment.bedrooms || 'Two'} bedrooms, open-plan layout with direct access to private landscaped garden and community pool.`,
      benefits: ["Pool & gym", "Storage", "Energy B", "Parking", "Aerothermal", "Private garden", "Villeroy & Boch", "Stone floors"]
    }
  }
}

const communityFeatures = [
  { title: 'GATED COMMUNITY', image: '/assets/community_exterior_1787305142682.jpg', copy: 'INSTEAD OF CORRIDORS, WALKING\nPATHS CONNECT the APARTMENTS — MAKING\nDWELLORA FEEL CLOSER TO A GROUP OF\nPRIVATE HOMES THAN A STANDARD COMPLEX.' },
  { title: 'SWIMMING POOL', image: '/assets/community_pool_1787305166324.jpg', copy: 'A CALM OASIS FEATURING A SALTWATER\nPOOL, CHILDREN\'S POOL, AND DEDICATED\nRELAXATION AREAS FOR EVERYDAY WELLBEING.' },
  { title: 'PARKING AREA', image: '/assets/community_parking_1787305178991.jpg', copy: 'SECURE UNDERGROUND PARKING WITH\nOPTIONAL EV CHARGING STATIONS,\nENSURING CONVENIENCE AND PEACE OF MIND.' },
  { title: 'GYM', image: '/assets/community_gym_1787305191603.jpg', copy: 'A STATE-OF-THE-ART FITNESS CENTER\nDESIGNED FOR MOVEMENT AND RECOVERY,\nFEATURING PREMIUM EQUIPMENT.' },
  { title: 'LANDSCAPING', image: '/assets/community_landscaping_1787305205295.jpg', copy: 'MEDITERRANEAN GARDENS SOFTEN EVERY\nARCHITECTURAL LINE, INTERTWINING LUSH\nFOLIAGE WITH OUTDOOR LIVING SPACES.' }
]

export default function ApartmentsPage({ navigateTo, openForm }) {
  const [properties, setProperties] = useState(() => dataStore.getApartments())
  const [siteContent, setSiteContent] = useState(() => dataStore.getSiteContent())
  const [loading, setLoading] = useState(false)
  const [activeCommunityTab, setActiveCommunityTab] = useState(0)

  // Filter States
  const [typologyFilter, setTypologyFilter] = useState('ALL')
  const [bedroomsFilter, setBedroomsFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('RELEVANT')
  const [selectedApartment, setSelectedApartment] = useState(null)
  const [activePanorama, setActivePanorama] = useState(null)
  const [detailTab, setDetailTab] = useState('INFO')

  // Dropdown Open States
  const [typoOpen, setTypoOpen] = useState(false)
  const [bedsOpen, setBedsOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)

  // Scroll to top on apartment selection
  useEffect(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
    setDetailTab('INFO')
  }, [selectedApartment])

  // Scroll reveal progress for Gated Community section
  const [spaceProgress, setSpaceProgress] = useState(0)
  const spaceRevealRef = useRef(null)
  const spaceProgressRef = useRef(0)
  const spaceTargetRef = useRef(0)

  useEffect(() => {
    if (!selectedApartment) return
    let frame = 0
    const handleScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        if (spaceRevealRef.current) {
          const sectionStart = spaceRevealRef.current.offsetTop
          const start = sectionStart - window.innerHeight * 0.25
          const end = sectionStart + spaceRevealRef.current.offsetHeight - window.innerHeight
          const distance = Math.max(1, end - start)
          spaceTargetRef.current = Math.min(1, Math.max(0, (window.scrollY - start) / distance))
        }
        frame = 0
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [selectedApartment])

  useEffect(() => {
    if (!selectedApartment) return
    let animationFrame = 0
    const animate = () => {
      const current = spaceProgressRef.current
      const target = spaceTargetRef.current
      const next = Math.abs(target - current) < 0.0005 ? target : current + (target - current) * 0.045
      spaceProgressRef.current = next
      setSpaceProgress(next)
      animationFrame = requestAnimationFrame(animate)
    }
    animationFrame = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [selectedApartment])

  // Preload all 360 panorama textures in the background when an apartment is selected
  useEffect(() => {
    if (!selectedApartment) return

    const urls = [
      '/assets/cayley-interior-8k.jpg',
      '/assets/kiara-interior-8k.jpg',
      '/assets/bedroom-interior-8k.png'
    ]

    const preloadedImages = urls.map(url => {
      const img = new Image()
      img.src = url
      return img
    })

    return () => {
      preloadedImages.forEach(img => {
        img.src = ''
      })
    }
  }, [selectedApartment])

  // Refs for dropdown toggle handling
  const typoRef = useRef(null)
  const bedsRef = useRef(null)
  const sortRef = useRef(null)
  const emblemRef = useRef(null)

  // Fetch properties from backend in the background, fallback remains active immediately
  useEffect(() => {
    fetch('/api/properties')
      .then(res => {
        if (!res.ok) throw new Error('API failure')
        return res.json()
      })
      .then(data => {
        if (data && data.length > 0) {
          // Parse data properties
          const parsed = data.map(item => ({
            ...item,
            // Fallback fields in case API does not have them
            apartmentNumber: item.apartmentNumber || `NO. ${item.id}`,
            block: item.block || `BLOCK B${(item.id % 3) + 1}`,
            floor: item.floor || `${item.id % 4} FLOOR`,
            terraceArea: item.terraceArea || (15 + (item.id % 5) * 8),
            typology: item.typology || (item.bedrooms === 3 ? "GROUND FLOOR + BASEMENT" : "GROUND FLOOR"),
            completion: item.completion || "4Q 2026",
            // backend model area is in sqft, convert or display
            areaSqm: item.areaSqft ? Math.round(item.areaSqft / 10.764) : (100 + (item.id % 10) * 12)
          }))
          const localApts = (typeof dataStore?.getApartments === 'function') ? dataStore.getApartments() : []
          const merged = parsed.map(item => {
            const localMatch = localApts.find(la => String(la.id) === String(item.id) || la.apartmentNumber === item.apartmentNumber)
            if (localMatch) {
              return {
                ...localMatch,
                ...item, // REAL DATABASE DATA TAKES PRECEDENCE (bedrooms, areaSqft, areaSqm, price, status, city, address)
                imageUrl: localMatch.imageUrl || item.imageUrl,
                roomGallery: localMatch.roomGallery || item.roomGallery,
                buyer: localMatch.buyer || null
              }
            }
            return item
          })

          // CRITICAL: Preserve all newly added apartments (e.g. No-26, No-27) created in admin panel
          const extraLocal = localApts.filter(la => !merged.some(m => String(m.id) === String(la.id) || m.apartmentNumber === la.apartmentNumber))
          const allProperties = [...merged, ...extraLocal].sort((a, b) => {
            const numA = parseInt((a.apartmentNumber || '').replace(/[^\d]/g, ''), 10) || a.id || 0
            const numB = parseInt((b.apartmentNumber || '').replace(/[^\d]/g, ''), 10) || b.id || 0
            return numA - numB
          })

          setProperties(allProperties)
          setSelectedApartment(prev => {
            if (!prev) return null
            const updated = allProperties.find(p => String(p.id) === String(prev.id) || p.apartmentNumber === prev.apartmentNumber)
            return updated || prev
          })
          try {
            localStorage.setItem('era_apartments_db_v2', JSON.stringify(allProperties))
          } catch (_) {}
        }
      })
      .catch(() => {
        // Fail silently because fallback properties are already loaded
      })
    const handleDataUpdate = () => {
      const fresh = dataStore.getApartments()
      setProperties(fresh)
      setSiteContent(dataStore.getSiteContent())
      setSelectedApartment(prev => prev ? fresh.find(a => a.id === prev.id) || prev : null)
    }
    window.addEventListener('era_datastore_updated', handleDataUpdate)
    window.addEventListener('storage', handleDataUpdate)
    return () => {
      window.removeEventListener('era_datastore_updated', handleDataUpdate)
      window.removeEventListener('storage', handleDataUpdate)
    }
  }, [])

  // Auto-spin + Scroll responsive rotation for the left rail emblem
  useEffect(() => {
    let autoAngle = 0
    const spinSpeed = 0.55 // Faster auto-spin speed (around 33 degrees/sec at 60fps)
    let animationFrameId

    const animate = () => {
      autoAngle += spinSpeed
      const currentScrollY = window.scrollY
      const rotation = autoAngle + currentScrollY * 0.45

      if (emblemRef.current) {
        emblemRef.current.style.transform = `rotate(${rotation}deg)`
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  // Parse URL query parameters on load to initialize filters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const typeParam = params.get('type')
    const bedroomsParam = params.get('bedrooms')

    if (typeParam) {
      const typeLower = typeParam.toLowerCase()
      if (typeLower === 'penthouse-duplex' || typeLower === 'penthouse_duplex') {
        setTypologyFilter('PENTHOUSE DUPLEX')
      } else if (typeLower === 'ground-floor-basement' || typeLower === 'ground_floor_basement') {
        setTypologyFilter('GROUND FLOOR + BASEMENT')
      } else if (typeLower === 'ground-floor' || typeLower === 'ground_floor') {
        setTypologyFilter('GROUND FLOOR')
      }
    }

    if (bedroomsParam) {
      if (bedroomsParam === '2' || bedroomsParam === '3') {
        setBedroomsFilter(bedroomsParam)
      }
    }
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (typoRef.current && !typoRef.current.contains(e.target)) setTypoOpen(false)
      if (bedsRef.current && !bedsRef.current.contains(e.target)) setBedsOpen(false)
      if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false)
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const resetFilters = () => {
    setTypologyFilter('ALL')
    setBedroomsFilter('ALL')
    setSortBy('RELEVANT')
  }

  // Filter & Sort Logic
  const filteredProperties = properties.filter(p => {
    const matchTypo = typologyFilter === 'ALL' || p.typology.toUpperCase() === typologyFilter.toUpperCase()
    const matchBeds = bedroomsFilter === 'ALL' || String(p.bedrooms) === String(bedroomsFilter)
    return matchTypo && matchBeds
  }).sort((a, b) => {
    if (sortBy === 'AREA_ASC') return (a.areaSqm || 0) - (b.areaSqm || 0) // SMALLEST AREA
    if (sortBy === 'AREA_DESC') return (b.areaSqm || 0) - (a.areaSqm || 0) // LARGEST AREA
    const numA = parseInt((a.apartmentNumber || '').replace(/[^\d]/g, ''), 10) || a.id || 0
    const numB = parseInt((b.apartmentNumber || '').replace(/[^\d]/g, ''), 10) || b.id || 0
    return numA - numB
  })

  return (
    <main className="apartments-page-layout">
      {/* Left Persistent Rail */}
      <aside className="persistent-era-rail rail-on-light">
        <div 
          className="persistent-emblem" 
          onClick={() => navigateTo('/')}
          title="Return to Homepage"
          style={{ cursor: 'pointer', pointerEvents: 'auto' }}
        >
          <svg ref={emblemRef} viewBox="0 0 120 120">
            <defs>
              <path id="persistentEmblemPath" d="M60,60 m-43,0 a43,43 0 1,1 86,0 a43,43 0 1,1 -86,0" />
            </defs>
            <text>
              <textPath href="#persistentEmblemPath" textLength="270">D W E L L O R A　•　R E S I D E N C E　•　</textPath>
            </text>
          </svg>
          <span>✣</span>
        </div>

        {/* Navigation Breadcrumb inside rail */}
        {selectedApartment ? (
          <div className="rail-routing-info">
            <span className="rail-route-link" onClick={() => navigateTo('/')}>HOME</span>
            <span className="rail-route-separator">/</span>
            <span className="rail-route-link" onClick={() => setSelectedApartment(null)}>SELECT AN APARTMENT</span>
            <span className="rail-route-separator">/</span>
            <span className="rail-route-active">{selectedApartment.apartmentNumber}</span>
          </div>
        ) : (
          <div className="rail-routing-info">
            <span className="rail-route-link" onClick={() => navigateTo('/')}>HOME</span>
            <span className="rail-route-separator">/</span>
            <span className="rail-route-active">SELECT AN APARTMENT</span>
          </div>
        )}

        <small className="rail-vertical-text">SCROLL</small>
        <ArrowDown />
      </aside>

      {/* Header and Brand Actions */}
      <header className="era-nav nav-on-light">
        <div className="era-mark" onClick={() => navigateTo('/')} style={{ cursor: 'pointer', pointerEvents: 'auto' }}>
          <span>ERA</span>
          <small>RESIDENCE</small>
        </div>
        <div className="nav-actions">
          <a href="/apartments" onClick={(e) => { e.preventDefault(); setSelectedApartment(null); }}>
            {selectedApartment ? 'All apartments' : 'Select an apartment'}
          </a>
          <button onClick={openForm}>Book a call</button>
          <a className="nav-contact" href="/contact" onClick={(e) => { e.preventDefault(); navigateTo('/contact') }}>Contact</a>
        </div>
      </header>

      {/* Bougainvillea Flower Visuals in Top-Right Corner */}
      <div className="bougainvillea-corner-frame">
        <video className="bougainvillea-video-loop" autoPlay muted loop playsInline poster="/assets/era-reference-flowers.avif">
          <source src="/assets/era-reference-flowers.webm" type="video/webm" />
        </video>
      </div>

      {selectedApartment ? (
        <>
          {/* Detailed View Section */}
          <section className="apartment-detail-intro-sec">
            <div className="apartment-detail-header">
              <h1 className="detail-serif-title">{selectedApartment.apartmentNumber}</h1>
              <div className="detail-typology-row">
                <span>{selectedApartment.typology}</span>
                <span className="bullet-dot">•</span>
                <span style={{
                  color: selectedApartment.status === 'SOLD' ? '#ef4444' : (selectedApartment.status === 'RESERVED' ? '#d97706' : '#10b981'),
                  fontWeight: 700
                }}>
                  {selectedApartment.status === 'SOLD' ? '● SOLD OUT' : (selectedApartment.status === 'RESERVED' ? '● RESERVED' : '● AVAILABLE')}
                </span>
                <span className="bullet-dot">•</span>
                <span>COMPLETION: {selectedApartment.completion || '4Q 2026'}</span>
              </div>
            </div>

            <div className="detail-content-columns">
              {/* Left Column: Floor Plans */}
              <div className="detail-floorplans-column">
                <FloorPlanSVG typology={selectedApartment.typology} bedrooms={selectedApartment.bedrooms} apartment={selectedApartment} />
              </div>

              {/* Right Column: Specs */}
              <div className="detail-specs-column">
                <div className="detail-spec-item">
                  <span className="detail-spec-label">BEDROOMS</span>
                  <span className="detail-spec-val">{selectedApartment.bedrooms}</span>
                </div>

                <div className="detail-spec-item">
                  <span className="detail-spec-label">INTERIOR AREA</span>
                  <span className="detail-spec-val serif">{selectedApartment.areaSqm || 132} M²</span>
                </div>

                <div className="detail-spec-item">
                  <span className="detail-spec-label">TERRACE AREA</span>
                  <span className="detail-spec-val serif">{selectedApartment.terraceArea || 29} M²</span>
                </div>

                {selectedApartment.typology.toUpperCase().includes('BASEMENT') && (
                  <div className="detail-spec-item">
                    <span className="detail-spec-label">GARDEN AREA</span>
                    <span className="detail-spec-val serif">46 M²</span>
                  </div>
                )}

                {/* Tabs: INFO / BENEFITS */}
                <div className="detail-tab-container">
                  <button
                    className={`detail-tab-btn ${detailTab === 'INFO' ? 'active' : ''}`}
                    onClick={() => setDetailTab('INFO')}
                  >
                    INFO
                  </button>
                  <button
                    className={`detail-tab-btn ${detailTab === 'BENEFITS' ? 'active' : ''}`}
                    onClick={() => setDetailTab('BENEFITS')}
                  >
                    BENEFITS
                  </button>
                </div>

                {/* Tab Content */}
                <div className="detail-tab-content">
                  {detailTab === 'INFO' ? (
                    <p className="detail-info-desc">
                      {getApartmentInfo(selectedApartment).description}
                    </p>
                  ) : (
                    <div className="detail-benefits-grid">
                      {getApartmentInfo(selectedApartment).benefits.map((benefit, idx) => (
                        <span key={idx} className="benefit-pill">{benefit}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="detail-action-buttons">
                  {selectedApartment.status === 'SOLD' ? (
                    <button className="detail-request-btn" style={{ background: '#ef4444', color: '#ffffff', cursor: 'not-allowed', opacity: 0.95 }} disabled>
                      SOLD OUT • BOOKING CLOSED
                    </button>
                  ) : (
                    <button className="detail-request-btn" onClick={() => openForm(selectedApartment ? `${selectedApartment.apartmentNumber} — ${selectedApartment.title}` : 'General Residence Inquiry')}>
                      {selectedApartment.status === 'RESERVED' ? 'REQUEST WAITLIST' : 'SUBMIT A REQUEST'}
                    </button>
                  )}
                  <button 
                    className="detail-pdf-btn" 
                    onClick={() => openApartmentBrochure(selectedApartment)}
                    title="Download / Print Architectural Brochure (PDF)"
                  >
                    PDF
                  </button>
                </div>
              </div>
            </div>

            {/* Scrolled Sections: Living Room, Kitchen, Bedroom, Terrace, Gated Community */}
            <div className="apartment-detail-rooms-sec">
              {/* 1. Living Hall */}
              <div className="detail-room-row">
                <div
                  className="detail-room-image-wrap"
                  onClick={() => setActivePanorama({
                    url: selectedApartment.roomGallery?.livingHall360 || selectedApartment.panorama360 || selectedApartment.roomGallery?.panorama360 || '/assets/cayley-interior-8k.jpg',
                    thumbnail: selectedApartment.roomGallery?.livingHall || '/assets/interior-living-hall.png'
                  })}
                >
                  <img src={selectedApartment.roomGallery?.livingHall || '/assets/interior-living-hall.png'} alt="Living Hall" onError={(e) => { e.target.src = '/assets/interior-living-hall.png' }} />
                  <div className="detail-room-overlay-info">
                    <span>LIVING HALL</span>
                    <button className="detail-pano-btn"><span>+</span> ENTER 360° VIEW</button>
                  </div>
                </div>
              </div>

              {/* 2. Kitchen */}
              <div className="detail-room-row">
                <div
                  className="detail-room-image-wrap"
                  onClick={() => setActivePanorama({
                    url: selectedApartment.roomGallery?.kitchen360 || selectedApartment.panorama360 || selectedApartment.roomGallery?.panorama360 || '/assets/kiara-interior-8k.jpg',
                    thumbnail: selectedApartment.roomGallery?.kitchen || '/assets/interior-kitchen.png'
                  })}
                >
                  <img src={selectedApartment.roomGallery?.kitchen || '/assets/interior-kitchen.png'} alt="Kitchen" onError={(e) => { e.target.src = '/assets/interior-kitchen.png' }} />
                  <div className="detail-room-overlay-info">
                    <span>KITCHEN</span>
                    <button className="detail-pano-btn"><span>+</span> ENTER 360° VIEW</button>
                  </div>
                </div>
              </div>

              {/* 3. Master Bedroom */}
              <div className="detail-room-row">
                <div
                  className="detail-room-image-wrap"
                  onClick={() => setActivePanorama({
                    url: selectedApartment.roomGallery?.bedroom360 || selectedApartment.panorama360 || selectedApartment.roomGallery?.panorama360 || '/assets/bedroom-interior-8k.png',
                    thumbnail: selectedApartment.roomGallery?.bedroom || '/assets/interior-master-bedroom.png'
                  })}
                >
                  <img src={selectedApartment.roomGallery?.bedroom || '/assets/interior-master-bedroom.png'} alt="Master Bedroom" onError={(e) => { e.target.src = '/assets/interior-master-bedroom.png' }} />
                  <div className="detail-room-overlay-info">
                    <span>MASTER BEDROOM</span>
                    <button className="detail-pano-btn"><span>+</span> ENTER 360° VIEW</button>
                  </div>
                </div>
              </div>

              {/* 4. Private Terrace / Balcony */}
              <div className="detail-room-row">
                <div
                  className="detail-room-image-wrap"
                  onClick={() => setActivePanorama({
                    url: selectedApartment.roomGallery?.terrace360 || selectedApartment.panorama360 || selectedApartment.roomGallery?.panorama360 || '/assets/cayley-interior-8k.jpg',
                    thumbnail: selectedApartment.roomGallery?.terrace || '/assets/estate-private-terrace.png'
                  })}
                >
                  <img src={selectedApartment.roomGallery?.terrace || '/assets/estate-private-terrace.png'} alt="Private Terrace" onError={(e) => { e.target.src = '/assets/estate-private-terrace.png' }} />
                  <div className="detail-room-overlay-info">
                    <span>PRIVATE TERRACE / BALCONY</span>
                    <button className="detail-pano-btn"><span>+</span> ENTER 360° VIEW</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="community-feature space-reveal-scroll" ref={spaceRevealRef} aria-label="Gated community swimming pool">
            <div className="community-feature-sticky space-reveal-sticky">
              {(siteContent?.communityFeatures || communityFeatures).map((feat, idx) => (
                <img key={feat.title || idx} src={feat.image} alt={feat.title} style={{ opacity: activeCommunityTab === idx ? 1 : 0, transition: 'opacity 0.6s ease' }} />
              ))}
              <div className="community-shade" />
              <div className="community-list">
                {(siteContent?.communityFeatures || communityFeatures).map((feat, idx) => (
                  <span key={feat.title || idx} style={{ cursor: 'pointer', borderLeft: activeCommunityTab === idx ? '2px solid #fff' : '2px solid transparent', opacity: activeCommunityTab === idx ? 1 : 0.42, fontWeight: activeCommunityTab === idx ? 'bold' : 'normal', transition: 'all 0.3s ease' }} onClick={() => setActiveCommunityTab(idx)}>{feat.title}</span>
                ))}
              </div>
              <div className="community-copy">
                <small>{(siteContent?.communityFeatures || communityFeatures)[activeCommunityTab]?.title}</small>
                <h2>{(siteContent?.communityFeatures || communityFeatures)[activeCommunityTab]?.copy?.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br /></React.Fragment>)}</h2>
              </div>
              <button className="community-call" onClick={openForm} onMouseMove={e => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--call-x', `${(e.clientX - r.left - r.width / 2) * .12}px`); e.currentTarget.style.setProperty('--call-y', `${(e.clientY - r.top - r.height / 2) * .12}px`) }} onMouseLeave={e => { e.currentTarget.style.setProperty('--call-x', '0px'); e.currentTarget.style.setProperty('--mag-y', '0px') }}>
                BOOK A CALL<br />NOW
              </button>

            </div>
          </section>
        </>
      ) : (
        /* Main Listing Section */
        <section className="apartments-listing-sec">
          {/* Title and Count Header */}
          <div className="apartments-title-container">
            <h1 className="apartments-serif-title">APARTMENTS</h1>
            <div className="apartments-total-count">
              {loading ? '...' : filteredProperties.length}
            </div>
          </div>

          {/* Custom Filters Row */}
          <div className="apartments-filters-row">

            {/* Typology Dropdown */}
            <div className="filter-dropdown-container" ref={typoRef}>
              <button className="filter-toggle-btn" onClick={() => setTypoOpen(!typoOpen)}>
                TYPOLOGY <span>{typologyFilter}</span> {typoOpen ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
              </button>
              {typoOpen && (
                <div className="filter-dropdown-options">
                  <div
                    className={`filter-option ${typologyFilter === 'ALL' ? 'selected' : ''}`}
                    onClick={() => { setTypologyFilter('ALL'); setTypoOpen(false); }}
                  >
                    ALL
                  </div>
                  <div
                    className={`filter-option ${typologyFilter === 'GROUND FLOOR + BASEMENT' ? 'selected' : ''}`}
                    onClick={() => { setTypologyFilter('GROUND FLOOR + BASEMENT'); setTypoOpen(false); }}
                  >
                    GROUND FLOOR + BASEMENT
                  </div>
                  <div
                    className={`filter-option ${typologyFilter === 'GROUND FLOOR' ? 'selected' : ''}`}
                    onClick={() => { setTypologyFilter('GROUND FLOOR'); setTypoOpen(false); }}
                  >
                    GROUND FLOOR
                  </div>
                  <div
                    className={`filter-option ${typologyFilter === 'PENTHOUSE DUPLEX' ? 'selected' : ''}`}
                    onClick={() => { setTypologyFilter('PENTHOUSE DUPLEX'); setTypoOpen(false); }}
                  >
                    PENTHOUSE DUPLEX
                  </div>
                </div>
              )}
            </div>

            {/* Bedrooms Dropdown */}
            <div className="filter-dropdown-container" ref={bedsRef}>
              <button className="filter-toggle-btn" onClick={() => setBedsOpen(!bedsOpen)}>
                BEDROOMS <span>{bedroomsFilter}</span> {bedsOpen ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
              </button>
              {bedsOpen && (
                <div className="filter-dropdown-options">
                  <div
                    className={`filter-option ${bedroomsFilter === 'ALL' ? 'selected' : ''}`}
                    onClick={() => { setBedroomsFilter('ALL'); setBedsOpen(false); }}
                  >
                    ALL
                  </div>
                  <div
                    className={`filter-option ${bedroomsFilter === '2' ? 'selected' : ''}`}
                    onClick={() => { setBedroomsFilter('2'); setBedsOpen(false); }}
                  >
                    2
                  </div>
                  <div
                    className={`filter-option ${bedroomsFilter === '3' ? 'selected' : ''}`}
                    onClick={() => { setBedroomsFilter('3'); setBedsOpen(false); }}
                  >
                    3
                  </div>
                </div>
              )}
            </div>

            {/* Sort By Dropdown aligned inside Column 3 */}
            <div className="filter-dropdown-and-reset" ref={sortRef}>
              <div className="filter-dropdown-container">
                <button className="filter-toggle-btn" onClick={() => setSortOpen(!sortOpen)}>
                  SORT BY <span>{sortBy === 'RELEVANT' ? 'RELEVANT' : sortBy === 'AREA_ASC' ? 'SMALLEST AREA' : 'LARGEST AREA'}</span> {sortOpen ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                </button>
                {sortOpen && (
                  <div className="filter-dropdown-options">
                    <div
                      className={`filter-option ${sortBy === 'RELEVANT' ? 'selected' : ''}`}
                      onClick={() => { setSortBy('RELEVANT'); setSortOpen(false); }}
                    >
                      RELEVANT
                    </div>
                    <div
                      className={`filter-option ${sortBy === 'AREA_ASC' ? 'selected' : ''}`}
                      onClick={() => { setSortBy('AREA_ASC'); setSortOpen(false); }}
                    >
                      SMALLEST AREA
                    </div>
                    <div
                      className={`filter-option ${sortBy === 'AREA_DESC' ? 'selected' : ''}`}
                      onClick={() => { setSortBy('AREA_DESC'); setSortOpen(false); }}
                    >
                      LARGEST AREA
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Apartments Cards Grid */}
          {loading ? (
            <div className="listing-loader">Loading residences...</div>
          ) : filteredProperties.length > 0 ? (
            <div className="apartments-cards-grid">
              {filteredProperties.map(item => (
                <article key={item.id} className="apartment-item-card" onClick={() => setSelectedApartment(item)}>

                  {/* Card Header Info */}
                  <div className="card-top-details">
                    <span className="card-typology">{item.typology}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {item.status && (
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          padding: '2px 7px',
                          borderRadius: '10px',
                          textTransform: 'uppercase',
                          background: item.status === 'SOLD' ? '#fef2f2' : (item.status === 'RESERVED' ? '#fffbeb' : '#ecfdf5'),
                          color: item.status === 'SOLD' ? '#dc2626' : (item.status === 'RESERVED' ? '#d97706' : '#059669'),
                          border: `1px solid ${item.status === 'SOLD' ? '#fecaca' : (item.status === 'RESERVED' ? '#fde68a' : '#a7f3d0')}`
                        }}>
                          {item.status === 'SOLD' ? 'SOLD OUT' : item.status}
                        </span>
                      )}
                      <span className="card-completion">COMPLETION: {item.completion || '4Q 2026'}</span>
                    </div>
                  </div>

                  {/* Vector Floor Plan Visualizer */}
                  <div className="card-floorplan-visual">
                    <FloorPlanSVG typology={item.typology} bedrooms={item.bedrooms} apartment={item} />
                  </div>

                  {/* Card Middle Info */}
                  <div className="card-mid-specifications">
                    <span className="card-unit-info">{item.apartmentNumber} • {item.block} • {item.floor}</span>
                    <h2 className="card-size-heading">{item.bedrooms} BED / {item.areaSqm} M²</h2>
                    <span className="card-terrace-footer">+ {item.terraceArea} M² TERRACE</span>
                  </div>

                </article>
              ))}
            </div>
          ) : (
            <div className="listing-empty-state">
              <p>No residences match your current filters.</p>
              <button onClick={resetFilters}>Clear Filters</button>
            </div>
          )}
        </section>
      )}

      {/* 360° Immersive Panorama Viewer Overlay */}
      {activePanorama && (
        <div className="pano-viewer-overlay">
          <button className="pano-close-btn" onClick={() => setActivePanorama(null)}>✕ CLOSE {activePanorama.flat ? 'ROOM VIEW' : '360° VIEW'}</button>
          <div className="pano-canvas-container">
            {activePanorama.flat ? (
              <div
                className="pano-flat-stage"
                onPointerDown={event => {
                  roomDragRef.current = { x: event.clientX, y: event.clientY, startX: roomPan.x, startY: roomPan.y }
                  event.currentTarget.setPointerCapture(event.pointerId)
                }}
                onPointerMove={event => {
                  if (!roomDragRef.current) return
                  const drag = roomDragRef.current
                  setRoomPan({ x: Math.max(-7, Math.min(7, drag.startX + (event.clientX - drag.x) / 34)), y: Math.max(-4, Math.min(4, drag.startY + (event.clientY - drag.y) / 34)) })
                }}
                onPointerUp={() => { roomDragRef.current = null }}
                onPointerCancel={() => { roomDragRef.current = null }}
                onWheel={event => {
                  event.preventDefault()
                  setRoomZoom(current => Math.max(1.08, Math.min(1.45, current - event.deltaY * 0.001)))
                }}
              >
                <img className="pano-flat-image" src={activePanorama.url} alt={activePanorama.label} style={{ transform: `translate3d(${roomPan.x}%, ${roomPan.y}%, 0) scale(${roomZoom})` }} />
                <span className="pano-flat-hint">DRAG OR SCROLL TO EXPLORE</span>
              </div>
            ) : (
              <PanoramaLoader url={activePanorama.url} thumbnail={activePanorama.thumbnail} />
            )}
          </div>
        </div>
      )}
    </main>
  )
}
