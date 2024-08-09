"use client";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useState, useContext } from "react";
import UserContext from "@/contexts/UserContext";
// import Game from "@/Components/pong/Game";
import LocalGame from "@/Components/pong/LocalGame";
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
	{ name: "moveUP2", keys: ["KeyW", "KeyS"] },
	{ name: "moveDOWN2", keys: ["KeyS", "KeyD"] },
];

export default function Page() {
	const[player1, setPlayer1] = useState("Salah");
	const[player2, setPlayer2] = useState("Max");
	const [winner, setWinner] = useState("");
	const { user } = useContext(UserContext);
	const [gameState, setGameState] = useState("waiting");
	const playerImage = `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/apiback/images/` + user?.avatar;
	return (
		<div className="fixed h-full w-full flex flex-col  justify-center items-center p-4">
			<Players
				player1Name={player1}
				player2Name={player2}
				player1Avatar={playerImage}
				player2Avatar={playerImage}
			/>
			<div className="relative w-full h-1/2  rounded  ">
				{gameState === "waiting" && <Ready rules={Rules} />}
				{gameState === "paused" && <Pause />}
				{gameState === "gameover" && (
					<Gameover
						winner={winner}
						winnerImage={playerImage}
					/>
				)}
				<Canvas
					camera={{ position: [-0.5, 5, 0], fov: 60 }}
					className="rounded-lg"
				>
					<KeyboardControls map={map}>
						<LocalGame
							player1={player1}
							player2={player2}
							difficulty="easy"
							mode={"pvp"}
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
