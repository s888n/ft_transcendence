"use client";

import { useContext, useEffect, useState } from "react";
import { IoEye } from "react-icons/io5";
import { FormEvent } from "react";
import { register } from "@/api/register";
import { ToastContainer, toast } from "react-toastify";
import jwt from "jsonwebtoken";
import Link from "next/link";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import logo from "../../assets/pong.png";
import UserContext from "@/contexts/UserContext";

export default function Page() {
  const [displayPassword, setDisplayPassword] = useState(false);
  const [displayConfirmPassword, setDisplayConfirmPassword] = useState(false);
  const [invalidData, setInvalidData] = useState({
    email: false,
    username: false,
  });
  const [displayNicknameModal, setDisplayNicknameModal] = useState(false);
  const router = useRouter();
  const {setUser} = useContext(UserContext)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    if (password !== confirmPassword) {
      toast.error("Passwords are not the same!");
      return;
    }
    if (password.trim() !== password){
      toast.error("Password can't start or end with spaces!!")
      return;
    }
    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const postData = { username: username, email: email, password: password };
    const res = await register(postData);
    if (res.status === 201) {
      const accessToken = res.data.access;
      const decodedToken: any = jwt.decode(accessToken);
      localStorage.setItem("user_token", accessToken);
      localStorage.setItem("token_expiration", decodedToken.exp);
      setUser(decodedToken.user)
      if (decodedToken?.user.nickname === "") setDisplayNicknameModal(true);
      router.push("/");

    } else {
      const newInvalidData = {
        email: res.data?.data?.email ? true : false,
        username: res.data?.data?.username ? true : false,
        password: res.data?.data?.password ? true : false
      };
      setInvalidData(newInvalidData);
      if (res.data.data.password){
        toast.error("Password must be atleast 8 characters")
      }else{
        toast.error("Invalid credentials");
      }
    }
  };

  const onIntraLogin = () => {
    const intraAuthUrl = process.env.NEXT_PUBLIC_INTRA_URL;

    router.push(`${intraAuthUrl}`);
  };
  return (
    <div className="w-screen min-h-screen flex items-center overflow-x-hidden">
      <div className="w-full h-full sm:h-fit sm:py-6 sm:w-full flex justify-center items-center sm:min-h-[100%]">
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
                <h1 className="text-5xl font-bold bg-transparent text-myred">
                  Pong3D
                </h1>
                <p className="font-bold">The best way to play ping pong online with friends</p>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
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
              Sign up with intra
            </button>
            <div className="text-center text-sm">OR</div>
            <label>
              <span className="text-sm">
                {invalidData.username && (
                  <span className="text-red-500 text-xs">Already exists</span>
                )}
              </span>
              <input
                onChange={() => {
                  setInvalidData((prev) => ({ ...prev, username: false }));
                }}
                placeholder="Username"
                required
                name="username"
                className="input"
                type="text"
              />
            </label>
            <label>
              <span className="text-sm">
                {invalidData.email && (
                  <span className="text-red-500 text-xs">Already exists</span>
                )}
              </span>
              <input
                onChange={() => {
                  setInvalidData((prev) => ({ ...prev, email: false }));
                }}
                placeholder="Email"
                required
                name="email"
                className="input"
                type="email"
              />
            </label>
            <label>
              <span className="text-sm"></span>
              <div className="relative">
                <input
                  required
                  placeholder="Password"
                  name="password"
                  className="input pr-10"
                  type={displayPassword ? "text" : "password"}
                />
                <IoEye
                  onClick={() => setDisplayPassword(!displayPassword)}
                  className="absolute w-5 h-5 right-2.5 top-1/2 -mt-2.5 cursor-pointer"
                />
              </div>
            </label>
            <label>
              <span className="text-sm"></span>
              <div className="relative">
                <input
                  required
                  placeholder="Confirm password"
                  name="confirmPassword"
                  className="input pr-10"
                  type={displayConfirmPassword ? "text" : "password"}
                />
                <IoEye
                  onClick={() =>
                    setDisplayConfirmPassword(!displayConfirmPassword)
                  }
                  className="absolute w-5 h-5 right-2.5 top-1/2 -mt-2.5 cursor-pointer"
                />
              </div>
            </label>
            <button
              type="submit"
              className="bg-myred hover:bg-myred-h w-full py-2 rounded text-white"
            >
              Sing up
            </button>
            <span className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-myred hover:text-myred-h">
                login
              </Link>
            </span>
          </form>
        </div>
      </div>
      {/* {displayNicknameModal && <Modal setDisplayModal={setDisplayNicknameModal} />} */}
    </div>
  );
}
