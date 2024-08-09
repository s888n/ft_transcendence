"use client";
import {
	Environment,
	OrbitControls,
	ContactShadows,
	Float,
} from "@react-three/drei";

import { Canvas } from "@react-three/fiber";
import Arcade from "@/Components/Arcade";
import Greeting from "@/Components/Greeting";
import { Suspense, use, useContext } from "react";
import UserContext from "@/contexts/UserContext";
import Navbar from "@/Components/Navbar";
import { getAPI } from "@/api/APIServices";
import { useEffect, useState } from "react";
import { getFriends } from "@/api/chat";
import Link from "next/link";
import { getProfileData } from "@/api/profile";

export default function Page() {
	const { user } = useContext(UserContext);
	return (
		<>
			<Navbar />
			<div className="absolute w-full h-[calc(100%-80px)] grid grid-cols-1 gap-4 md:grid-cols-3 p-4">
				<Scene name={user?.username || ""} />
				<SidePanel />
			</div>
		</>
	);
}
function Loader() {
	return (
		<div className="flex justify-center items-center h-full w-full">
			<div className="relative inline-flex">
				<div className="w-8 h-8 bg-myred rounded-full"></div>
				<div className="w-8 h-8 bg-myred rounded-full absolute top-0 left-0 animate-ping"></div>
				<div className="w-8 h-8 bg-myred rounded-full absolute top-0 left-0 animate-pulse"></div>
			</div>
		</div>
	);
}
function Scene({ name }: { name: string }) {
	return (
		<div className="col-span-2 rounded-lg">
			<Suspense fallback={<Loader />}>
				<Canvas shadows camera={{ position: [4, 2.5, 15], fov: 35 }}>
					<Float>
						<Greeting name={name} />
						<Arcade />
					</Float>
					<ContactShadows
						frames={1}
						position={[0, -3, 0]}
						opacity={0.5}
						blur={1}
					/>
					<OrbitControls />
					<Environment preset="sunset" />
				</Canvas>
			</Suspense>
		</div>
	);
}


function SidePanel() {
	return (
		<div className="rounded-lg grid grid-rows-2 gap-4">
			<Friends />
			<Matches />
		</div>
	);
}

type FriendType = {
	id: number;
	username: string;
	avatar: string;
	is_online: boolean;
};
function Friends() {
	const [friends, setFriends] = useState<FriendType[]>([]);
	const fetchFriends = async () => {
		try {
			const res = await getFriends();
			if (res.status !== 200) {
				throw new Error("Failed to fetch data");
			}
			setFriends(res.data.friends);
		} catch (error) {
			console.error("Error fetching friends:", error);
		}
	};
	useEffect(() => {
		fetchFriends();
	}, []);
	return (
		<div className="w-full h-full rounded-lg flow-root">
			<div className="w-full h-full bg-white rounded-lg border shadow-md sm:p-8 ">
				<h2 className="text-2xl font-bold text-center text-black p-4 sm:text-3xl">Friends</h2>
				<ul role="list" className="divide-y divide-gray-200  ">
					{friends.length === 0 && (
						<li className="py-6 px-4 text-center">You have no friends yet</li>
					)}
					{friends.map((friend, index) => (
						<li key={index} className="py-3 sm:py-4">
							<div className="flex items-center space-x-4">
								<div className="flex-shrink-0">
									<img
										className="w-12 h-12 rounded-full"
										src={`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/apiback/images/${friend.avatar}`}
										alt={`${friend.username}'s avatar`}
									/>
								</div>
								{/* online status indicator here */}
								<div className="flex-1 min-w-0">
									{friend.is_online ? (
										<div className="flex items-center">
											<div className="w-3 h-3 bg-green-500 rounded-full"></div>
											<p className="text-xs text-green-500 ml-1">Online</p>
										</div>
									) : (
										<div className="flex items-center">
											<div className="w-3 h-3 bg-gray-500 rounded-full"></div>
											<p className="text-xs text-gray-500 ml-1">Offline</p>
										</div>
									)}
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-md text-left font-medium  truncate ">
										{friend.username}
									</p>
								</div>
								<div className="flex-shrink-0">
									<Link href={`/user/${friend.username}`}
										type="button"
										className="inline-flex items-center justify-center w-8 h-8 text-gray-400 rounded-full hover:text-gray-500"
									>
										View Profile
									</Link>
								</div>
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

function Matches() {
	const [matches, setMatches] = useState<{
		player1: string;
		player2: string;
		score1: number;
		score2: number;
		winner: string;
		mode: string;
	}[]>([]);
	const fetchMatches = async () => {
		try {
			const res: any = await getAPI("game/all_matches");
			if (res.status !== 200) {
				throw new Error("Failed to fetch data");
			}
			setMatches(res.data);
		} catch (error) {
			console.error("Error fetching matches:", error);
		}
	}
	useEffect(() => {
		fetchMatches();
	}, []);
	return (
		<div className="w-full h-full rounded-lg  flow-root">
			<div className=" w-full h-full bg-white rounded-lg border shadow-md sm:p-8  ">
				<h2 className="text-2xl font-bold text-center text-black p-4 sm:text-3xl">Previous Matches</h2>
				<div className="w-full bg-white rounded-xl py-4 font-bold">
					<table className="table w-full h-full">
						<thead>
							<tr className="bg-blue-gray-100 text-gray-700 text-center">
								<th className="py-3 px-4 ">Player 1</th>
								<th className="py-3 px-4 ">Player 2</th>
								<th className="py-3 px-4 ">Score</th>
								<th className="py-3 px-4 ">mode</th>
							</tr>
						</thead>
						<tbody className="text-blue-gray-900">
							{matches.length === 0 && (
								<tr>
									<td colSpan={4} className="text-center py-6 px-4 font-normal">You have no finished matches yet</td>
								</tr>
							)}
							{matches.map((match, index) => (
								<tr className="border-b border-blue-gray-200 text-center " key={index}>
									<td className={`py-3 px-4 ${match.player1 === match.winner ? "text-green-500" : "text-red-500"}`}>{match.player1}</td>
									<td className={`py-3 px-4 ${match.player2 === match.winner ? "text-green-500" : "text-red-500"}`}>{match.player2}</td>
									<td className="py-3 px-4 ">{match.score1} - {match.score2}</td>
									<td className="py-3 px-4">{match.mode}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}