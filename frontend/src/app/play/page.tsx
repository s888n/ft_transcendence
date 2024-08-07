"use client"
import { useRouter } from 'next/navigation';
import { useContext,useState} from 'react';
import UserContext from "@/contexts/UserContext";
import FriendsModal from "@/Components/FriendsModal";
import TournamentModal from "@/Components/TournamentModal";
import Players from '@/Components/pong/Players';
import Link  from 'next/link';
import Image from 'next/image';
interface GameModeCardProps {
	mode: string;
	description: string;
    source : string;
	handleClick: () => void;
}
const GameModeCard = ({ mode, description,source , handleClick }: GameModeCardProps) => {
    return (
        <div className=" rounded-lg shadow-md p-6 flex flex-col items-center border-2
        hover:border-myred  transition duration-300 ease-in-out cursor-pointer"
        onClick={handleClick}>
            <h3 className="text-2xl font-bold text-center">{mode}</h3>
            <img src={source} alt={mode} width={200} height={200} className="mt-4" />
            <p
                className="text-center mt-4"
            >{description}</p>
        </div>
    );
}

export default function Page() {
    const { user} = useContext(UserContext);
    const router = useRouter();
    const [showFriendsModal, setShowFriendsModal] = useState(false);
    const [showTournamentModal, setShowTournamentModal] = useState(false);
    return (
        <div className="flex flex-col items-center text-black">
            <div
                className="hover:border-myred border-2 transition duration-300 ease-in-out   cursor-pointer rounded-full mt-10 " 
                title='Customize Your Game'
                >
                <Link href="/play/customize">
                    <img src='/play/icons/brush.png' alt='customize' width={100}  height={100} />
                </Link>
            </div>
            <div className="container mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                <GameModeCard mode="Practice" description="Sharpen your skills against our AI &quot;Bender&quot;" 
                source='/play/icons/practice.png'
                handleClick={() => router.push("/play/practice")} />
                <GameModeCard mode="Local Multiplayer" description="Challenge a friend locally" 
                source='/play/icons/local.png'
                handleClick={() => router.push("/play/local")} />
                <GameModeCard mode="Online Multiplayer" description="Invite a Friend to play" 
                source='/play/icons/online.png'
                handleClick={() => setShowFriendsModal(true)} />
                <GameModeCard mode="Tournament" 
                description="Create a local tournament with friends"
                source='/play/icons/tournament.png'
                handleClick={() => setShowTournamentModal(true)} />
            </div>
            {showFriendsModal && <FriendsModal username={user?.username || ''} 
            setShowFriendsModal={setShowFriendsModal} />}
            {showTournamentModal && <TournamentModal setShowTournamentModal={setShowTournamentModal} />}
        </div>
    );
}