"use client";
import UserContext from "@/contexts/UserContext";
import { useState, useEffect, useContext } from "react";
import { getProfileData } from "@/api/profile";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getUserStats } from "@/api/users";
import MatchOnProfile from "@/Components/MatchOnProfile";

export default function Page() {
  const { user, setUser } = useContext(UserContext);
  const { data } = useQuery({
    queryKey: ["userStats", user?.username],
    queryFn: async () => !user?.username ? () => ({ data: null }) : getUserStats(user?.username)
  })
  const router = useRouter();
  const [stats, setStats] = useState({
    matches: 69,
    wins: 69,
    looses: 69,
  })

  const fetchProfile = async () => {
    if (user === undefined) {
      const res = await getProfileData();
      if (res.status === 200) {
        setUser(res.data);
      }
      console.log("PROFILEDATA", res);
    }
  };
  useEffect(() => {
    if (user === undefined) {
      fetchProfile();
    }
  }, []);
  useEffect(() => {
    console.log("ddddaaatda", data)
    if (data?.data) {
      // console.log(params.slug)
      const winsMatches = data?.data.filter((match: any, index) => {
        // console.log(index, match.winner.username, user?.username)
        if (match.winner?.username === user?.username) return match
      })
      const actualStats = {
        matches: data?.data.length,
        wins: winsMatches.length,
        looses: data?.data.length - winsMatches.length,
      }
      setStats(actualStats)
      console.log("statsssss", actualStats)
    }
  }, [data, user])

  return (
    <div className="text-center py-16 px-4 md:px-0 text-black flex flex-col items-center gap-6 max-w-[800px] mx-auto">
      <div className="w-full flex flex-col items-center">
        <div className="w-20 h-20 bg-black rounded-full overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={"http://127.0.0.1:8000/api/images/" + user?.avatar}
            alt=""
          />
        </div>
        <div className="mt-4">
          <p className="text-lg font-semibold">{user?.username}</p>
          <p className="text-sm text-gray-400 font-light">{user?.email}</p>
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
          <p className="text-left text-xl font-semibold">Your last matches</p>
          <div className="w-full py-6 flex flex-col gap-4">
            {
              data?.data?.map((match: any, index: number) => <MatchOnProfile match={match} profileUserName={user?.username} searchedUser={user} />)
            }
          </div>
        </div>
      </div>
    </div>
  );
}
