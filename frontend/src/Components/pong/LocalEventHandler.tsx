"use client";
// import useKeboard from "../../hooks/useKeyboard";
import { useFrame } from "@react-three/fiber";
import React, { useContext, useEffect } from "react";
import { useKeyboardControls } from "@react-three/drei";
import UserContext from "@/contexts/UserContext";
interface LocalEventHandlerProps {
	socket: React.MutableRefObject<WebSocket>;
	type: string;
	player1: string;
	player2: string;
	difficulty: string;
}

export default function LocalEventHandler({
	socket,
	type,
	player1,
	player2,
	difficulty,
}: LocalEventHandlerProps) {
	const [subscribeKeys, getKeys] = useKeyboardControls();

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.code === "Space") {
				socket.current.send(
					JSON.stringify({
						event: "START",
						type: type,
						player1: player1,
						player2: player2,
						difficulty: difficulty,
					})
				);
			} else if (e.code === "KeyP") {
				socket.current.send(
					JSON.stringify({
						event: "PAUSE",
						type: type,
					})
				);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [socket, type, player1, player2, difficulty]);

	useFrame((state, delta) => {
		const { moveUP1, moveUP2, moveDOWN1, moveDOWN2 } = getKeys();
		moveUP1 &&
			socket.current.send(
				JSON.stringify({
					event: "MOVE",
					type: type,
					direction: 1,
					playerID: 1,
				})
			);
		moveDOWN1 &&
			socket.current.send(
				JSON.stringify({
					event: "MOVE",
					type: type,
					direction: -1,
					playerID: 1,
				})
			);
		moveUP2 &&
			socket.current.send(
				JSON.stringify({
					event: "MOVE",
					type: type,
					direction: 1,
					playerID: 2,
				})
			);
		moveDOWN2 &&
			socket.current.send(
				JSON.stringify({
					event: "MOVE",
					type: type,
					direction: -1,
					playerID: 2,
				})
			);
	});
	return <></>;
}
