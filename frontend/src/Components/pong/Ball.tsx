"use client";
import { forwardRef} from "react";
import * as THREE from "three";

import { Colors } from "@/contexts/CustomizationContext";
const Ball = forwardRef(function Ball(props: {}, ref: React.Ref<THREE.Mesh>) {
	const color = Colors.find(c => c === localStorage.getItem("ballColor")) || Colors[0];
	return (
		<mesh ref={ref} {...props} castShadow receiveShadow>
			<sphereGeometry args={[0.1, 32, 32]} />
			<meshStandardMaterial color={color} metalness={0.5} />
		</mesh>
	);
});

export default Ball;
