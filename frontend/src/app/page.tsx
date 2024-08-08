"use client";
import {
	Environment,
	OrbitControls,
	ContactShadows,
	Float,
	Center,
} from "@react-three/drei";
import FriendPopup from "./chat/components/FriendPopup";
import { Canvas } from "@react-three/fiber";
import Arcade from "@/Components/Arcade";
import Greeting from "@/Components/Greeting";
import { Suspense, use, useContext } from "react";
import UserContext from "@/contexts/UserContext";
import Navbar from "@/Components/Navbar";
import Loading from "@/Components/pong/Loading";
import { getAPI } from "@/api/APIServices";
import { useEffect, useState } from "react";
import { getFriends } from "@/api/chat";
import Link from "next/link";

const friends = [
	{ name: "Alice", avatar: "https://i.pravatar.cc/150?img=1" },
	{ name: "Bob", avatar: "https://i.pravatar.cc/150?img=2" },
	{ name: "Charlie", avatar: "https://i.pravatar.cc/150?img=3" },
	{ name: "David", avatar: "https://i.pravatar.cc/150?img=4" },
	{ name: "Eve", avatar: "https://i.pravatar.cc/150?img=5" },


];
const matches = [
	{
		player1: "Alice",
		player2: "Bob",
		score1: 5,
		score2: 3,
		winner: "Alice",
		mode: "online",
	},
	{
		player1: "Charlie",
		player2: "David",
		score1: 2,
		score2: 3,
		winner: "David",
		mode: "pvp",
	},
	{
		player1: "Eve",
		player2: "Bender",
		score1: 1,
		score2: 5,
		winner: "Bender",
		mode: "practice",
	},
	{
		player1: "Salah",
		player2: "Max",
		score1: 1,
		score2: 5,
		winner: "Max",
		mode: "tournament",
	}
];


export default function Page() {
	const { user } = useContext(UserContext);
	return (
		<>
			<Navbar />
			<div className="absolute w-full h-[calc(100%-80px)] grid grid-cols-1 gap-4 md:grid-cols-3 p-4 z-0">
				<Scene name={user?.username || ""} />
				<SidePanel user={user ?? {} as UserType} />
			</div>
		</>
	);
}

function Scene({ name }: { name: string }) {
	return (
		<div className="col-span-2 rounded-lg">
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
		</div>
	);
}


function SidePanel({ user }: { user: UserType }) {
	return (
		<div className="rounded-lg grid grid-rows-2 gap-4">
			<Friends friends={friends} />
			<Matches matches={matches} />
		</div>
	);
}

{/* <Friends user={user} /> */}
{/* <Matches /> */}
type FriendType = {
	id: number;
	username: string;
	avatar: string;
	is_online: boolean;
};

// function Friends({ user }: { user: UserType }) {
// 	const [Friends, setFriends] = useState<FriendType[]>([]);
// 	const fetchFriends = async () => {
// 		try {
// 			const res = await getFriends();
// 			if (res.status !== 200) {
// 				throw new Error("Failed to fetch data");
// 			}
// 			setFriends(res.data.friends);
// 		} catch (error) {
// 			console.error("Error fetching friends:", error);
// 		}
// 	};
// 	useEffect(() => {
// 		// fetchFriends();
// 		setFriends(friends);
// 	}, []);
	
// 	return (
// 		<div className="w-full h-full rounded-lg border-2">
// 		<h2 className="text-2xl font-bold text-center text-black-800 py-6
// 		sm:text-3xl">Friends</h2>
// 		<ul className="flex flex-col">
// 			{Friends.map((friend, index) => (
// 				<li
// 				key={index}
// 				className={`flex items-center justify-between gap-4 rounded-lg p-2 hover:bg-gray-300 transition duration-300 ease-in-out`}
// 				>
// 					<div className="flex items-center ">
// 						<div className="relative inline-block rounded-full n h-9 w-9 md:h-11 md:w-11">
// 							<img
// 								src={"default.png"}
// 								className="object-cover rounded-full"
// 								alt={friend.username}
// 								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
// 								/>
// 							<div
// 								className={`absolute bottom-0 right-0 w-3 h-3 rounded-full `}
// 								></div>
// 						</div>
// 						<div className="whitespace-nowrap overflow-hidden overflow-ellipsis px-3 text-center">
// 							<p className="font-semibold">{friend.username}</p>
// 						</div>
// 					</div>
// 					<FriendPopup friend={friend} user={user} />
// 				</li>
// 			))}
// 		</ul>
// 		</div>
// 	);
// }

// function Matches() {
// 	const [matches, setMatches] = useState  <{
// 		player1: string;
// 		player2: string;
// 		score1: number;
// 		score2: number;
// 		winner: string;
// 		mode: string;
// 	}[]>([]);
// 	const fetchMatches = async () => {
// 		try {
// 			const res: any = await getAPI("game/all_matches");
// 			if (res.status !== 200) {
// 				throw new Error("Failed to fetch data");
// 			}
// 			setMatches(res.data.matches);
// 		} catch (error) {
// 			console.error("Error fetching matches:", error);
// 		}
// 	}
// 	useEffect(() => {
// 		fetchMatches();
// 	}, []);
// 	return (
// 		<div className="w-full h-full rounded-lg border-2">
// 		</div>
// 	);
// }

function Friends({ friends }: { friends: { name: string; avatar: string }[] }) {
	return (
		<div className="w-full h-full rounded-lg bg-violet-600 flow-root">
			<div className="p-4 w-full h-full bg-white rounded-lg border shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700">
				<h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white
				sm:text-3xl">Friends</h2>
				<ul role="list" className="divide-y divide-gray-200  ">
					{friends.map((friend, index) => (
						<li key={index} className="py-3 sm:py-4">
							<div className="flex items-center space-x-4">
								<div className="flex-shrink-0">
									<img
										className="w-10 h-10 rounded-full"
										src={`${friend.avatar}`}
										alt={`${friend.name}'s avatar`}
									/>
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-md text-center font-medium text-gray-900 truncate dark:text-white">
										{friend.name}
									</p>
								</div>
								<div className="flex-shrink-0">
									<Link href="/profile"
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


//  each li should look like "player1 score1 - score2 player2 mode"  with the winner in green and the loser in red
function Matches({ matches }: { matches: { player1: string; player2: string; score1: number; score2: number; winner: string; mode: string }[] }) {
	return (
		<div className="w-full h-full rounded-lg  flow-root">
			<div className=" w-full h-full bg-white rounded-lg  shadow-md ">
				<h2 className="text-2xl font-bold text-center text-black p-4
				sm:text-3xl">Previous Matches</h2>
				<div className="w-full bg-white rounded-xl py-4 font-bold">
					<table className="table w-full h-full">
						<thead>
							<tr className="bg-blue-gray-100 text-gray-700 text-center">
								<th className="py-3 px-4 ">Player 1</th>
								<th className="py-3 px-4 ">Score</th>
								<th className="py-3 px-4 ">Player 2</th>
								<th className="py-3 px-4 ">mode</th>
							</tr>
						</thead>
						<tbody className="text-blue-gray-900">
							{matches.map((match, index) => (
								<tr className="border-b border-blue-gray-200 text-center">
								<td className={`py-3 px-4 ${match.player1 === match.winner ? "text-green-500" : "text-red-500"}`}>{match.player1}</td>
								<td className={`py-3 px-4 ${match.player2 === match.winner ? "text-green-500" : "text-red-500"}`}>{match.player2}</td>
								<td className="py-3 px-4 ">{match.score1} - { match.score2}</td>
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