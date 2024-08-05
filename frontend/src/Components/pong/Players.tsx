"use client";

interface PlayersProps {
	player1Name: string;
	player2Name: string;
	player1Avatar: string;
	player2Avatar: string;
}

export default function Players({
	player1Name,
	player2Name,
	player1Avatar,
	player2Avatar,
}: PlayersProps) {
	return (
		<div className="flex justify-between w-full text-black text-2xl">
			<div className="flex flex-col items-center">
				<span className=""> {player1Name}</span>
				<img
					src={player1Avatar}
					alt={`${player1Name}'s avatar`}
					className="w-20 h-20"
				/>
			</div>
			<div className="flex items-center">
				<span className=" text-bald">VS</span>
			</div>
			<div className="flex flex-col items-center">
				<span className="text-bald">{player2Name}</span>
				<img
					src={player2Avatar}
					alt={`${player2Name}'s avatar`}
					className="w-20 h-20 "
				/>
			</div>
		</div>
	);
}
