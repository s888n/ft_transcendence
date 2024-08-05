"use client"
import { createContext, useContext,useState, useEffect} from 'react';

export const Colors = [
    "#FFFFFF",
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF", 
    "#FFA500",
    "#800080",
    "#008000",
    "#800000",
]


export const Backgrounds = [
    {
        name: "None",
        path: "/play/backgrounds/Black.jpg",
    },
    {
        name: "Nebula",
        path: "/play/backgrounds/Nebula.jpg",
    },
    {
        name: "Space",
        path: "/play/backgrounds/Space.jpg",
    },
    {
        name: "Sunset",
        path: "/play/backgrounds/Sunset.jpg",
    },
    {
        name: "Clouds",
        path: "/play/backgrounds/Clouds.jpg",
    },
]

export const CustomizationContext = createContext({});


export const CustomizationProvider = (props: any) => {
    const [ballColor, setBallColor] = useState(Colors[0]);
    const [paddleColor, setPaddleColor] = useState(Colors[0]);
    const [borderColor, setBorderColor] = useState(Colors[0]);
    const [scoreColor, setScoreColor] = useState(Colors[0]);
    const [background, setBackground] = useState(Backgrounds[0]);


    const value = {
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
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            setBallColor(localStorage.getItem("ballColor") || Colors[0]);
            setPaddleColor(localStorage.getItem("paddleColor") || Colors[0]);
            setBorderColor(localStorage.getItem("borderColor") || Colors[0]);
            setScoreColor(localStorage.getItem("scoreColor") || Colors[0]);
            setBackground(Backgrounds.find(bg => bg.name === localStorage.getItem("background")) || Backgrounds[0]);
        }
    }
    , []);

    useEffect(() => {
        localStorage.setItem("ballColor", ballColor);
        localStorage.setItem("paddleColor", paddleColor);
        localStorage.setItem("borderColor", borderColor);
        localStorage.setItem("scoreColor", scoreColor);
        localStorage.setItem("background", background.name);
    }
    , [ballColor, paddleColor, borderColor, scoreColor, background]);

    return (
		<CustomizationContext.Provider value={value}>
			{props.children}
		</CustomizationContext.Provider>
	);
};

export const useCustomization = () => useContext(CustomizationContext);