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
// import { UserType } from "@/types";
export default function Page() {
	const { user } = useContext(UserContext);
	return (
		<>
			<Navbar />
			<div className="absolute w-full h-[calc(100%-80px)] grid grid-cols-1 gap-4 md:grid-cols-3 p-4 z-0">
				<Scene name={user?.username || ""} />
				<SidePanel user={user} />
			</div>
		</>
	);
}
{
	/* <Suspense fallback={<Loading />}> */
}
{
	/* </Suspense> */
}

function Scene({ name }: { name: string }) {
	return (
		<div className="col-span-2 bg-red-300 rounded-lg">
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
			<Friends user={user} />
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

function Friends({ user }: { user: UserType }) {
	const [Friends, setFriends] = useState<FriendType[]>([]);
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
		<div className="w-full h-full rounded-lg border-2">
		<h2 className="text-2xl font-bold text-center text-black-800 py-6
		sm:text-3xl">Friends</h2>
		<ul className="flex flex-col">
			{Friends.map((friend, index) => (
				<li
				key={index}
				className={`flex items-center justify-between gap-4 rounded-lg p-2 hover:bg-gray-300 transition duration-300 ease-in-out`}
				>
					<div className="flex items-center ">
						<div className="relative inline-block rounded-full n h-9 w-9 md:h-11 md:w-11">
							<img
								src={"default.png"}
								className="object-cover rounded-full"
								alt={friend.username}
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
								/>
							<div
								className={`absolute bottom-0 right-0 w-3 h-3 rounded-full `}
								></div>
						</div>
						<div className="whitespace-nowrap overflow-hidden overflow-ellipsis px-3 text-center">
							<p className="font-semibold">{friend.username}</p>
						</div>
					</div>
					<FriendPopup friend={friend} user={user} />
				</li>
			))}
		</ul>
		</div>
	);
}

function Matches() {
	const [matches, setMatches] = useState  <{
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
			setMatches(res.data.matches);
		} catch (error) {
			console.error("Error fetching matches:", error);
		}
	}
	useEffect(() => {
		fetchMatches();
	}, []);
	return (
		<div className="w-full h-full rounded-lg border-2">
		</div>
	);
}

// function Friends({ friends }: { friends: { name: string; avatar: string }[] }) {
// 	return (
// 		<div className="w-full h-full rounded-lg bg-violet-600 flow-root">
// 			<div className="p-4 w-full h-full bg-white rounded-lg border shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700">
// 				<h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white
// 				sm:text-3xl">Friends</h2>
// 				<ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
// 					{friends.map((friend, index) => (
// 						<li key={index} className="py-3 sm:py-4">
// 							<div className="flex items-center space-x-4">
// 								<div className="flex-shrink-0">
// 									<img
// 										className="w-12 h-12 rounded-full"
// 										src={`${friend.avatar}`}
// 										alt={`${friend.name}'s avatar`}
// 									/>
// 								</div>
// 								<div className="flex-1 min-w-0">
//             	            	<p className="text-md text-center font-medium text-gray-900 truncate dark:text-white">
//             	                	{friend.name}
//             	            	</p>
//             	        		</div>
// 							</div>
// 						</li>
// 					))}
// 				</ul>
// 			</div>
// 		</div>
// 	);
// }