import { useRouter } from "next/navigation";
import { FC } from "react";


const MatchOnProfile:FC<any> = ({ match, profileUserName, searchedUser }) => {
    const router = useRouter()

    const matchFinished = match.finished
    const won = match.winner?.username === profileUserName
    let borderColor: string;
    let textColor: string;
    if (!matchFinished) {
        borderColor = "border-blue-500"
        textColor = "text-blue-500"
    } else if (won) {
        borderColor = "border-green-500"
        textColor = "text-green-500"
    } else {
        borderColor = "border-red-500"
        textColor = "text-red-500"
    }
    const profileOwner = match?.player1.username === profileUserName ? { ...match?.player1, score: match?.player1_score } : { ...match?.player2, score: match?.player2_score }
    const otherPalyer = match?.player1.username !== profileUserName ? { ...match?.player1, score: match?.player1_score } : { ...match?.player2, score: match?.player2_score }
    return <div
        onClick={() => {
            if (!matchFinished) router.push(`/play/online?id=${match.id}`);
        }}
        className={`w-full px-4 py-2 flex justify-between border rounded-full relative ${borderColor} ${matchFinished && "cursor-pointer"}`}>
        <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-black rounded-full overflow-hidden">
                <img
                    className="w-full h-full object-cover"
                    src={`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/apiback/images/` + (profileOwner?.avatar !== "" ? profileOwner.avatar : "default")}
                    alt=""
                />
            </div>
            <div>{profileOwner.username}</div>
        </div>
        <div className={`flex gap-2 items-center ${textColor}`}>
            <span>{profileOwner.score}</span>
            <span>:</span>
            <span>{otherPalyer.score}</span>
        </div>
        <div className="flex items-center gap-4">
            <div>{otherPalyer.username}</div>
            <div className="w-14 h-14 bg-black rounded-full overflow-hidden">
                <img
                    className="w-full h-full object-cover"
                    src={`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/apiback/images/` + (otherPalyer?.avatar !== "" ? otherPalyer.avatar : "default")}
                    alt=""
                />
            </div>
        </div>
    </div>
}

export default MatchOnProfile