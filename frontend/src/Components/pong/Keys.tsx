"use client";
export default function Keys({ keys=[] }: { keys: string[] }){
	// const keys = ["←", "→", "A", "D", "Space"];

	return (
		<div className="flex flex-row items-center justify-center">
			{keys.map((key, i) => (
				<Key key={i + key} k={key} />
			))}
		</div>
	);
}

function Key({ k }: { k: string }) {
	return (
		<span
			style={{
				fontSize: "0.7rem",
				minWidth: "24px",
				border: "1px solid transparent",
				borderBottom: "3px solid #a0a0a0",
				borderRadius: "3px",
				padding: "2px 5px",
				margin: "2px",
				backgroundColor: "white",
				color: "black",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			{k}
		</span>
	);
}
