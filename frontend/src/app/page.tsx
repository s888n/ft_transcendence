"use client";
import {
	Environment,
	OrbitControls,
	ContactShadows,
	Float,
	Center,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Arcade from "@/Components/Arcade";
import Greeting from "@/Components/Greeting";
import { Suspense, useContext } from "react";
import UserContext from "@/contexts/UserContext";
import Navbar from "@/Components/Navbar";
import Loading from "@/Components/pong/Loading";
export default function Page() {
	const { user } = useContext(UserContext);

	return (
		<>
			<Navbar />
			<Suspense fallback={<Loading />}>
				<div
					className={"absolute -z-10 top-20 left-0 right-0 bottom-0"}
				>
					<Canvas
						shadows
						camera={{ position: [4, 2.5, 15], fov: 35 }}
					>
						<Float>
							<Greeting name={user?.username} />
							<Arcade />
						</Float>
						<ContactShadows
							frames={1}
							position={[0, -3, 0]}
							opacity={0.5}
							blur={1}
						/>
						<OrbitControls />
						<Environment preset="sunset" />
					</Canvas>
				</div>
			</Suspense>
		</>
	);
}
