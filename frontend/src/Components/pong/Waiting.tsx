"use client";
export default function Waiting() {
	return (
		<div className="flex items-center justify-center min-h-screen p-5 bg-black-100 min-w-screen">
			<h2
				className="w-3 h-3 bg-white-500 animate-pulse
				font-bold text-3xl 
			"
			>
				Waiting for opponent...
			</h2>
		</div>
	);
}