"use client";
import { useEffect, useContext, useState, FC, FormEvent } from "react";
import { useRouter } from "next/navigation";
import UserContext from "@/contexts/UserContext";
import jwt from "jsonwebtoken";
import { FaArrowRightLong } from "react-icons/fa6";
import { ChangeEvent } from "react";
import { IoEye } from "react-icons/io5";
import { getProfileData } from "@/api/profile";
import "react-toastify/dist/ReactToastify.css";
import { updateProfile, updatePassword } from "@/api/profile";
import { toast } from "react-toastify";
import { Dispatch, SetStateAction } from "react";
import axios from "axios";
import Modal from "@/app/register/Modal";
import { getAPI } from "@/api/APIServices";
// import { get } from "http";

interface PersonalInformationComponentProps {
  username: string;
  email: string;
}
interface TounamentInformationComponentProps {
  nickname: string;
}
interface AvatarComponentProps {
  username: string;
  email: string;
  avatar: string;
}

const TounamentInformationComponent: FC<TounamentInformationComponentProps> = ({
  nickname,
}) => {
  const [data, setData] = useState({ nickname: nickname });
  const [inputError, setInputError] = useState(false);
  const { user, setUser } = useContext(UserContext);


  const handleDataChanege = (e: ChangeEvent<HTMLInputElement>) => {
    setData({ nickname: e.currentTarget.value });
    setInputError(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const formNickname = form.get("nickname") as string;
    if (formNickname === nickname) {
      toast.warning("No changes to save!!");
      return;
    }
    const putData = {
      nickname: formNickname,
    };

    const res = await updateProfile(putData);
    if (res.status === 202) {
      toast.success("Updated successfully");
      setUser(res.data);
    } else {
      if (res?.data.nickname) {
        setInputError(true);
      }
      toast.error("Oops, failed to update nickname!!");
    }
  };



  return (
    <form
      onSubmit={handleSubmit}
      className="border w-full rounded p-6 text-start"
    >
      <h3 className="text-lg font-semibold">Tournament information</h3>
      <h6 className="text-sm text-gray-400">Updating Nickname</h6>
      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6 text-sm">
        <div className="w-full">
          <label className="">
            <p className="mb-1 font-medium">
              Nickname
              {inputError && (
                <span className="text-myred text-xs ml-2">Already used</span>
              )}
            </p>
            <input
              value={data.nickname}
              onChange={handleDataChanege}
              name="nickname"
              className="border rounded focus:outline-none p-2 w-full text-gray-500"
              type="text"
            />
          </label>
        </div>
      </div>
      <button className="bg-myred hover:bg-myred-h h-10 px-4 rounded text-white flex items-center gap-2 justify-center mt-4">
        <p>Save</p>
        <FaArrowRightLong />
      </button>
    </form>
  );
};

const PersonalInformationComponent: FC<PersonalInformationComponentProps> = ({
  username,
  email,
}) => {
  const [data, setData] = useState({ username: username, email: email });
  const { user, setUser } = useContext(UserContext);
  const [inputError, setInputError] = useState({
    email: false,
    username: false,
  });

  useEffect(() => {
    if (user)
      setData({ username: user?.username, email: user?.email })
  }, [user])

  const handleDataChanege = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "username")
      setInputError((prev) => ({ ...prev, username: false }));
    else if (name === "email")
      setInputError((prev) => ({ ...prev, email: false }));
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const formEmail = form.get("email") as string;
    const formUsername = form.get("username") as string;
    if (formEmail === email && formUsername === username) {
      toast.warning("No changes to save!!");
      return;
    }
    const putData: any = {};
    if (formEmail !== email) {
      putData.email = formEmail;
    }
    if (formUsername !== username) {
      putData.username = formUsername;
    }
    const res = await updateProfile(putData);
    if (res.status === 202) {
      setUser(res.data);
      toast.success("Updated successfully");
    } else {
      if (res?.data) {
        if (res.data.email && res.data.username) {
          setInputError({ email: true, username: true });
        } else if (res.data.email) {
          setInputError((prev) => ({ ...prev, email: true }));
        } else if (res.data.username) {
          setInputError((prev) => ({ ...prev, username: true }));
        }
      }
      toast.error("Update refused!..");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border w-full rounded p-6 text-start"
    >
      <h3 className="text-lg font-semibold">Personal information</h3>
      <h6 className="text-sm text-gray-400">Updating basic information</h6>
      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6 text-sm">
        <div className="w-full">
          <label className="">
            <p className="mb-1 font-medium">
              Email Adress
              {inputError.email && (
                <span className="text-myred text-xs ml-2">Already used</span>
              )}
            </p>
            <input
              value={data.email}
              onChange={handleDataChanege}
              name="email"
              className="border rounded focus:outline-none p-2 w-full text-gray-500"
              type="email"
            />
          </label>
        </div>
        <div className="w-full">
          <label className="">
            <p className="mb-1 font-medium">
              Username
              {inputError.username && (
                <span className="text-myred text-xs ml-2">Already used</span>
              )}
            </p>
            <input
              onChange={handleDataChanege}
              value={data.username}
              name="username"
              className="border rounded focus:outline-none p-2 w-full text-gray-500"
              type="text"
            />
          </label>
        </div>
      </div>
      <button className="bg-myred hover:bg-myred-h h-10 px-4 rounded text-white flex items-center gap-2 justify-center mt-4">
        <p>Save</p>
        <FaArrowRightLong />
      </button>
    </form>
  );
};

const AuthorizationComponent = () => {
  const [displayPassword, setDisplayPassword] = useState([false, false]);

  const togglePasswordVisibility = (index: number) => {
    const newArr = [...displayPassword];
    newArr[index] = !newArr[index];
    setDisplayPassword(newArr);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const old_password = form.get("old_password") as string;
    const new_password = form.get("new_password") as string;
    if (new_password.trim() !== new_password) {
      toast.error("Password can't start or end with spaces!!")
      return;
    }
    if (!old_password.length || !new_password.length) {
      toast.error("Both fields are required to update password!");
      return;
    }
    const putData = {
      old_password: old_password,
      new_password: new_password,
    };
    const res = await updatePassword(putData);
    if (res.status === 202) {
      toast.success("Updated successfully");
    } else if (res.status === 400) {
      if (res?.data?.new_password) {
        toast.error(res?.data?.new_password[0]);
      }
      else if (res?.data?.old_password) {
        toast.error(res?.data?.old_password[0]);
      }
      else toast.error("Error!!..")
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="border w-full rounded p-6 text-start"
    >
      <h3 className="text-lg font-semibold">Authorization</h3>
      <h6 className="text-sm text-gray-400">Update password</h6>
      <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6 text-sm">
        <div className="w-full">
          <label className="">
            <p className="mb-1 font-medium">Current Password *</p>
            <div className="relative">
              <IoEye
                onClick={() => togglePasswordVisibility(0)}
                className="absolute w-4 h-4 right-2 top-1/2 -mt-2 cursor-pointer"
              />
              <input
                name="old_password"
                className="border rounded focus:outline-none p-2 w-full text-gray-500"
                type={displayPassword[0] ? "text" : "password"}
              />
            </div>
          </label>
        </div>
        <div className="w-full">
          <label className="">
            <p className="mb-1 font-medium">New Password *</p>
            <div className="relative z-0">
              <IoEye
                onClick={() => togglePasswordVisibility(1)}
                className="absolute w-4 h-4 right-2 top-1/2 -mt-2 cursor-pointer"
              />
              <input
                name="new_password"
                className="border rounded focus:outline-none p-2 w-full text-gray-500"
                type={displayPassword[1] ? "text" : "password"}
              />
            </div>
          </label>
        </div>
      </div>
      <button className="bg-myred hover:bg-myred-h h-10 px-4 rounded text-white flex items-center gap-2 justify-center mt-4">
        <p>Save</p>
        <FaArrowRightLong />
      </button>
    </form>
  );
};

const AvatarComponent: FC<PersonalInformationComponentProps> = ({
  username,
  email,
}) => {
  const { user, setUser } = useContext(UserContext);

  const avatarChangeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const formData = new FormData();
      formData.append("file", e.target.files[0]); // Append file to FormData

      const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/get_token`)
      if (res.status !== 200) {
        toast.error("oops error!..")
      }

      try {
        // Send image to Next.js server
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/apiback/update_avatar`, {
          method: "PUT",
          headers: {
            'Authorization': `Bearer ${res.data?.token || ""}`,
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error('Failed to upload image to Next.js server');
        }

        const data = await response.json();

        // Assuming data.file_path contains the URL to the uploaded image in Django backend
        const newUser = { ...user, avatar: data.file_path };
        setUser(newUser as UserType);
        toast.success("Image updated successfully.");

      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Image update failed.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-20 h-20 bg-black rounded-full overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/apiback/images/` + user?.avatar}
          alt=""
        />
      </div>
      <div className="text-xl font-bold capitalize mt-4">{username}</div>
      <div className="text-gray-400 font-light">{email}</div>
      <label className="bg-mygray cursor-pointer hover:bg-mygray-h rounded font-bold px-4 py-2 mt-4 text-sm">
        <input onChange={avatarChangeHandler} className="hidden" type="file" accept="image/*" name="avatar" />
        Upload picture
      </label>
    </div>
  );
};

export default function Page() {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);
  const [displayModal, setDisplayModal] = useState(false);

  return (
    <div className="text-center py-16 px-4 md:px-0 text-black flex flex-col items-center gap-6 max-w-[800px] mx-auto">
      <>
        <h1 className="text-3xl font-bold md:self-start">Edit profile</h1>
        <AvatarComponent
          username={user?.username ? user.username : ""}
          email={user?.email ? user.email : ""}
        />
        {/* <TounamentInformationComponent
              nickname={user?.nickname ? user.nickname : ""}
            /> */}
        <PersonalInformationComponent
          username={user?.username ? user.username : ""}
          email={user?.email ? user.email : ""}
        />
        <AuthorizationComponent />
        {/* {displayModal && <Modal setDisplayModal={setDisplayModal} />} */}
      </>
    </div>
  );
}
