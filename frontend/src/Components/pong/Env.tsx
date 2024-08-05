"use client";
import { Backgrounds } from "@/contexts/CustomizationContext";
import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'
export default function Env() {
	const background = Backgrounds.find(bg => bg.name === localStorage.getItem("background")) || Backgrounds[0];

	const texture = useLoader(THREE.TextureLoader, background.path);	

	return (
	<>
		<directionalLight  color={"#FFFFFF"} castShadow position={[20, 5, 15]} intensity={2} />
		<directionalLight color={"#FFFFFF"} castShadow position={[-10, 20, 15]} intensity={1} />
		<ambientLight intensity={1.8}/>
		<mesh>
			<sphereGeometry args={[100, 32, 32]} />
			<meshBasicMaterial
				attach={"material"}
				map={texture}
				side={THREE.BackSide}
			/>
		</mesh>
	</>
	)
}
