import { Canvas, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Html, OrbitControls, RoundedBox, useTexture } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { BackSide, LinearMipmapLinearFilter, SRGBColorSpace, LinearFilter, UnsignedByteType } from 'three'

const floorRooms = {
  living: { label: 'Living suite', color: '#d5b98d' },
  kitchen: { label: 'Kitchen', color: '#8ea39a' },
  master: { label: 'Master suite', color: '#9ba7b7' },
  guest: { label: 'Guest room', color: '#b99b8d' }
}

function WindowBand({ y, side = 1 }) {
  return <>{[-1.15, -.38, .38, 1.15].map(x => <mesh key={x} position={[x, y, side * 1.06]}>
    <boxGeometry args={[.56, .38, .035]} /><meshPhysicalMaterial color="#5f7f89" metalness={.15} roughness={.18} transmission={.08} />
  </mesh>)}</>
}

function Tower({ selectedFloor, onFloorSelect }) {
  const floors = useMemo(() => Array.from({ length: 10 }, (_, i) => i + 1), [])
  return <group rotation={[0, -.48, 0]} position={[0, -.15, 0]}>
    <RoundedBox args={[3.65, .34, 2.55]} position={[0, -2.65, 0]} radius={.08}><meshStandardMaterial color="#313a37" roughness={.75} /></RoundedBox>
    {floors.map((floor, index) => {
      const active = floor === selectedFloor
      return <group key={floor} position={[0, index * .52 - 2.25, 0]} onClick={(e) => { e.stopPropagation(); onFloorSelect(floor) }}>
        <mesh scale={active ? [1.055, 1.05, 1.055] : 1}>
          <boxGeometry args={[3.35, .46, 2.12]} /><meshStandardMaterial color={active ? '#ead6aa' : index % 2 ? '#e7e3da' : '#f4f1e9'} roughness={.58} />
        </mesh>
        <WindowBand y={.02} /><WindowBand y={.02} side={-1} />
        <mesh position={[0, -.27, 1.17]}><boxGeometry args={[3.65, .08, .38]} /><meshStandardMaterial color={active ? '#bf8a3c' : '#a99472'} /></mesh>
      </group>
    })}
    <mesh position={[0, 2.74, 0]}><boxGeometry args={[3.2, .16, 1.95]} /><meshStandardMaterial color="#29322f" /></mesh>
    <mesh position={[0, 2.97, 0]}><cylinderGeometry args={[.16, .2, .42, 24]} /><meshStandardMaterial color="#c49a52" metalness={.45} /></mesh>
  </group>
}

function Sofa({ position, rotation = [0, 0, 0], color = '#7b8c84' }) {
  return <group position={position} rotation={rotation}>
    <RoundedBox args={[1.15, .25, .48]} position={[0, .22, 0]} radius={.06}><meshStandardMaterial color={color} /></RoundedBox>
    <RoundedBox args={[1.15, .48, .16]} position={[0, .48, .17]} radius={.05}><meshStandardMaterial color={color} /></RoundedBox>
    {[-.48, .48].map(x => <RoundedBox key={x} args={[.15, .35, .5]} position={[x, .32, 0]} radius={.04}><meshStandardMaterial color={color} /></RoundedBox>)}
  </group>
}

function Bed({ position }) {
  return <group position={position}><RoundedBox args={[1.15, .22, 1.5]} position={[0, .25, 0]} radius={.08}><meshStandardMaterial color="#c7b69e" /></RoundedBox><mesh position={[0, .48, .48]}><boxGeometry args={[1.05, .12, .38]} /><meshStandardMaterial color="#f4efe5" /></mesh><mesh position={[0, .52, -.68]}><boxGeometry args={[1.2, .7, .12]} /><meshStandardMaterial color="#554f49" /></mesh></group>
}

function FloorPlan({ selectedRoom, onRoomSelect }) {
  const rooms = [
    { id: 'living', pos: [-1.15, 0, .6], size: [2.15, .08, 2.15] },
    { id: 'kitchen', pos: [1.08, 0, .85], size: [1.8, .08, 1.65] },
    { id: 'master', pos: [1.02, 0, -1], size: [1.95, .08, 1.8] },
    { id: 'guest', pos: [-1.18, 0, -1.15], size: [2.1, .08, 1.45] }
  ]
  return <group rotation={[0, -.2, 0]} position={[0, -.9, 0]}>
    <mesh position={[0, -.08, 0]}><boxGeometry args={[4.4, .15, 3.7]} /><meshStandardMaterial color="#d8d1c4" /></mesh>
    {rooms.map(room => <group key={room.id} onClick={e => { e.stopPropagation(); onRoomSelect(room.id) }}>
      <mesh position={room.pos}><boxGeometry args={room.size} /><meshStandardMaterial color={selectedRoom === room.id ? floorRooms[room.id].color : '#eee9de'} roughness={.78} /></mesh>
      <mesh position={[room.pos[0], .035, room.pos[2]]}><boxGeometry args={[room.size[0] - .08, .03, room.size[2] - .08]} /><meshStandardMaterial color={selectedRoom === room.id ? '#e3cda6' : '#e4ddd1'} /></mesh>
    </group>)}
    <Sofa position={[-1.15, .05, .55]} rotation={[0, .3, 0]} /><Bed position={[1, .04, -1]} />
    <mesh position={[1.08, .38, .92]}><boxGeometry args={[1.25, .72, .42]} /><meshStandardMaterial color="#6d756d" /></mesh>
    <mesh position={[-.9, .2, -1.15]}><boxGeometry args={[.8, .32, .55]} /><meshStandardMaterial color="#aa8e67" /></mesh>
    {[[-2.18, 0, 0], [2.18, 0, 0], [0, 0, -1.82], [0, 0, 1.82], [0, .65, .05]].map((p, i) => <mesh key={i} position={[p[0], .43, p[2]]}><boxGeometry args={i === 4 ? [.08, .82, 3.5] : Math.abs(p[0]) > 0 ? [.08, .85, 3.7] : [4.4, .85, .08]} /><meshStandardMaterial color="#f7f3eb" /></mesh>)}
  </group>
}

function Hotspot({ position, number, label, onSelect }) {
  return <Html position={position} center transform distanceFactor={5} occlude={false}>
    <button className="scene-hotspot" onClick={e => { e.stopPropagation(); onSelect && onSelect(label) }} aria-label={`View ${label}`}><span>{number}</span><b>{label}</b></button>
  </Html>
}

function PanoramaRoom({ onFurnitureSelect, rotation = 0, panoramaUrl }) {
  const texture = useTexture(panoramaUrl)
  const { gl } = useThree()

  // High-quality texture settings for crisp 360 panoramas
  useEffect(() => {
    if (!texture || !texture.image) return
    texture.colorSpace = SRGBColorSpace
    texture.generateMipmaps = true
    texture.minFilter = LinearMipmapLinearFilter
    texture.magFilter = LinearFilter
    texture.anisotropy = gl.capabilities.getMaxAnisotropy()
    texture.needsUpdate = true
  }, [texture, gl])

  // Explicitly dispose of texture on unmount to free GPU memory and prevent WebGL context loss
  useEffect(() => {
    return () => {
      if (texture) {
        texture.dispose()
      }
      try {
        useTexture.clear(panoramaUrl)
      } catch (err) {
        // Fallback silently if clear method is not found
      }
    }
  }, [texture, panoramaUrl])

  const hotspots = useMemo(() => {
    if (panoramaUrl.includes('cayley')) {
      return [
        { position: [1.4, -.7, -4.2], number: '01', label: 'Bouclé sofa' },
        { position: [-3.8, -1.1, -1.8], number: '02', label: 'Travertine table' }
      ]
    } else if (panoramaUrl.includes('kiara')) {
      return [
        { position: [-3.8, .1, 2.5], number: '01', label: 'Designer kitchen' },
        { position: [1.8, -.8, -3.2], number: '02', label: 'Breakfast bar' }
      ]
    } else if (panoramaUrl.includes('bedroom')) {
      return [
        { position: [0, -.5, -4.2], number: '01', label: 'King size bed' },
        { position: [3.2, -.8, -2.5], number: '02', label: 'Lounge chair' },
        { position: [-3.5, 0.4, 2.2], number: '03', label: 'Terrace doors' }
      ]
    }
    return []
  }, [panoramaUrl])

  return <group rotation={[0, Math.PI / 2 + rotation, 0]}>
    <mesh scale={[-1, 1, 1]}>
      {/* Higher segment count keeps the texture sharp when the camera
          sits very close to the sphere surface (camera at z=0.05). */}
      <sphereGeometry args={[20, 256, 160]} />
      <meshBasicMaterial map={texture} side={BackSide} toneMapped={false} />
    </mesh>
    {hotspots.map(h => (
      <Hotspot key={h.label} position={h.position} number={h.number} label={h.label} onSelect={onFurnitureSelect} />
    ))}
  </group>
}

function PanoramaPreloader({ url }) {
  // Warm the browser cache so when the user opens 360° the texture is already on disk
  useEffect(() => {
    if (!url) return
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.decoding = 'async'
    img.src = url
    return () => { img.src = '' }
  }, [url])
  return null
}

export default function ApartmentScene({ mode, selectedFloor, selectedRoom, onFloorSelect, onRoomSelect, onFurnitureSelect, panoramaRotation = 0, panoramaUrl = '/assets/kiara-interior-8k.jpg', autoRotate = false }) {
  const camera = mode === 'building' ? [6, 3.6, 7] : mode === 'floor' ? [5.8, 6.7, 6.4] : [0, 0, .05]
  const isRoom = mode === 'room'

  // ResizeObserver: when the overlay mounts the canvas parent can be 0×0
  // for a frame. Force the renderer to recompute size on every change.
  const wrapRef = useRef(null)
  useEffect(() => {
    if (!wrapRef.current || !isRoom) return
    const ro = new ResizeObserver(() => {
      window.dispatchEvent(new Event('resize'))
    })
    ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [isRoom])

  return (
    <div ref={wrapRef} style={{ width: '100%', height: '100%', background: '#0b0d0c' }}>
      <Canvas
        shadows
        gl={{ antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: false, alpha: false }}
        camera={{ position: camera, fov: 37 }}
        dpr={[1, 2.5]}
        // Force a known minimum size so the WebGL viewport never starts at 0×0
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        {isRoom && <PanoramaPreloader url={panoramaUrl} />}
        {/* Dark background matches the panorama's lit interior shadows
            so the first frame before the texture decodes doesn't flash black. */}
        {isRoom && <color attach="background" args={['#1a1611']} />}
        {!isRoom && <><color attach="background" args={['#d9ddd9']} /><fog attach="fog" args={['#d9ddd9', 10, 20]} /></>}
        {!isRoom && <><ambientLight intensity={1.5} /><directionalLight castShadow position={[5, 8, 6]} intensity={3.2} /></>}
        <Suspense fallback={null}>
          {mode === 'building' && <Tower selectedFloor={selectedFloor} onFloorSelect={onFloorSelect} />}
          {mode === 'floor' && <FloorPlan selectedRoom={selectedRoom} onRoomSelect={onRoomSelect} />}
          {isRoom && <PanoramaRoom onFurnitureSelect={onFurnitureSelect} rotation={panoramaRotation} panoramaUrl={panoramaUrl} />}
          {!isRoom && <><ContactShadows position={[0, -1.15, 0]} opacity={.35} scale={9} blur={2.8} /><Environment preset="apartment" /></>}
        </Suspense>
        <OrbitControls makeDefault enablePan={false} enableDamping dampingFactor={.07} autoRotate={isRoom && autoRotate} autoRotateSpeed={-.48} rotateSpeed={isRoom ? -.35 : .75} minDistance={isRoom ? .01 : mode === 'building' ? 5 : 4} maxDistance={isRoom ? .12 : mode === 'building' ? 11 : 9} minPolarAngle={isRoom ? .35 : 0} maxPolarAngle={isRoom ? Math.PI - .35 : Math.PI / 2.04} />
      </Canvas>
    </div>
  )
}
