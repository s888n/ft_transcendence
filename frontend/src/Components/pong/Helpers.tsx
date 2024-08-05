"use client";
import { OrbitControls } from "@react-three/drei";
import {useFrame } from "@react-three/fiber";
import * as THREE from "three";




export default function Helpers() {

	// useFrame(({ camera }) => {
	// 	camera.rotateZ(-Math.PI /2);
	// 	camera.updateProjectionMatrix();
	// }
	// )

	return (
		<>
			<OrbitControls />
			{/* <gridHelper args={[20, 20]} /> */}
			{/* <axesHelper args={[20]} /> */}
		</>
	);
}
