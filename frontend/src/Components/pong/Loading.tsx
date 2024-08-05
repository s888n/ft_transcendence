"use client";
export default function Loading() {
	return (
		<div className="absolute inset-0 flex items-center justify-center z-10 bg-black">
			<h2 className="font-bold text-3xl  text-white animate-pulse">
				Loading...
			</h2>
		</div>
	);
}