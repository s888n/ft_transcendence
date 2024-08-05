"use client";
import React from "react";
import { Text } from "@react-three/drei";
import { Colors } from "@/contexts/CustomizationContext";
export default function Score({
	score1,
	score2,
}: Readonly<{
	score1: number;
	score2: number;
}>): JSX.Element {
	// const font = useLoader(THREE.FontLoader, "/ARCADECLASSIC.TTF");
	const color = Colors.find(c => c === localStorage.getItem("scoreColor")) || Colors[0];
	return (
		<>
			{[score1, score2].map((score, index) => (
				<Text
					key={index}
					font={"/ARCADECLASSIC.TTF"}
					scale={[3, 3, 3]}
					position={[2, 0, index === 0 ? -1.67 : 1.82]}
					color={color}
					rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
				>
					{score}
				</Text>
			))}
		</>
	);
}