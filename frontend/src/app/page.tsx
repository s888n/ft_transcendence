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
import { Suspense, use, useContext } from "react";
import UserContext from "@/contexts/UserContext";
import Navbar from "@/Components/Navbar";
import Loading from "@/Components/pong/Loading";
import { getAPI } from "@/api/APIServices";
import { useEffect, useState } from "react";
export default function Page() {
	const { user } = useContext(UserContext);
	const [matches, setMatches] = useState(null);
	useEffect(() => {
			getAPI("game/all_matches").then((res:any) => {console.log(res);})
		}, []);
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
