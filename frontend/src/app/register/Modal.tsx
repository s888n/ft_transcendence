"use client";

import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { updateProfile } from "@/api/profile";
import { useRouter } from "next/navigation";

interface ModalProps {
  setDisplayModal: any;
}

export const Modal: React.FC<ModalProps> = ({ setDisplayModal }) => {
  const router = useRouter();
  const [nicknameUsed, setNicknameUsed] = useState(false);
  useEffect(() => {
    toast.warning("its important to set the nickname for tournaments");
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const nickname = form.get("nickname") as string;
    if (nickname.trim() == "") return;
    const putData = { nickname: nickname };
    const res = await updateProfile(putData);
    if (res.status === 202) {
      toast.success("Nickname updated succefully");
      setDisplayModal(false);
      router.push("/home");
    } else {
      setNicknameUsed(true);
      toast.error("Nickname already used");
    }
  };
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="p-8 border w-96 shadow-lg rounded-md bg-white">
        <div className="">
          <h3 className="font-bold text-center text-black">
            Its important to set your nickname for tournaments
          </h3>
          <form
            onSubmit={handleSubmit}
            className="mt-2 p-3 flex flex-col gap-4"
          >
            <label className="text-left">
              {nicknameUsed && (
                <span className="text-xs text-red-500">
                  This nickname already used
                </span>
              )}
              <input
                placeholder="Nickname"
                name="nickname"
                required
                className="input"
                onChange={() => setNicknameUsed(false)}
                type="text"
              />
            </label>
            <button className="bg-myred hover:bg-myred-h w-full py-2 rounded text-white">
              save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Modal;
