"use client";
import { Canvas } from "@react-three/fiber";
import Game from "@/Components/pong/Game";
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
	const [ winner, setWinner ] = useState(0);
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
						winner={winner === 1 ? user?.username : "Bender"}
						winnerImage= {winner === 1 ? playerImage : benderImage}
					/>
				)}
				<Canvas
					className="rounded-lg"
					camera={{ position: [0, 5, 10], fov: 60 }}
				>
					<KeyboardControls map={map}>
						<Game
							mode={"practice"}
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
