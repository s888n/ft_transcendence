"use client";
import { useRouter } from "next/navigation";
export default function Gameover({
	winner,
	winnerImage,
}: Readonly<{
	winner: string;
	winnerImage: string;
}>): JSX.Element {
	const router = useRouter();
	return (
		<div className="absolute top-0 left-0 z-10 w-full h-full flex flex-col items-center justify-center bg-black font-bold ">
			<h1 className="text-9xl text-center font-retroFont text-myred">
				Game Over
			</h1>
			<h2 className="text-2xl font-retroFont text-center text-white">
				Winner
			</h2>
			<div
				className="text-4xl mt-4 w-full text-center flex flex-col items-center
			 text-green-600"
			>
				{winnerImage && 
				<img
					src={winnerImage}
					alt={`${winner}'s avatar`}
					className="w-60 h-60"
				/>}
				<span className="text-4xl">{winner}</span>
			</div>
		</div>
	);
}
