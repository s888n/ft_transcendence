"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { getAPI } from "@/api/APIServices";
import OnlineGame from "@/Components/pong/OnlineGame";
import Ready from "@/Components/pong/Ready";
import Gameover from "@/Components/pong/Gameover";
import { KeyboardControls } from "@react-three/drei";
import Players from "@/Components/pong/Players";
const Rules = [
	"- Up/Right : ↑ → W D",
	"- Down/Left : ↓ ← S A",
	"- Start: Space",
	"- Pause: P",
	"- First to 5 points wins",
	"- Use the mouse to adjust your view",
	"- Each player can pause 3 times, each pause lasts 15 seconds",
];
const map = [
	{ name: "moveUP1", keys: ["ArrowUp", "ArrowRight"] },
	{ name: "moveDOWN1", keys: ["ArrowDown", "ArrowLeft"] },
	{ name: "moveUP2", keys: ["KeyW", "KeyD"] },
	{ name: "moveDOWN2", keys: ["KeyS", "KeyA"] },
];

function OnlinePause() {
	const [countdown, setCountdown] = useState(15);
	useEffect(() => {
		const interval = setInterval(() => {
			setCountdown(countdown - 1);
		}, 1000);
		return () => clearInterval(interval);
	}, [countdown]);

	return (
		<div className="absolute inset-0 flex items-center justify-center z-10">
			<div className="p-4 rounded-lg">
				<img src={"/pause.png"} alt="pause" width={96} height={96} />
				<div className=" bg-opacity-50 p-4 rounded-lg  items-center">
					<span className="text-4xl text-myred  p-4 rounded-lg font-extrabold text-center">
						{countdown}
					</span>
				</div>
			</div>
		</div>
	);
}

function DisconnectScreen() {
	return (
		<div className="absolute inset-0 flex items-center justify-center z-10 border-red-400">
			<div className="p-4 rounded-lg">
				<p className="text-4xl font-extrabold p-4 rounded-lg  items-center bg-opacity-50 text-myred">
					Opponent disconnected, waiting for reconnection ...
				</p>
			</div>
		</div>
	);
}

export default function Page({ searchParams }: any) {
	const router = useRouter();
	const id = searchParams.id;
	const [gameId, setGameId] = useState("");
	const [player1, setPlayer1] = useState({} as any);
	const [player2, setPlayer2] = useState({} as any);
	const [isFinished, setIsFinished] = useState(false);
	const [winner, setWinner] = useState("");
	const [gameState, setGameState] = useState("waiting" as string);
	const player1Image = `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/apiback/images/${player1.avatar}`;	
	const player2Image = `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/apiback/images/${player2.avatar}`;

	useEffect(() => {
		setGameId(id);
		getAPI(`game/match/${id}/`).then((response: any) => {
			if (response.status === 200) {
				setPlayer1(response.data.player1);
				setPlayer2(response.data.player2);
				setIsFinished(response.data.finished);
				setWinner(response.data.winner?.username);
			} else {
				router.push("/play");
			}
		});
	}, []);
	return (
		<div className="fixed h-full w-full flex flex-col  justify-center items-center p-4">
			<Players
				player1Name={player1.username}
				player2Name={player2.username}
				player1Avatar={player1Image}
				player2Avatar={player2Image}
			/>

			<div className="relative w-full h-1/2 rounded p-4 ">
				{isFinished && <Gameover winner={winner} winnerImage={winner === player1.username ?  player1Image : player2Image} />}
				{!isFinished && (
					<>
						{gameState === "waiting" && <Ready rules={Rules} />}
						{gameState === "paused" && <OnlinePause />}
						{gameState === "disconnected" && <DisconnectScreen />}
						{gameState === "gameover" && (
							<Gameover winner={winner} winnerImage={winner === player1.username ?  player1Image : player2Image} />
						)}
						<Canvas
							camera={{ position: [-0.5, 8, 0], fov: 60 }}
							className="w-full h-full rounded-lg"
						>
							<KeyboardControls map={map}>
								<OnlineGame
									mode={"online"}
									local={false}
									room_id={gameId}
									setWinner={setWinner}
									gameState={gameState}
									setGameState={setGameState}
								/>
							</KeyboardControls>
						</Canvas>
					</>
				)}
			</div>
		</div>
	);
}
