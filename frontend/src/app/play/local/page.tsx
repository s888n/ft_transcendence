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
	'- You can change your name before starting the game',
];
const map = [
	{ name: "moveUP1", keys: ["ArrowUp", "ArrowRight"] },
	{ name: "moveDOWN1", keys: ["ArrowDown", "ArrowLeft"] },
	{ name: "moveUP2", keys: ["KeyW", "KeyA"] },
	{ name: "moveDOWN2", keys: ["KeyS", "KeyD"] },
];


interface LocalPlayersProps {
	player1: string;
	player2: string;
	setPlayer1: (player1: string) => void;
	setPlayer2: (player2: string) => void;
	avatar: string;
	gameState: string;
}
function LocalPlayers({ player1, player2, setPlayer1, setPlayer2,avatar,gameState }: LocalPlayersProps) {
	return (
		<div className="flex justify-between w-full text-black text-2xl">
			<div className="flex flex-col items-center ">
				<input
					className="rounded-lg p-2 text-center"
					value={player1}
					onChange={(e) => setPlayer1(e.target.value)}
					disabled={gameState !== "waiting"}
				/>
				<img
					src={avatar}
					alt={`${player1}'s avatar`}
					className="w-20 h-20 "
				/>
			</div>
			<div className="flex items-center">
				<span className=" text-bald">VS</span>
			</div>
			<div className="flex flex-col items-center justify-center">
				<input
					className="rounded-lg p-2 text-center"
					value={player2}
					onChange={(e) => setPlayer2(e.target.value)}
					disabled={gameState !== "waiting"}
				/>
				<img
					src={avatar}
					alt={`${player2}'s avatar`}
					className="w-20 h-20 "
				/>
			</div>
		</div>
	);
}
export default function Page() {
	const[player1, setPlayer1] = useState("Player1");
	const[player2, setPlayer2] = useState("Player2");
	const [winner, setWinner] = useState("");
	const { user } = useContext(UserContext);
	const [gameState, setGameState] = useState("waiting");
	const playerImage = `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/apiback/images/` + user?.avatar;
	return (
		<div className="fixed h-full w-full flex flex-col  justify-center items-center p-4">
			<LocalPlayers
				player1={player1}
				player2={player2}
				setPlayer1={setPlayer1}
				setPlayer2={setPlayer2}
				avatar={playerImage}
				gameState={gameState}
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
