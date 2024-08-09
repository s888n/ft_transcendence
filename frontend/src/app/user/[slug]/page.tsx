"use client";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  getUserByUsername,
  sendRequest,
  cancelRequest,
  acceptRequest,
  unfriend,
  rejectRequest,
  block,
  deblock,
  getUserStats
} from "@/api/users";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import MatchOnProfile from "@/Components/MatchOnProfile";

export default function Page({ params }: { params: { slug: string } }) {
  const [searchedUser, setSearchedUser] = useState<undefined | UserType>(
    undefined
  );
  const router = useRouter();
  const { data } = useQuery({
    queryKey: ["userStats", params.slug],
    queryFn: () => getUserStats(params.slug)
  })
  const [stats, setStats] = useState({
    matches: 69,
    wins: 69,
    looses: 69,
  })

  useEffect(() => {
    if (data?.data) {
      const winsMatches = data?.data.filter((match: any) => {
        if (match.winner?.username === params.slug) return match
      })
      const actualStats = {
        matches: data?.data.length,
        wins: winsMatches.length,
        looses: data?.data.length - winsMatches.length,
      }
      setStats(actualStats)
    }
  }, [data])

  const fetchUser = async () => {
    if (params.slug) {
      const res = await getUserByUsername(params.slug);
      if (res.status === 200) {
        setSearchedUser(res.data);
      } else if (res.status === 404) {
        toast.error(`User ${params.slug} not found!`);
        router.push("/home");
      }
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const handleSendRequest = async () => {
    if (searchedUser) {
      const res = await sendRequest(searchedUser?.username);
      if (res.status === 201)
        setSearchedUser({ ...searchedUser, request_sent: true });
    }
  };

  const handleCancelRequest = async () => {
    if (searchedUser) {
      const res = await cancelRequest(searchedUser?.username);
      if (res.status === 201)
        setSearchedUser({ ...searchedUser, request_sent: false });
    }
  };

  const handleRejectRequest = async () => {
    if (searchedUser) {
      const res = await rejectRequest(searchedUser?.username);
      if (res.status === 201)
        setSearchedUser({ ...searchedUser, request_received: false });
    }
  };

  const handleAcceptRequest = async () => {
    if (searchedUser) {
      const res = await acceptRequest(searchedUser?.username);
      if (res.status === 201)
        setSearchedUser({
          ...searchedUser,
          is_friend: true,
          request_received: false,
        });
    }
  };

  const handleUnfriend = async () => {
    if (searchedUser) {
      const res = await unfriend(searchedUser?.username);
      if (res.status === 201)
        setSearchedUser({
          ...searchedUser,
          is_friend: false,
          request_received: false,
          request_sent: false,
        });
    }
  };

  const handleBlock = async () => {
    if (searchedUser) {
      const res = await block(searchedUser?.username);
      if (res.status === 201)
        setSearchedUser({
          ...searchedUser,
          is_friend: false,
          request_received: false,
          request_sent: false,
          blocked_by_you: true
        });
    }
  }

  const handleDeblock = async () => {
    if (searchedUser) {
      const res = await deblock(searchedUser?.username);
      if (res.status === 201)
        setSearchedUser({
          ...searchedUser,
          is_friend: false,
          request_received: false,
          request_sent: false,
          blocked_by_you: false
        });
    }
  }

  const CostumBlockButton = () => {
    if (searchedUser?.blocked_by_you)
      return <button onClick={handleDeblock} className="border border-myred px-3 py-2 rounded text-myred">Deblock</button>
    return <button onClick={handleBlock} className="border border-myred px-3 py-2 rounded text-myred">Block</button>
  }

  const CostumeButton = () => {
    if (searchedUser?.is_friend)
      return (
        <button
          onClick={handleUnfriend}
          className="text-myred px-4 py-2 rounded border border-myred"
        >
          Unfriend
        </button>
      );
    if (searchedUser?.request_received)
      return (
        <>
          <button
            onClick={handleAcceptRequest}
            className="text-white px-4 py-2 rounded bg-green-500"
          >
            Accept
          </button>
          <button
            onClick={handleRejectRequest}
            className="text-myred px-4 py-2 rounded border border-myred"
          >
            Reject
          </button>
        </>
      );
    if (searchedUser?.request_sent)
      return (
        <button
          onClick={handleCancelRequest}
          className="border border-myred text-myred px-4 py-2 rounded"
        >
          Cancel your request
        </button>
      );
    else if (!searchedUser?.blocked_by_you)
      return (
        <button
          onClick={handleSendRequest}
          className="bg-myred hover:bg-myred-h text-white px-4 py-2 rounded"
        >
          Add Friend
        </button>
      );
  };
  if (searchedUser === undefined) {
    return <div>Loading users information...</div>;
  }
  return (
    <div className="text-center py-16 px-4 md:px-0 text-black flex flex-col items-center max-w-[800px] mx-auto">
      <div className="w-20 h-20 bg-black rounded-full overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={
            `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/apiback/images/` +
            (searchedUser?.avatar !== ""
              ? searchedUser?.avatar
              : "default.png")
          }
          alt=""
        />
      </div>
      <div className="mt-4">
        <p className="text-lg font-semibold">{searchedUser?.username}</p>
        <p className="text-sm text-gray-400 font-light">
          {searchedUser?.email}
        </p>
      </div>
      <div className="my-4 flex gap-2">
        <CostumeButton />
        <CostumBlockButton />
      </div>
      <div className="w-full flex justify-center gap-6 mt-8">
        <div>
          <p>Total matches</p>
          <p>{stats.matches}</p>
        </div>
        <div>
          <p>Wins</p>
          <p>{stats.wins}</p>
        </div>
        <div>
          <p>Looses</p>
          <p>{stats.looses}</p>
        </div>
      </div>
      <div className="w-full mt-8">
        <p className="text-left text-xl font-semibold">{searchedUser.username}'s last matches</p>
        <div className="w-full py-6 flex flex-col gap-4">
          {
            data?.data?.map((match: any, index: number) => <MatchOnProfile match={match} profileUserName={params.slug} searchedUser={searchedUser} />)
          }
        </div>
      </div>
    </div>
  );
}
