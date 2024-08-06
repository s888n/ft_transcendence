"use client";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useState, useContext } from "react";
import UserContext from "@/contexts/UserContext";
import Game from "@/Components/pong/Game";
import Ready from "@/Components/pong/Ready";
import Pause from "@/Components/pong/Pause";
import Players from "@/Components/pong/Players";
import Gameover from "@/Components/pong/Gameover";
import { KeyboardControls } from "@react-three/drei";
const Rules = [
	"- Player 1: W S A D",
	"- Player 2: ↑ ↓ ← →",
	"- Start: Space",
	"- Pause: P",
	"- First to 5 points wins",
	"- Use the mouse to adjust your view",
];
const map = [
	{ name: "moveUP1", keys: ["ArrowUp", "ArrowRight"] },
	{ name: "moveDOWN1", keys: ["ArrowDown", "ArrowLeft"] },
	{ name: "moveUP2", keys: ["KeyW", "KeyD"] },
	{ name: "moveDOWN2", keys: ["KeyS", "KeyA"] },
];

export default function Page() {
	const { user } = useContext(UserContext);
	const [winner, setWinner] = useState("Player1");
	const [gameState, setGameState] = useState(0);
	const playerImage = `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/apiback/images/` + user?.avatar;
	return (
		<div className="fixed h-full w-full flex flex-col  justify-center items-center p-4">
			<Players
				player1Name="Player1"
				player2Name="Player2"
				player1Avatar={playerImage}
				player2Avatar={playerImage}
			/>
			<div className="relative w-full h-1/2  rounded  ">
				{gameState === "waiting" && <Ready rules={Rules} />}
				{gameState === "paused" && <Pause />}
				{gameState === "gameover" && (
					<Gameover
						winner={winner === 0 ? "Player1" : "Player2"}
						winnerImage={
							playerImage
						}
					/>
				)}
				<Canvas
					camera={{ position: [-0.5, 5, 0], fov: 60 }}
					className="rounded-lg"
				>
					<KeyboardControls map={map}>
						<Game
							mode={"pvp"}
							local={true}
							room_id=""
							setWinner={setWinner}
							gameState={gameState}
							setGameState={setGameState}
						/>
					</KeyboardControls>
				</Canvas>
			</div>
		</div>
	);
}
