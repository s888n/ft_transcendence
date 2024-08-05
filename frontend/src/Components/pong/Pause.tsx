export default function Pause() {
    return (
        <div className=" absolute inset-0 flex items-center justify-center z-10">
            <div className="p-4 rounded-lg">
                <img src={"/pause.png"} alt="pause" width={96} height={96} />
            </div>
        </div>
    );
}