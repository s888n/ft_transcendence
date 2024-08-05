/* eslint-disable react/no-unknown-property */
import { Text3D, useMatcapTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

export default function Greeting({ name }) {
	const { width: w, height: h } = useThree((state) => state.viewport);
	const [matcapTexture] = useMatcapTexture("CB4E88_F99AD6_F384C3_ED75B9");
	return (
		<Text3D
			position={[-1.6, 2, -0.5]}
			scale={[1, 1, 1]}
			size={w / 20}
			maxWidth={[-w / 5, -h * 2, 3]}
			font={
				"https://threejs.org/examples/fonts/helvetiker_regular.typeface.json"
			}
			curveSegments={24}
			brevelSegments={1}
			bevelEnabled
			bevelSize={0.02}
			bevelThickness={0.03}
			// height={1}
			lineHeight={0.9}
			letterSpacing={0.03}
			// smooth={1}
		>
			Hi, {name}
			<meshMatcapMaterial color="white" matcap={matcapTexture} />
		</Text3D>
	);
}
