"use client";
import { MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";
export default function Floor() {
	return (
		<mesh rotation={[-Math.PI / 2, 0, 0]} position-y={-1}>
			<planeGeometry args={[170, 170]} />
			<MeshReflectorMaterial
				blur={[300, 100]}
				resolution={2048}
				mixBlur={1}
				mixStrength={40}
				roughness={1}
				depthScale={1.2}
				minDepthThreshold={0.4}
				maxDepthThreshold={1.4}
				color="#101010"
				metalness={0.5}
				side={THREE.DoubleSide}
				mirror={0.5}
			/>
		</mesh>
	);
}
