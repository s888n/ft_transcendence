"use client";
import * as THREE from "three";
import { Colors } from "@/contexts/CustomizationContext";
export default function DashedLine() {
	const count = 9;
	const geometry = new THREE.BoxGeometry(0.3, 0.01, 0.1);
	const color = Colors.find(c => c === localStorage.getItem("borderColor")) || Colors[0];
	return (
		<group position={[-2.85, 0, 0]}>
			{[...Array(count)].map((_, i) => (
				<mesh
					key={i}
					geometry={geometry}
					position={[i * 0.715, -0.11, 0]}
				>
					<meshStandardMaterial
						color={color}
						roughness={0.5}
						metalness={0.5}
					/>
				</mesh>
			))}
		</group>
	);
}
