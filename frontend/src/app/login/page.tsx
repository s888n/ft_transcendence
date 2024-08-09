"use client";

import { useContext, useEffect, useState } from "react";
import { IoEye } from "react-icons/io5";
import { FormEvent } from "react";
import { login } from "@/api/login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jwt from "jsonwebtoken";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UserContext from "@/contexts/UserContext";
import logo from "../../assets/pingpongpic.png";
import axios from "axios";

export default function Page() {
	const [displayPassword, setDisplayPassword] = useState(false);
	const [logError, setLogError] = useState(false);
	const { setUser } = useContext(UserContext);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		// if (localStorage.getItem("user_token")) router.push("/home");
		// else
		// (async () => {
		//   const cookiesss = await axios("http://127.0.0.1:3000/api/test_token", {
		//     method: "GET",
		//     withCredentials: true
		//   })
		//   // const test = await axios("http:///127.0.0.1:3000/test_token", {
		//   //   method: "GET",
		//   //   withCredentials: true
		//   // })
		//   console.log("COOOCIESSS", cookiesss)
		// })()

		setLoading(false);
	}, []);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		const postData = { email: email, password: password };
		console.log("postData", postData);
		const res = await login(postData);
		if (res.status === 200) {
			const accessToken = res.data.access;
			const refreshToken = res.data.refresh;
			const decodedToken: any = jwt.decode(accessToken);
			localStorage.setItem("user_token", accessToken);
			localStorage.setItem("token_expiration", decodedToken.exp);
			// localStorage.setItem("refresh_token", refreshToken);
			console.log(
				"acessss",
				decodedToken,
				decodedToken?.user,
				typeof decodedToken
			);
			console.log("uressss", decodedToken.user);
			setUser(decodedToken.user);

			router.push("/");
		} else {
			console.log("toassssst");
			setLogError(true);
			toast.error("Invalid credentials");
		}
	};

	const onIntraLogin = () => {
		const intraAuthUrl =
			"https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-9267b3fde4ad5d8140083b81f05e9fc74057eee1d70a67f1c0cd53be79342610&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Flogin%2Fauth42&response_type=code";

		router.push(`${intraAuthUrl}`);
	};

	return (
		<div className="w-screen min-h-screen flex items-center overflow-x-hidden">
			<div className="w-full h-full sm:h-fit sm:py-6 sm:w-full flex justify-center items-center sm:min-h-[100%]">
				{loading ? (
					<div role="status">
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
				) : (
					<div className="w-full sm:w-[480px] p-4 flex flex-col items-center">
						<div className="w-full h-[480px]">
							<div
								className="w-full h-full rounded-md bg-green-100 bg-cover text-center relative"
								style={{
									backgroundImage: `url(${logo.src})`,
									backgroundPosition: "center",
								}}
							>
								<div className="absolute inset-0 rounded-md bg-black opacity-10"></div>
								<div className="p-4 flex items-center justify-center gap-2 flex-col text-white absolute inset-0">
									<h1 className="text-5xl font-bold bg-transparent">
										Welcome to
										<span className="text-center text-myred">
											{" "}Pong3D
										</span>
									</h1>
									<p>
										The best way to play pong online with
										friends
									</p>
									<Link
										href="/register"
										className="px-3 mt-8 py-2 bg-myred hover:bg-myred-h rounded"
									>
										Sign up
									</Link>
								</div>
							</div>
						</div>
						<form
							onSubmit={handleSubmit}
							className="flex flex-col gap-4 w-full"
						>
							<button
								onClick={onIntraLogin}
								type="button"
								className="mt-6 text-sm py-2 font-semibold bg-mygray hover:bg-mygray-h flex justify-center items-center gap-2 text-black w-full rounded"
							>
								<img
									className="w-4 h-4"
									src="https://42.fr/wp-content/uploads/2021/05/42-Final-sigle-seul.svg"
									alt=""
									style={{ filter: "invert(100%)" }}
								/>
								Login with intra
							</button>
							<div className="text-center text-sm">OR</div>
							<label>
								<input
									required
									onFocus={() => setLogError(false)}
									name="email"
									placeholder="Email"
									className={
										"input " +
										(logError && "border border-red-500")
									}
									type="email"
								/>
							</label>
							<label>
								<div className="relative">
									<input
										required
										placeholder="Password"
										onFocus={() => setLogError(false)}
										name="password"
										className={
											"input pr-10 " +
											(logError &&
												"border border-red-500")
										}
										type={
											displayPassword
												? "text"
												: "password"
										}
									/>
									<IoEye
										onClick={() =>
											setDisplayPassword(!displayPassword)
										}
										className="absolute right-2.5 w-5 h-5 top-1/2 -mt-2.5 cursor-pointer"
									/>
								</div>
							</label>
							<button
								type="submit"
								className=" bg-myred hover:bg-myred-h w-full py-2 rounded text-white"
							>
								Login
							</button>
						</form>
					</div>
				)}
			</div>
		</div>
	);
}
