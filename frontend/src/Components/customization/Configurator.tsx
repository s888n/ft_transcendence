"use client"
import { useCustomization } from "@/contexts/CustomizationContext";
import { Backgrounds } from "@/contexts/CustomizationContext";
import { Colors } from "@/contexts/CustomizationContext";

interface CustomizationData {
    ballColor: string;
    setBallColor: (color: string) => void;
    paddleColor: string;
    setPaddleColor: (color: string) => void;
    borderColor: string;
    setBorderColor: (color: string) => void;
    scoreColor: string;
    setScoreColor: (color: string) => void;
    background: { name: string };
    setBackground: (background: { name: string }) => void;
}

export default function Configurator() {
    const {
        ballColor,
        setBallColor,
        paddleColor,
        setPaddleColor,
        borderColor,
        setBorderColor,
        scoreColor,
        setScoreColor,
        background,
        setBackground,
    } = useCustomization() as CustomizationData;

    return (
        // <div className="flex flex-col w-full h-full justify-center items-center">
            <div className="h-full p-2  grid grid-cols-1 gap-8 font-bold overflow-y-auto text-black">
            <BackgroundSelector background={background} setBackground={setBackground} />
            <ColorSelector name="Ball" color={ballColor} setColor={setBallColor} />
            <ColorSelector name="Paddles" color={paddleColor} setColor={setPaddleColor} />
            <ColorSelector name="Borders" color={borderColor} setColor={setBorderColor} />
            <ColorSelector name="Score" color={scoreColor} setColor={setScoreColor} />
        </div>
    )
}
interface ColorSelectorProps {
    name: string;
    color: string;
    setColor: (color: string) => void;
}
const ColorSelector = ({ name, color, setColor }: ColorSelectorProps) => {
    return (
        <div className="p-2 py-4 bg-purple-50 text-center border-2 rounded-lg">
            <h2
            className="mb-2 "
            >{name}</h2>
            <div className="md:grid grid-cols-4 lg:grid-cols-6">
                {Colors.map((c) => (
                    <button
                        key={c}
                        className={`w-6 h-6 rounded-full  hover:shadow-lg  m-2 sm:w-8 sm:h-8 md:w-10 md:h-10 cursor-pointer opacity-75
                        ${color === c ? "border-2 border-purple" : "border-2 border-grey"}`}
                        style={{ backgroundColor: c }}
                        onClick={() => setColor(c)}
                    />
                ))}
            </div>
        </div>
    )
}

interface BackgroundSelectorProps {
    background: { name: string };
    setBackground: (background: { name: string ,path : string}) => void;
}
const BackgroundSelector = ({  background, setBackground }: BackgroundSelectorProps) => {
    const handleChange = (e: any) => {
        setBackground(Backgrounds.find((bg) => bg.name === e.target.value) || Backgrounds[0]);
    }
    return (
        <div className="p-5 py-2  text-center border-2 rounded-lg ">
        <h2 className="m-2 p-2">Scene</h2>
            <select onChange={handleChange} value={background.name} name="background">
                {Backgrounds.map((bg) => (
                    <option value={bg.name} key={bg.name}>{bg.name} </option>
                    ))}
            </select>
        </div>
    )
}