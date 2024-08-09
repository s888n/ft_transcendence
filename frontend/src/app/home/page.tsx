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
    console.log("put data", putData);
    const res = await updateProfile(putData);
    if (res.status === 202) {
      console.log("res.data", res.data)
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
      console.log("errrrrrrr88888", res);
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
    console.log(old_password, new_password);
    const putData = {
      old_password: old_password,
      new_password: new_password,
    };
    const res = await updatePassword(putData);
    console.log("rssss", res)
    if (res.status === 202) {
      toast.success("Updated successfully");
      console.log("sucxxxx", res);
    } else if (res.status === 400) {
      if (res?.data?.new_password) {
        toast.error(res?.data?.new_password[0]);
        console.log("errrrrrrr88888", res?.data?.new_password[0]);
      }
      else if (res?.data?.old_password) {
        toast.error(res?.data?.old_password[0]);
        console.log("errrrrrrr88888", res?.data?.old_password[0]);
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
      console.log("token", res)

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
  const [loading, setLoading] = useState(true);
  const [displayModal, setDisplayModal] = useState(false);
  console.log("rendred home page");

  const fetchProfile = async () => {
    const res = await getProfileData();
    if (res.status === 200) {
      setUser(res.data);
      if (res.data.nickname === '') {
        setDisplayModal(true);
      }
    }
    console.log("PROFILEDATA", res);
    setLoading(false);
  };
  useEffect(() => {
    fetchProfile();
  }, []);
  useEffect(() => {
    localStorage.setItem("user_name", user?.username ? user.username : "");
    localStorage.setItem("user_email", user?.email ? user.email : "");
    localStorage.setItem("user_avatar", user?.avatar ? user.avatar : "");
    localStorage.setItem("user_nickname", user?.nickname ? user.nickname : "");
    localStorage.setItem('user_id', user?.id ? user.id.toString() : '');
  }, [user]);


  return (
    <div className="text-center py-16 px-4 md:px-0 text-black flex flex-col items-center gap-6 max-w-[800px] mx-auto">
      {
        loading ?
          <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center">
            <div role="status">
              <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-red-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div> :
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
      }
    </div>
  );
}
