"use client";
import { Canvas } from "@react-three/fiber";
import LocalGame from "@/Components/pong/LocalGame";
import { useContext, useState } from "react";
import UserContext from "@/contexts/UserContext";
import Pause from "@/Components/pong/Pause";
import Ready from "@/Components/pong/Ready";
import Gameover from "@/Components/pong/Gameover";
import Players from "@/Components/pong/Players";
import { KeyboardControls } from "@react-three/drei";

const Rules = [
	"- Controls : ↑ ↓ ← →",
	"- Start: Space",
	"- Pause: P",
	"- First to 5 points wins",
	"- Use the mouse to adjust your view",
	"- Chose a difficulty level before starting",
];
const map = [
	{ name: "moveUP1", keys: ["ArrowUp", "ArrowRight"] },
	{ name: "moveDOWN1", keys: ["ArrowDown", "ArrowLeft"] },
	{ name: "moveUP2", keys: ["KeyW", "KeyD"] },
	{ name: "moveDOWN2", keys: ["KeyS", "KeyA"] },
];

export default function Page() {
	const { user } = useContext(UserContext);
	const [gameState, setGameState] = useState("waiting");
	const [difficulty, setDifficulty] = useState("easy");
	const [ winner, setWinner ] = useState("");
	const playerImage = `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/apiback/images/` + user?.avatar;
	const benderImage = "/play/bender.png";
	return (
		<div className="fixed h-full w-full flex flex-col  justify-center items-center p-4">
			<Players
				player1Name={"Bender"}
				player2Name={user?.username || "Player"}
				player1Avatar={benderImage}
				player2Avatar={playerImage}
			/>
			<div className="relative w-full h-1/2  rounded  p-4">
				{gameState === "waiting" && <Ready rules={Rules} />}
				{gameState === "paused" && <Pause />}
				{gameState === "gameover" && (
					<Gameover
						winner={winner}
						winnerImage= {winner === "Bender" ? benderImage : playerImage}
					/>
				)}
				<Canvas
					className="rounded-lg"
					camera={{ position: [0, 5, 10], fov: 60 }}
				>
					<KeyboardControls map={map}>
						<LocalGame
							player1={"Bender"}
							player2={user?.username || "Player"}
							difficulty={difficulty}
							mode={"practice"}
							setWinner={setWinner}
							gameState={gameState}
							setGameState={setGameState}
						/>
					</KeyboardControls>
				</Canvas>
			</div>
			{ gameState === "waiting" && <DifficultyMenu difficulty={difficulty} setDifficulty={setDifficulty} />}
		</div>
	);
}


function DifficultyMenu({  difficulty ,setDifficulty }: {
	difficulty: string;
	setDifficulty: (difficulty: string) => void;
})
{	
	const levels = ["easy", "medium", "hard"];
	return (
		<div className="w-full text-black text-2xl flex justify-center items-center space-x-4">
			<span>Difficulty:</span>
			<div className="flex space-x-4">
				<button
					className={`px-2 py-1 rounded-lg ${
						difficulty === "easy" ? "bg-green-500" : "bg-gray-400"
					}`}
					onClick={() => setDifficulty("easy")}
				>
					Easy
				</button>
				<button
					className={`px-2 py-1 rounded-lg ${
						difficulty === "medium" ? "bg-yellow-500" : "bg-gray-400"
					}`}
					onClick={() => setDifficulty("medium")}
				>
					Medium
				</button>
				<button
					className={`px-2 py-1 rounded-lg ${
						difficulty === "hard" ? "bg-red-500" : "bg-gray-400"
					}`}
					onClick={() => setDifficulty("hard")}
				>
					Hard
				</button>
			</div>
		</div>
	);
}