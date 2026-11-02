import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, RoundedBox } from '@react-three/drei'
import { useRef } from 'react'
import { MathUtils } from 'three'

function CameraRig(){
 const {camera, pointer} = useThree()
 useFrame((_, delta)=>{
  const targetX = 7 + pointer.x * .7
  const targetY = 4.2 + pointer.y * .35
  const targetZ = 8 + Math.abs(pointer.x) * .25
  camera.position.x = MathUtils.damp(camera.position.x,targetX,2.2,delta)
  camera.position.y = MathUtils.damp(camera.position.y,targetY,2.2,delta)
  camera.position.z = MathUtils.damp(camera.position.z,targetZ,2.2,delta)
  camera.lookAt(0,-.25,0)
 })
 return null
}

function Residence(){
 const ref=useRef()
 useFrame(({pointer})=>{if(!ref.current)return;ref.current.rotation.y+=(pointer.x*.22-ref.current.rotation.y)*.035;ref.current.rotation.x+=(-pointer.y*.06-ref.current.rotation.x)*.035})
 return <group ref={ref} rotation={[0,-.18,0]} position={[0,-.45,0]}>
  <RoundedBox args={[5.8,.25,4.2]} position={[0,-1.5,0]} radius={.08}><meshStandardMaterial color="#bcae92"/></RoundedBox>
  {[0,1,2].map(f=><group key={f} position={[0,f*.9-1,0]}>
   <mesh position={[0,.25,0]}><boxGeometry args={[4.9,.75,3.35]}/><meshStandardMaterial color={f===0?'#d7cdbb':'#ece6dc'} roughness={.8}/></mesh>
   <mesh position={[0,.12,1.7]}><boxGeometry args={[5.45,.12,.62]}/><meshStandardMaterial color="#9d8060" roughness={.75}/></mesh>
   {[-1.65,-.55,.55,1.65].map(x=><mesh key={x} position={[x,.28,1.69]}><boxGeometry args={[.82,.52,.035]}/><meshPhysicalMaterial color="#668083" metalness={.18} roughness={.12}/></mesh>)}
  </group>)}
  <mesh position={[0,1.93,0]}><boxGeometry args={[4.6,.15,3]}/><meshStandardMaterial color="#6c6256"/></mesh>
  <mesh position={[0,-1.36,2.8]}><boxGeometry args={[4.4,.08,1.7]}/><meshPhysicalMaterial color="#5a9aa1" transmission={.1} roughness={.12}/></mesh>
  <mesh position={[0,-1.3,3.65]}><boxGeometry args={[5.1,.1,.1]}/><meshStandardMaterial color="#e5dfd3"/></mesh>
  {[-2.4,2.45].map((x,i)=><group key={x} position={[x,-1.05,2.3]}><mesh><cylinderGeometry args={[.12,.17,1.2,12]}/><meshStandardMaterial color="#735946"/></mesh><mesh position={[0,.75,0]}><sphereGeometry args={[.72,16,12]}/><meshStandardMaterial color={i?'#725b49':'#826351'}/></mesh></group>)}
 </group>
}
export default function ResidenceScene(){return <Canvas shadows gl={{antialias:true,powerPreference:'high-performance'}} camera={{position:[7,4.2,8],fov:34}} dpr={[1,1.5]}><color attach="background" args={['#c9c5b8']}/><fog attach="fog" args={['#c9c5b8',10,22]}/><ambientLight intensity={.72}/><directionalLight castShadow shadow-mapSize={[2048,2048]} shadow-bias={-.00015} position={[5,8,6]} intensity={2.6}/><directionalLight position={[-4,3,-2]} intensity={.65} color="#d7c2a4"/><Residence/><ContactShadows position={[0,-1.62,0]} opacity={.42} scale={11} blur={2.6} far={6}/><Environment preset="sunset"/><CameraRig/></Canvas>}
