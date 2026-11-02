import React from 'react'

export default function FloorPlanSVG({ typology }) {
  // Styles for the SVG elements
  const wallStyle = { fill: 'none', stroke: '#252822', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' }
  const thinWallStyle = { fill: 'none', stroke: '#252822', strokeWidth: '1', strokeLinecap: 'round', strokeLinejoin: 'round' }
  const furnitureStyle = { fill: '#ffffff', stroke: '#8c9288', strokeWidth: '0.8' }
  const grassStyle = { fill: '#e1e5de' }
  const woodStyle = { fill: '#eadcce' }
  const waterStyle = { fill: '#cbdde5' }

  const renderSingleFloor = () => (
    <svg viewBox="0 0 280 140" width="100%" height="100%" style={{ background: '#f8f6f0' }}>
      {/* Terraces / Outdoor areas on the left */}
      <rect x="10" y="10" width="60" height="120" style={woodStyle} />
      <line x1="20" y1="10" x2="20" y2="130" stroke="#d5c8bb" strokeWidth="0.8" />
      <line x1="30" y1="10" x2="30" y2="130" stroke="#d5c8bb" strokeWidth="0.8" />
      <line x1="40" y1="10" x2="40" y2="130" stroke="#d5c8bb" strokeWidth="0.8" />
      <line x1="50" y1="10" x2="50" y2="130" stroke="#d5c8bb" strokeWidth="0.8" />
      <line x1="60" y1="10" x2="60" y2="130" stroke="#d5c8bb" strokeWidth="0.8" />
      
      {/* Pool or green area */}
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
      {/* Table */}
      <circle cx="112" cy="75" r="14" style={furnitureStyle} />

      {/* Outer structural walls */}
      <rect x="70" y="10" width="200" height="120" style={wallStyle} />
      
      {/* Windows (breaks in wall) */}
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
      {/* Decking lines */}
      {Array.from({ length: 26 }, (_, i) => (
        <line key={i} x1={10 + i * 10} y1="10" x2={10 + i * 10} y2="130" stroke="#dfd2c4" strokeWidth="0.8" />
      ))}

      {/* Jacuzzi Pool */}
      <rect x="190" y="25" width="60" height="50" rx="6" style={waterStyle} />
      <rect x="195" y="30" width="50" height="40" rx="4" fill="none" stroke="#aabcc4" strokeWidth="1" />
      <circle cx="220" cy="50" r="10" fill="none" stroke="#fff" strokeWidth="0.6" strokeDasharray="3 2" />

      {/* Lounge Area with parasol */}
      <circle cx="70" cy="50" r="12" style={furnitureStyle} />
      {/* Parasol spokes */}
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
      {/* Chairs */}
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

  return (
    <div className="apartment-floorplans-container">
      {isBasementPlus ? (
        <>
          <div className="floorplan-box">
            <div className="floorplan-svg-wrap">{renderSingleFloor()}</div>
            <span className="floorplan-label">Planta Baja • GROUND FLOOR</span>
          </div>
          <div className="floorplan-box">
            <div className="floorplan-svg-wrap">{renderBasement()}</div>
            <span className="floorplan-label">Planta Sótano • BASEMENT FLOOR</span>
          </div>
        </>
      ) : isPenthouse ? (
        <>
          <div className="floorplan-box">
            <div className="floorplan-svg-wrap">{renderSingleFloor()}</div>
            <span className="floorplan-label">Planta Primera • FIRST FLOOR</span>
          </div>
          <div className="floorplan-box">
            <div className="floorplan-svg-wrap">{renderPenthouseDeck()}</div>
            <span className="floorplan-label">Planta Solárium • SOLARIUM DECK</span>
          </div>
        </>
      ) : (
        <div className="floorplan-box">
          <div className="floorplan-svg-wrap">{renderSingleFloor()}</div>
          <span className="floorplan-label">Planta Baja • GROUND FLOOR</span>
        </div>
      )}
    </div>
  )
}
