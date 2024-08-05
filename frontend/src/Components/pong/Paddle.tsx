"use client";
import React, { forwardRef } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { Colors } from "@/contexts/CustomizationContext";

const Paddle = forwardRef(function Paddle(
	props: {},
	ref: React.Ref<THREE.Mesh>
) {
	// const color = localStorage.getItem("paddleColor") || Colors[0];
	const color = Colors.find(c => c === localStorage.getItem("paddleColor")) || Colors[0];
	return (
		<RoundedBox
			ref={ref}
			receiveShadow
			castShadow
			args={[0.3, 1, 0.15]}
			rotation={[0, 0, -Math.PI / 2]}
			radius={0.05}
			{...props}
		>
			<meshStandardMaterial
				color={color}
				roughness={0.5}
				metalness={0.5}
			/>
		</RoundedBox>
	);
});

export default Paddle;