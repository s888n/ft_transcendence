"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAPI,postAPI } from '@/api/APIServices';
interface TournamentModalProps {
    setShowTournamentModal: (show: boolean) => void;
}




export default function TournamentModal({ setShowTournamentModal }: TournamentModalProps) {
    const router = useRouter();
    const options = [4, 8];
    const [numPlayers, setNumPlayers] = useState(4);
    const [tournamentName, setTournamentName] = useState('');
    const [players, setPlayers] = useState<string[]>([]);
    const [error, setError] = useState('');


    const handleSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data: any = await postAPI('tournament/create_tournament/', {
            name: tournamentName,
            numberOfPlayers: numPlayers,
            playersNames: players,
        })
        .then((res: any) => {
            if (res.status === 201) {
                router.push(`/play/tournament?id=${res.data.id}`);
            }
            else {
                setError(res.data.data.error);
            }
        });
        return data;
        // setShowTournamentModal(false);
    };
    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-1/2 font-bold">
                <form  onSubmit={handleSubmission}
                >
                    <h2 className="text-2xl  text-center mb-4 text-myred ">Create Tournament</h2>
                    <label className="block text-lg font-bold" htmlFor='tournamentName'>
                        Tournament Name:
                    </label>
                    <input type="text" className="w-full border-2 border-gray-300 p-2 rounded-lg mb-4"
                    id='tournamentName'
                    value={tournamentName}
                    placeholder="Tournament Name"
                    maxLength={20}
                    minLength={3}
                    onChange={(e) => setTournamentName(e.target.value)}
                    required
                    />
                    <label className="block text-lg font-bold" htmlFor='numPlayers'>
                        Number of Players:</label>
                    <select className="w-full border-2 border-gray-300 p-2 rounded-lg mb-4"
                    id='numPlayers'
                    value={numPlayers}
                    onChange={(e) => setNumPlayers(parseInt(e.target.value))}
                    >
                        {options.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                    <label className="block text-lg font-bold">Players:</label>
                <ul>
                    {
                        Array.from({ length: numPlayers }).map((_, index) => (
                            <li key={index}>
                                <input type="text" className="w-full border-2 border-gray-300 p-2 rounded-lg mb-4"
                                value={players[index] || ''}
                                placeholder={`Player ${index + 1}`}
                                onChange={(e) => {
                                    const newPlayers = [...players];
                                    newPlayers[index] = e.target.value;
                                    setPlayers(newPlayers);
                                }}
                                required
                                />
                            </li>
                        ))
                    }
                </ul>
                    <button type="submit" className="w-full bg-myred text-white p-2 rounded-lg">Create Tournament</button>
                </form>
                <button className="w-full bg-myred text-white p-2 rounded-lg mt-4"
                onClick={() => setShowTournamentModal(false)}
                >
                    Cancel
                </button>
                {error && <p className="text-myred text-center mt-4">{error}</p>}
            </div>
        </div>
    );
}
