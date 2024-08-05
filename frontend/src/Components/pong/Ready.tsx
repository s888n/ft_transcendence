import React, { useEffect, useState } from "react";

export default function Ready({ rules }: Readonly<{ rules: string[] }>) {
	return (
		<div className="absolute inset-0 flex flx-col  p-4 rounded-lg z-10 font-bold">
			<div className="flex flex-col items-center justify-center w-full h-full p-4 bg-black bg-opacity-50 rounded-lg">
				<h3 className="text-4xl text-center text-myred p-4">Rules:</h3>
				<ol className="list-decimal list-inside text-white   flex flex-col  space-y-2">
					{rules.map((rule) => (
						<li
							key={rule}
							className="flex flex-row justify-between w-full"
						>
							<span>{rule}</span>
						</li>
					))}
				</ol>
			</div>
		</div>
	);
}
