"use client";
import { RoundedBox } from "@react-three/drei";
import { Colors } from "@/contexts/CustomizationContext";
export default function Borders() {
	const color = Colors.find(c => c === localStorage.getItem("borderColor")) || Colors[0];
	return (
		<group>
			<RoundedBox
				args={[0.15, 0.3, 12]}
				position={[-3.075, 0, 0]}
				radius={0.075}
			>
				<meshStandardMaterial
					color={color}
					roughness={0.5}
					metalness={0.5}
				/>
			</RoundedBox>
			<RoundedBox
				args={[0.15, 0.3, 12]}
				position={[3.075, 0, 0]}
				radius={0.075}
			>
				<meshStandardMaterial
					color={color}
					roughness={0.5}
					metalness={0.5}
				/>
			</RoundedBox>
		</group>
	);
}
