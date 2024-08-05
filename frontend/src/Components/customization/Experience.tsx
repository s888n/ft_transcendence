"use client"
import { Canvas,useFrame,useLoader} from "@react-three/fiber";
import { useRef } from "react";
import { useCustomization } from "@/contexts/CustomizationContext";
import {
	OrbitControls,
	RoundedBox,
	Stage,
	Text,
} from "@react-three/drei";
import * as THREE from "three";
interface CustomizationData {
	ballColor: string;
	paddleColor: string;
	borderColor: string;
	scoreColor: string;
	background: { path: string };
}
const Scene = () => {
    const ref = useRef<any>();
	const geometry = new THREE.BoxGeometry(0.3, 0.01, 0.1);
    const {
        ballColor,
        paddleColor,
        borderColor,
        scoreColor,
        background,
    } = useCustomization() as CustomizationData;

	const texture = useLoader(THREE.TextureLoader, background.path);
    useFrame(() => {
        ref.current.rotation.y += 0.01;
    });
    return(
        <>
        {/* <Environment map={texture} background /> */}
		<mesh>
			<sphereGeometry args={[100, 32, 32]} />
			<meshBasicMaterial
				attach={"material"}
				map={texture}
				side={THREE.BackSide}
			/>
		</mesh>
		<ambientLight intensity={0.5} />
        <group ref={ref}>
			<Stage shadows adjustCamera>
				<mesh>
                <sphereGeometry args={[0.1, 32, 32]} />
						<meshStandardMaterial
							color={ballColor}
							roughness={0.5}
							metalness={0.5}
                            />
					</mesh>
					<RoundedBox
						args={[0.3, 1, 0.15]}
						position={[0, 0, 6]}
						rotation={[0, 0, -Math.PI / 2]}
						radius={0.05}
                        >
						<meshStandardMaterial
							color={paddleColor}
							roughness={0.5}
							metalness={0.5}
                            />
					</RoundedBox>
					<RoundedBox
						args={[0.3, 1, 0.15]}
						position={[0, 0, -6]}
						rotation={[0, 0, -Math.PI / 2]}
						radius={0.05}
                        >
						<meshStandardMaterial
							color={paddleColor}
							roughness={0.5}
							metalness={0.5}
                            />
					</RoundedBox>
					<RoundedBox
						args={[0.15, 0.3, 12]}
						position={[-3.075, 0, 0]}
						radius={0.075}
                        >
						<meshStandardMaterial
							color={borderColor}
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
							color={borderColor}
							roughness={0.5}
							metalness={0.5}
                            />
					</RoundedBox>
                    {[0,0].map((_,i)=>(
                        <Text
                            key={i}
                            font={"/ARCADECLASSIC.TTF"}
                            scale={[3, 3, 3]}
                            position={[2, 0, i===0?1.82:-1.67]}
                            color={scoreColor}
                            rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
                            >
                            0
                        </Text>
                    ))}
				<group position={[-2.85, 0, 0]}>
				{[...Array(9)].map((_, i) => (
					<mesh
						key={i}
						geometry={geometry}
						position={[i * 0.715, -0.11, 0]}
					>
					<meshStandardMaterial
						color={borderColor}
						roughness={0.5}
						metalness={0.5}
					/>
					</mesh>
				))}
				</group>
			</Stage>
		</group>
    </>)
}



export default function Experience() {
    return (
        <Canvas camera={{ position: [0, 10, 10] }} className="rounded-lg">
            <Scene />
			<OrbitControls/>
        </Canvas>
    )
}