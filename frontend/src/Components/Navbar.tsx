"use client";
import React, { useEffect, useState, useRef, FC, useContext } from "react";
import Link from "next/link";
import NavbarContext from "@/contexts/NavbarContext";
import Sidebar from "./Sidebar";
import jwt from "jsonwebtoken";
import { useRouter, usePathname } from "next/navigation";
import { IoSettingsOutline } from "react-icons/io5";
import { LuLogOut } from "react-icons/lu";
import { GiPingPongBat } from "react-icons/gi";
import UserContext from "@/contexts/UserContext";
import { IoSearch } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { searchForUser } from "@/api/Search";
import { ChangeEvent } from "react";
import { Flip, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAPI, getAPI2, postAPI } from "@/api/APIServices";
import FriendRequestNotification from "./FriendRequestNotification";
import axios from "axios";
import FriendRequestPopup from "./FriendRequests";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

const ProfilePopup: FC<any> = ({ setDisplayProfilePopup }) => {
	const profilePopupRef = useRef<HTMLDivElement | null>(null);
	const { user, setUser } = useContext(UserContext);
	const router = useRouter();

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			const displayer = document.getElementsByClassName("popupdisplayer");
			const clickedElement = event.target as Node;

			if (
				event.target !== displayer[0] &&
				event.target !== displayer[1] &&
				profilePopupRef.current &&
				!profilePopupRef.current.contains(clickedElement)
			) {
				setDisplayProfilePopup(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleLogout = async () => {
		localStorage.clear();
		const res = await getAPI2("/logout");
		router.push("/login");
	};
	return (
		<div
			ref={profilePopupRef}
			className="absolute z-20 right-0 top-[90%] w-64 bg-white border shadow rounded"
		>
			<div className="p-4 flex items-center gap-4">
				<div className="w-12 h-12 bg-black rounded-full overflow-hidden">
					<img
						className="w-full h-full object-cover"
						src={`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/apiback/images/` + user?.avatar}
						alt=""
					/>
				</div>
				<div className="flex flex-col max-w-[70%]">
					<span className="truncate font-semibold">
						{user?.username}
					</span>
					<span className="text-gray-400 truncate text-xs">
						{user?.email}
					</span>
				</div>
			</div>
			<div className="w-full h-[1px] bg-gray-100"></div>
			<div className="cursor-pointer p-4 flex items-center gap-4 text-gray-600 hover:bg-mygray">
				<GiPingPongBat className="w-6 h-6" />
				<div className="flex flex-col"
					onClick={() => {
						router.push("/play");
						setDisplayProfilePopup(false);
					}}
				>
					<span className="truncate font-semibold">Play now</span>
				</div>
			</div>
			<div className="w-full h-[1px] bg-gray-100"></div>
			<Link
				href={`/settings`}
				className="cursor-pointer p-4 flex items-center gap-4 text-gray-600 hover:bg-mygray"
			>
				<IoSettingsOutline className="w-6 h-6" />
				<div className="flex flex-col">
					<span className="truncate font-semibold">Settings</span>
					<span className="text-gray-400 truncate text-xs">
						Edit Profile
					</span>
				</div>
			</Link>
			<div className="w-full h-[1px] bg-gray-100"></div>
			<div
				onClick={handleLogout}
				className="cursor-pointer p-4 flex items-center gap-4 text-myred hover:bg-mygray hover:text-myred-h"
			>
				<LuLogOut className="w-6 h-6" />
				<div className="flex flex-col">
					<span className="truncate font-semibold">Logout</span>
				</div>
			</div>
		</div>
	);
};

const SearchComponent = () => {
	const [search, setSearch] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const { data, isLoading, error } = useQuery({
		queryKey: [searchValue],
		queryFn: () => searchForUser(searchValue),
	});

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target) setSearchValue(e.target.value);
	};

	const ResultComponent = () => {
		if (isLoading)
			return (
				<div className="fixed sm:absolute top-20 sm:top-full right-0 w-full sm:w-96 border rounded bg-white shadow">
					<div
						role="status"
						className=" flex justify-center items-center"
					>
						<svg
							aria-hidden="true"
							className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-red-600"
							viewBox="0 0 100 101"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
								fill="currentColor"
							/>
							<path
								d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
								fill="currentFill"
							/>
						</svg>
						<span className="sr-only">Loading...</span>
					</div>
				</div>
			);
		if (error)
			return (
				<div className="fixed sm:absolute top-20 sm:top-full right-0 w-full sm:w-96 border rounded bg-white shadow">
					<div className="p-2">Ooops, error loading data!..</div>
				</div>
			);
		if (
			data?.data?.filter(
				(user: UserType) =>
					user.username !== localStorage.getItem("user_name")
			).length
		)
			return (
				<div className="fixed sm:absolute top-20 sm:top-full right-0 w-full sm:w-96 border rounded">
					{data?.data
						?.filter(
							(user: UserType) =>
								user.username !==
								localStorage.getItem("user_name")
						)
						.slice(0, 5)
						.map((user: UserType, index: number) => (
							<Link
								href={`/user/${user.username}`}
								key={index}
								className="w-full flex flex-col bg-white cursor-pointer hover:bg-red-100"
							>
								<div className="flex items-center gap-2 p-2">
									<div className="w-10 h-10 rounded-full bg-black overflow-hidden">
										<img
											className="w-full h-full object-cover"
											src={
												`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/apiback/images/` +
												(user?.avatar !== ""
													? user.avatar
													: "default.png")
											}
											alt=""
										/>
									</div>
									<div className="flex flex-col justify-center">
										<span>{user.username}</span>
										<span className="text-gray-400 text-xs">
											{user.email}
										</span>
									</div>
								</div>
							</Link>
						))}
				</div>
			);
		else if (searchValue.length && data?.data?.length === 0)
			return (
				<div className="fixed sm:absolute top-20 sm:top-full right-0 w-full sm:w-96 border rounded bg-white shadow">
					<div className="p-2">User does not exist!</div>
				</div>
			);
	};

	if (!search)
		return (
			<li onClick={() => setSearch(true)} className="">
				<IoSearch className="w-6 h-6 cursor-pointer hover:text-myred" />
			</li>
		);
	return (
		<div className="sm:relative">
			<li className="relative">
				<input
					value={searchValue}
					onChange={handleInputChange}
					className="border w-48 sm:w-64 p-2 focus:outline-none focus:border-myred rounded text-sm font-light pr-8"
					type="text"
					placeholder="Search with username"
				/>
				<MdClose
					onClick={() => setSearch(false)}
					className="w-5 h-5 absolute right-0 top-1/2 -mt-2.5 mr-2.5 text-gray-400 cursor-pointer"
				/>
			</li>
			<ResultComponent />
		</div>
	);
};

const InvitePopup = (sender: string, receiver: string) => {
	const acceptInvite = async () => {
		const response = await postAPI("notifications/accept_game_invite/", {
			sender: sender,
			receiver: receiver,
		}).then((res: any) => {
			if (res.status === 200) {
				
			} else {
				toast.error("Error accepting invite");
			}
		});
		return response;
	};
	return (
		<div className="w-auto flex text-pretty whitespace-nowrap">
			<p className="text-bold px-2 ">
				<span className="font-bold text-myred">{sender}</span> has
				invited you to a game
			</p>
			<button
				onClick={() => acceptInvite()}
				className="bg-myred text-white rounded-sm "
			>
				Accept
			</button>
		</div>
	);
};

const GamePopup = (game_id: string, sender: string, receiver: string) => {
	return (
		<div className="w-full flex items-center content-center">
			<p className="text-bold px-2 ">Your game is Ready</p>
			<Link href={`/play/online?id=${game_id}`}>
				<p className="bg-myred text-white  rounded-sm m-1">
					Go to Game
				</p>
			</Link>
		</div>
	);
};

const NotificationComponent = () => {
	const router = useRouter();
	useEffect(() => {
		const accessToken = localStorage.getItem("user_token");
		const ws = new WebSocket(
			`${process.env.NEXT_PUBLIC_SOCKET_ENDPOINT}notifications/?token=${accessToken}`
		);
		ws.onopen = () => {
		};
		ws.onmessage = (e) => {
			const data = JSON.parse(e.data);
			if (data.type === "game_invite") {
				toast(InvitePopup(data.sender, data.receiver), {
					theme: "dark",
					pauseOnHover: false,
					pauseOnFocusLoss: false,
					closeOnClick: true,
					draggable: true,
					transition: Flip,
				});
			}
			if (data.type === "game_accepted") {
				toast(GamePopup(data.id, data.sender, data.receiver), {
					theme: "colored",
					pauseOnHover: true,
					closeOnClick: true,
					pauseOnFocusLoss: true,
					draggable: true,
					transition: Flip,
					autoClose: false,
				});
			}
			if (data.type === "message") {
				if (!toast.isActive("messageToast")) {
					toast.info(data.message, {
						toastId: "messageToast",
						pauseOnHover: true,
						closeOnClick: true,
						pauseOnFocusLoss: true,
					});
				}
			}
			if (data.type === "block") {
				toast.error(data.message, {
					pauseOnHover: true,
					closeOnClick: true,
					pauseOnFocusLoss: true,
				});
			}
		};
		return () => {
			ws.close();
		};
	}, []);
	return <></>;
};

const Navbar = () => {
	const [displayProfilePopup, setDisplayProfilePopup] = useState(false);
	const { user, setUser } = useContext(UserContext);
	const [friend_requestPopup, setFriendRequestPopup] = useState(false);
	return (
		<>
			<NotificationComponent />

			<div className="w-full h-20 sticky top-0 border-b bg-white z-20">
				<div className="container mx-auto px-4 h-full">
					<div className="flex relative justify-between items-center h-full text-black">
						<Link
							className="text-lg font-bold cursor-pointer text-myred hover:text-myred-h"
							href="/"
						>
							Pong3D
						</Link>
						<ul className="flex items-center gap-x-6 text-sm font-medium">
							<SearchComponent />
							<li className="hidden md:block">
								<Link href="/profile">
									<p>Profile</p>
								</Link>
							</li>
							<li className="hidden md:block">
								<Link href="/chat">
									<p>Chat</p>
								</Link>
							</li>
							<li>
							<div className="w-10 h-10 rounded-full  cursor-pointer overflow-hidden flex items-center justify-center">
                				<FontAwesomeIcon
                    				icon={faUserPlus}
                    			className=" w-5 h-5"
                    			onClick={() => setFriendRequestPopup(true)}
                					/>
            					</div>
								
							</li>
							<li className="hidden md:block">
								<div className="bg-myred hover:bg-myred-h w-full h-10 px-4 rounded text-white">
									<Link
										href="/play"
										className="w-full h-full flex items-center justify-center"
									>
										<p>Play </p>
									</Link>
								</div>
							</li>
							<li>
								<div
									onClick={() => {
										setDisplayProfilePopup(
											!displayProfilePopup
										);
									}}
									className="popupdisplayer w-10 h-10 rounded-full bg-black cursor-pointer overflow-hidden"
								>
									<img
										className="w-full h-full object-cover popupdisplayer"
										src={
											`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/apiback/images/` +
											user?.avatar
										}
										alt=""
									/>
								</div>
							</li>
						</ul>
						{friend_requestPopup && (
							<FriendRequestPopup
								setDisplayFriendRequestPopup = {setFriendRequestPopup}
							/>
						)}
						{displayProfilePopup && (
							<ProfilePopup
								setDisplayProfilePopup={setDisplayProfilePopup}
							/>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default Navbar;
