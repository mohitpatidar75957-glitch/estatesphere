import React from 'react'

export default function FloorPlanSVG({ typology, bedrooms, apartment }) {
  // Styles for the SVG elements
  const wallStyle = { fill: 'none', stroke: '#252822', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' }
  const thinWallStyle = { fill: 'none', stroke: '#252822', strokeWidth: '1', strokeLinecap: 'round', strokeLinejoin: 'round' }
  const furnitureStyle = { fill: '#ffffff', stroke: '#8c9288', strokeWidth: '0.8' }
  const grassStyle = { fill: '#e1e5de' }
  const woodStyle = { fill: '#eadcce' }
  const waterStyle = { fill: '#cbdde5' }

  // Determine effective bedroom count
  const bedCount = Number(bedrooms) || (apartment ? Number(apartment.bedrooms) : 0) || (apartment?.title?.includes('4') ? 4 : (apartment?.title?.includes('3') ? 3 : 2))

  // --- 4 BEDROOM ARCHITECTURAL FLOOR PLAN ---
  const renderFourBedroomFloor = () => (
    <svg viewBox="0 0 280 140" width="100%" height="100%" style={{ background: '#f8f6f0' }}>
      {/* 1. Outdoor Landscaped Terrace on Left */}
      <rect x="8" y="10" width="46" height="120" style={woodStyle} />
      {Array.from({ length: 4 }, (_, i) => (
        <line key={i} x1={18 + i * 10} y1="10" x2={18 + i * 10} y2="130" stroke="#d5c8bb" strokeWidth="0.8" />
      ))}
      {/* Terrace plunge/garden pool */}
      <rect x="12" y="80" width="38" height="42" rx="3" style={grassStyle} />
      <circle cx="31" cy="101" r="9" style={waterStyle} />
      {/* Outdoor deck lounge seats */}
      <rect x="16" y="24" width="12" height="16" rx="1" style={furnitureStyle} />
      <rect x="16" y="46" width="12" height="16" rx="1" style={furnitureStyle} />

      {/* 2. Main Indoor Residence Area */}
      <rect x="54" y="10" width="218" height="120" fill="#f4efe5" />

      {/* Internal partition walls */}
      {/* Vertical corridor / zone split */}
      <line x1="124" y1="10" x2="124" y2="130" style={thinWallStyle} />
      <line x1="196" y1="10" x2="196" y2="130" style={thinWallStyle} />

      {/* Horizontal partition splits */}
      <line x1="124" y1="68" x2="272" y2="68" style={thinWallStyle} />
      <line x1="196" y1="42" x2="272" y2="42" style={thinWallStyle} />
      <line x1="196" y1="96" x2="272" y2="96" style={thinWallStyle} />
      <line x1="54" y1="74" x2="124" y2="74" style={thinWallStyle} />

      {/* === ROOM 1: MASTER BEDROOM SUITE (Top-Right: 196 to 272, Y: 10 to 42) === */}
      {/* Master Bed */}
      <rect x="236" y="15" width="26" height="23" rx="1.5" style={furnitureStyle} />
      <rect x="240" y="15" width="18" height="6" rx="1" fill="#e8e8e8" stroke="#8c9288" strokeWidth="0.5" />
      {/* Master Wardrobe & En-suite vanity */}
      <rect x="202" y="15" width="22" height="10" rx="1" style={furnitureStyle} />
      <circle cx="213" cy="33" r="4.5" style={waterStyle} />
      <text x="202" y="39" fontSize="4.5" fill="#64748b" fontFamily="sans-serif" fontWeight="700">M.BED 01</text>

      {/* === ROOM 2: BEDROOM 2 (Mid-Right: 196 to 272, Y: 42 to 68) === */}
      {/* Queen Bed */}
      <rect x="240" y="46" width="24" height="18" rx="1.5" style={furnitureStyle} />
      <rect x="244" y="46" width="16" height="5" rx="1" fill="#e8e8e8" stroke="#8c9288" strokeWidth="0.5" />
      {/* Wardrobe */}
      <rect x="202" y="46" width="26" height="8" rx="1" style={furnitureStyle} />
      <text x="202" y="63" fontSize="4.5" fill="#64748b" fontFamily="sans-serif" fontWeight="700">BED 02</text>

      {/* === ROOM 3: BEDROOM 3 (Mid-Lower-Right: 196 to 272, Y: 68 to 96) === */}
      {/* Bed */}
      <rect x="240" y="72" width="24" height="19" rx="1.5" style={furnitureStyle} />
      <rect x="244" y="72" width="16" height="5" rx="1" fill="#e8e8e8" stroke="#8c9288" strokeWidth="0.5" />
      {/* Wardrobe / Desk */}
      <rect x="202" y="73" width="24" height="8" rx="1" style={furnitureStyle} />
      <text x="202" y="90" fontSize="4.5" fill="#64748b" fontFamily="sans-serif" fontWeight="700">BED 03</text>

      {/* === ROOM 4: BEDROOM 4 / STUDY SUITE (Bottom-Right: 196 to 272, Y: 96 to 130) === */}
      {/* Bed 4 */}
      <rect x="240" y="102" width="24" height="19" rx="1.5" style={furnitureStyle} />
      <rect x="244" y="102" width="16" height="5" rx="1" fill="#e8e8e8" stroke="#8c9288" strokeWidth="0.5" />
      {/* Study Desk & Chair */}
      <rect x="202" y="102" width="18" height="9" rx="1" style={furnitureStyle} />
      <circle cx="211" cy="118" r="3.5" style={furnitureStyle} />
      <text x="202" y="125" fontSize="4.5" fill="#64748b" fontFamily="sans-serif" fontWeight="700">BED 04 / STUDY</text>

      {/* === CENTRAL AREA: DINING SALON & GOURMET KITCHEN (124 to 196) === */}
      {/* Formal Dining Table (6 seats) */}
      <rect x="142" y="24" width="36" height="20" rx="1.5" style={furnitureStyle} />
      {/* Chairs around table */}
      <rect x="146" y="18" width="8" height="4" rx="0.5" style={furnitureStyle} />
      <rect x="160" y="18" width="8" height="4" rx="0.5" style={furnitureStyle} />
      <rect x="146" y="46" width="8" height="4" rx="0.5" style={furnitureStyle} />
      <rect x="160" y="46" width="8" height="4" rx="0.5" style={furnitureStyle} />
      <text x="138" y="58" fontSize="4.5" fill="#64748b" fontFamily="sans-serif" fontWeight="700">FORMAL DINING</text>

      {/* Gourmet Open Kitchen with Island (124 to 196, Y: 68 to 130) */}
      <rect x="134" y="80" width="52" height="14" rx="1" style={furnitureStyle} />
      <rect x="134" y="106" width="52" height="16" rx="1" fill="#eae4d7" stroke="#8c9288" strokeWidth="0.8" />
      <circle cx="148" cy="114" r="3" style={furnitureStyle} />
      <circle cx="162" cy="114" r="3" style={furnitureStyle} />
      <circle cx="176" cy="114" r="3" style={furnitureStyle} />
      <text x="140" y="99" fontSize="4.5" fill="#64748b" fontFamily="sans-serif" fontWeight="700">CHEF KITCHEN</text>

      {/* === LEFT LIVING ROOM SALON (54 to 124, Y: 10 to 74) === */}
      {/* Deep Sectional Sofa */}
      <rect x="66" y="20" width="46" height="15" rx="1" style={furnitureStyle} />
      <rect x="60" y="20" width="6" height="34" rx="1" style={furnitureStyle} />
      <rect x="112" y="20" width="6" height="24" rx="1" style={furnitureStyle} />
      {/* Coffee Table */}
      <rect x="74" y="40" width="30" height="12" rx="2" style={furnitureStyle} />
      <text x="64" y="66" fontSize="5" fill="#475569" fontFamily="sans-serif" fontWeight="700">GRAND LIVING SALON</text>

      {/* Entry Foyer & Powder Room (54 to 124, Y: 74 to 130) */}
      <rect x="62" y="84" width="22" height="18" rx="1" style={furnitureStyle} />
      <circle cx="73" cy="93" r="5" style={waterStyle} />
      <text x="62" y="109" fontSize="4.5" fill="#64748b" fontFamily="sans-serif" fontWeight="700">POWDER / BATH</text>
      <text x="92" y="116" fontSize="5" fill="#334155" fontFamily="sans-serif" fontWeight="700">MAIN FOYER</text>

      {/* Structural Outer Wall */}
      <rect x="54" y="10" width="218" height="120" style={wallStyle} />

      {/* Window openings */}
      <rect x="54" y="25" width="2" height="35" fill="#ffffff" stroke="#252822" strokeWidth="0.8" />
      <rect x="272" y="20" width="2" height="20" fill="#ffffff" stroke="#252822" strokeWidth="0.8" />
      <rect x="272" y="50" width="2" height="15" fill="#ffffff" stroke="#252822" strokeWidth="0.8" />
      <rect x="272" y="76" width="2" height="15" fill="#ffffff" stroke="#252822" strokeWidth="0.8" />
      <rect x="272" y="104" width="2" height="18" fill="#ffffff" stroke="#252822" strokeWidth="0.8" />
    </svg>
  )

  // --- 3 BEDROOM ARCHITECTURAL FLOOR PLAN ---
  const renderThreeBedroomFloor = () => (
    <svg viewBox="0 0 280 140" width="100%" height="100%" style={{ background: '#f8f6f0' }}>
      {/* Outdoor Terrace */}
      <rect x="10" y="10" width="55" height="120" style={woodStyle} />
      {Array.from({ length: 5 }, (_, i) => (
        <line key={i} x1={20 + i * 10} y1="10" x2={20 + i * 10} y2="130" stroke="#d5c8bb" strokeWidth="0.8" />
      ))}
      <rect x="12" y="75" width="38" height="45" rx="3" style={grassStyle} />
      <circle cx="31" cy="97" r="10" style={waterStyle} />

      {/* Indoor area */}
      <rect x="65" y="10" width="205" height="120" fill="#f4efe5" />

      {/* Internal partition walls */}
      <line x1="145" y1="10" x2="145" y2="130" style={thinWallStyle} />
      <line x1="205" y1="10" x2="205" y2="130" style={thinWallStyle} />
      <line x1="145" y1="65" x2="270" y2="65" style={thinWallStyle} />

      {/* Master Bedroom Suite (Top Right) */}
      <rect x="220" y="18" width="35" height="28" rx="2" style={furnitureStyle} />
      <rect x="225" y="18" width="25" height="7" rx="1" fill="#e8e8e8" stroke="#8c9288" strokeWidth="0.5" />
      <text x="214" y="55" fontSize="4.5" fill="#64748b" fontFamily="sans-serif" fontWeight="700">MASTER SUITE 01</text>

      {/* Bedroom 2 (Bottom Right) */}
      <rect x="220" y="80" width="32" height="28" rx="2" style={furnitureStyle} />
      <rect x="225" y="80" width="22" height="7" rx="1" fill="#e8e8e8" stroke="#8c9288" strokeWidth="0.5" />
      <text x="218" y="118" fontSize="4.5" fill="#64748b" fontFamily="sans-serif" fontWeight="700">BEDROOM 02</text>

      {/* Bedroom 3 (Center Top) */}
      <rect x="160" y="18" width="30" height="25" rx="2" style={furnitureStyle} />
      <rect x="165" y="18" width="20" height="6" rx="1" fill="#e8e8e8" stroke="#8c9288" strokeWidth="0.5" />
      <text x="156" y="55" fontSize="4.5" fill="#64748b" fontFamily="sans-serif" fontWeight="700">BEDROOM 03</text>

      {/* Kitchen & Dining (Center Bottom) */}
      <rect x="155" y="75" width="40" height="15" rx="1.5" style={furnitureStyle} />
      <circle cx="165" cy="105" r="4" style={waterStyle} />
      <circle cx="185" cy="105" r="4" style={waterStyle} />
      <text x="152" y="122" fontSize="4.5" fill="#64748b" fontFamily="sans-serif" fontWeight="700">KITCHEN & DINING</text>

      {/* Living Room (Left) */}
      <rect x="85" y="24" width="48" height="16" rx="1" style={furnitureStyle} />
      <rect x="80" y="24" width="6" height="28" rx="1" style={furnitureStyle} />
      <circle cx="108" cy="72" r="14" style={furnitureStyle} />
      <text x="82" y="105" fontSize="5" fill="#475569" fontFamily="sans-serif" fontWeight="700">LIVING SALON</text>

      {/* Outer structural walls */}
      <rect x="65" y="10" width="205" height="120" style={wallStyle} />

      {/* Windows */}
      <rect x="65" y="30" width="3" height="40" fill="#fff" stroke="#252822" strokeWidth="1" />
      <rect x="270" y="30" width="3" height="25" fill="#fff" stroke="#252822" strokeWidth="1" />
      <rect x="270" y="85" width="3" height="25" fill="#fff" stroke="#252822" strokeWidth="1" />
    </svg>
  )

  // --- 2 BEDROOM ARCHITECTURAL FLOOR PLAN ---
  const renderSingleFloor = () => (
    <svg viewBox="0 0 280 140" width="100%" height="100%" style={{ background: '#f8f6f0' }}>
      {/* Terraces / Outdoor areas on the left */}
      <rect x="10" y="10" width="60" height="120" style={woodStyle} />
      {Array.from({ length: 6 }, (_, i) => (
        <line key={i} x1={20 + i * 10} y1="10" x2={20 + i * 10} y2="130" stroke="#d5c8bb" strokeWidth="0.8" />
      ))}
      <rect x="10" y="80" width="40" height="40" style={grassStyle} />
      
      {/* Indoor area */}
      <rect x="70" y="10" width="200" height="120" fill="#f4efe5" />
      
      {/* Rooms partition walls */}
      <line x1="160" y1="10" x2="160" y2="130" style={thinWallStyle} />
      <line x1="210" y1="10" x2="210" y2="70" style={thinWallStyle} />
      <line x1="160" y1="70" x2="270" y2="70" style={thinWallStyle} />

      {/* Furniture - Bed (Master Bedroom) */}
      <rect x="225" y="20" width="30" height="35" rx="2" style={furnitureStyle} />
      <rect x="230" y="20" width="20" height="8" rx="1" fill="#e8e8e8" stroke="#8c9288" strokeWidth="0.5" />
      
      {/* Furniture - Bed (Guest Bedroom) */}
      <rect x="175" y="85" width="25" height="35" rx="2" style={furnitureStyle} />
      
      {/* Sofa (Living Room) */}
      <rect x="90" y="25" width="45" height="15" rx="1" style={furnitureStyle} />
      <rect x="85" y="25" width="5" height="25" rx="1" style={furnitureStyle} />
      <rect x="135" y="25" width="5" height="25" rx="1" style={furnitureStyle} />
      <circle cx="112" cy="75" r="14" style={furnitureStyle} />

      {/* Outer structural walls */}
      <rect x="70" y="10" width="200" height="120" style={wallStyle} />
      
      {/* Windows */}
      <rect x="70" y="30" width="3" height="40" fill="#fff" stroke="#252822" strokeWidth="1" />
      <rect x="70" y="85" width="3" height="25" fill="#fff" stroke="#252822" strokeWidth="1" />
      <rect x="270" y="40" width="3" height="30" fill="#fff" stroke="#252822" strokeWidth="1" />
    </svg>
  )

  const renderBasement = () => (
    <svg viewBox="0 0 280 140" width="100%" height="100%" style={{ background: '#f8f6f0' }}>
      {/* English/Lightwell courtyard */}
      <rect x="10" y="10" width="50" height="120" style={grassStyle} />
      <circle cx="35" cy="40" r="8" style={furnitureStyle} />
      <circle cx="35" cy="90" r="10" style={furnitureStyle} />

      {/* Indoor basement */}
      <rect x="60" y="10" width="210" height="120" fill="#eee9de" />
      
      {/* Internal walls */}
      <line x1="150" y1="10" x2="150" y2="130" style={thinWallStyle} />
      <line x1="210" y1="50" x2="210" y2="130" style={thinWallStyle} />
      <line x1="150" y1="50" x2="270" y2="50" style={thinWallStyle} />

      {/* Media screen & sofa in basement lounge */}
      <rect x="85" y="40" width="12" height="60" rx="1" style={furnitureStyle} />
      <rect x="135" y="45" width="3" height="50" fill="#252822" />

      {/* Guest Bedrooms */}
      <rect x="165" y="75" width="30" height="35" rx="2" style={furnitureStyle} />
      <rect x="225" y="75" width="30" height="35" rx="2" style={furnitureStyle} />

      {/* Outer structural walls */}
      <rect x="60" y="10" width="210" height="120" style={wallStyle} />

      {/* Windows to lightwell */}
      <rect x="60" y="30" width="3" height="30" fill="#fff" stroke="#252822" strokeWidth="1" />
      <rect x="60" y="80" width="3" height="30" fill="#fff" stroke="#252822" strokeWidth="1" />
    </svg>
  )

  const renderPenthouseDeck = () => (
    <svg viewBox="0 0 280 140" width="100%" height="100%" style={{ background: '#f8f6f0' }}>
      {/* Solarium Deck */}
      <rect x="10" y="10" width="260" height="120" style={woodStyle} />
      {Array.from({ length: 26 }, (_, i) => (
        <line key={i} x1={10 + i * 10} y1="10" x2={10 + i * 10} y2="130" stroke="#dfd2c4" strokeWidth="0.8" />
      ))}

      {/* Jacuzzi Pool */}
      <rect x="190" y="25" width="60" height="50" rx="6" style={waterStyle} />
      <rect x="195" y="30" width="50" height="40" rx="4" fill="none" stroke="#aabcc4" strokeWidth="1" />
      <circle cx="220" cy="50" r="10" fill="none" stroke="#fff" strokeWidth="0.6" strokeDasharray="3 2" />

      {/* Lounge Area with parasol */}
      <circle cx="70" cy="50" r="12" style={furnitureStyle} />
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i * Math.PI) / 4
        return (
          <line
            key={i}
            x1="70"
            y1="50"
            x2={70 + 12 * Math.cos(angle)}
            y2={50 + 12 * Math.sin(angle)}
            stroke="#8c9288"
            strokeWidth="0.5"
          />
        )
      })}
      
      {/* Sunbeds */}
      <rect x="120" y="25" width="16" height="38" rx="1" style={furnitureStyle} />
      <rect x="142" y="25" width="16" height="38" rx="1" style={furnitureStyle} />

      {/* Dining Table */}
      <rect x="55" y="90" width="50" height="24" rx="2" style={furnitureStyle} />
      <rect x="62" y="83" width="10" height="6" rx="0.5" style={furnitureStyle} />
      <rect x="88" y="83" width="10" height="6" rx="0.5" style={furnitureStyle} />
      <rect x="62" y="115" width="10" height="6" rx="0.5" style={furnitureStyle} />
      <rect x="88" y="115" width="10" height="6" rx="0.5" style={furnitureStyle} />

      {/* Outer railings / walls */}
      <rect x="10" y="10" width="260" height="120" style={wallStyle} />
    </svg>
  )

  const isPenthouse = typology === 'PENTHOUSE DUPLEX'
  const isBasementPlus = typology === 'GROUND FLOOR + BASEMENT'

  // Pick floorplan based on bedrooms count
  const renderCurrentResidenceFloor = () => {
    if (bedCount >= 4) {
      return renderFourBedroomFloor()
    } else if (bedCount === 3) {
      return renderThreeBedroomFloor()
    } else {
      return renderSingleFloor()
    }
  }

  const floorLabel = bedCount >= 4 
    ? 'RESIDENCE LEVEL • 4-BEDROOM SUITE FLOOR PLAN' 
    : (bedCount === 3 ? 'RESIDENCE LEVEL • 3-BEDROOM SUITE FLOOR PLAN' : 'RESIDENCE LEVEL • 2-BEDROOM SUITE FLOOR PLAN')

  return (
    <div className="apartment-floorplans-container">
      {isBasementPlus ? (
        <>
          <div className="floorplan-box">
            <div className="floorplan-svg-wrap">{renderCurrentResidenceFloor()}</div>
            <span className="floorplan-label">{floorLabel}</span>
          </div>
          <div className="floorplan-box">
            <div className="floorplan-svg-wrap">{renderBasement()}</div>
            <span className="floorplan-label">LOWER LEVEL • BASEMENT & ENTERTAINMENT SUITE</span>
          </div>
        </>
      ) : isPenthouse ? (
        <>
          <div className="floorplan-box">
            <div className="floorplan-svg-wrap">{renderCurrentResidenceFloor()}</div>
            <span className="floorplan-label">RESIDENCE LEVEL • FIRST FLOOR</span>
          </div>
          <div className="floorplan-box">
            <div className="floorplan-svg-wrap">{renderPenthouseDeck()}</div>
            <span className="floorplan-label">UPPER LEVEL • SOLARIUM ROOFTOP DECK</span>
          </div>
        </>
      ) : (
        <div className="floorplan-box">
          <div className="floorplan-svg-wrap">{renderCurrentResidenceFloor()}</div>
          <span className="floorplan-label">{floorLabel}</span>
        </div>
      )}
    </div>
  )
}
