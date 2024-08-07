"use client";
// import useKeboard from "../../hooks/useKeyboard";
import { useFrame } from "@react-three/fiber";
import React, {useContext,useEffect} from "react";
import { useKeyboardControls } from "@react-three/drei";
import UserContext from "@/contexts/UserContext";
interface OnlineEventHandlerProps {
	socket: React.MutableRefObject<WebSocket>;
}
export default function OnlineEventHandler({ socket }: OnlineEventHandlerProps) {
	const [ subscribeKeys, getKeys ] = useKeyboardControls()
	const {user} = useContext(UserContext);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
				if (e.code === "Space") {
					socket.current.send(
						JSON.stringify({
							event: "START",
							type: "online",
							username: user?.username,
						})
					);
				} else if (e.code === "KeyP") {
					socket.current.send(
						JSON.stringify({
							event: "PAUSE",
							type: "online",
							username: user?.username,
						})
					);
				}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [socket, user]);

	useFrame((state, delta) => {
		const { moveUP1 , moveUP2 ,moveDOWN1 ,moveDOWN2} = getKeys();
		moveUP1 &&
			socket.current.send(
				JSON.stringify({
					event: "MOVE",
					type: "online",
					direction: 1,
					playerID: 1,
					username: user?.username,
				})
			);
		moveDOWN1 &&
			socket.current.send(
				JSON.stringify({
					event: "MOVE",
					type: "online",
					direction: -1,
					playerID: 1,
					username: user?.username,
				})
			);
		moveUP2 &&
			socket.current.send(
				JSON.stringify({
					event: "MOVE",
					type: "online",
					direction: 1,
					playerID: 2,
					username: user?.username,
				})
			);
		moveDOWN2 &&
			socket.current.send(
				JSON.stringify({
					event: "MOVE",
					type: "online",
					direction: -1,
					playerID: 2,
					username: user?.username,
				})
			);
	});
	return <></>;
}