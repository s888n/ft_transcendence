import { useEffect, useContext } from "react";
import { createPortal } from "react-dom";
import NavbarContext from "@/contexts/NavbarContext";
import { IoCloseSharp } from "react-icons/io5";

const Sidebar = () => {
  const modalRoot = document.getElementById("navbar") as HTMLElement;
  const el = document.createElement("div");
  const { setToggleSidebar } = useContext(NavbarContext);

  useEffect(() => {
    modalRoot.appendChild(el);

    return () => {
      modalRoot.removeChild(el);
    };
  }, [el, modalRoot]);

  return createPortal(
    <div className="z-10">
      <div
        onClick={() => setToggleSidebar(false)}
        className="fixed top-0 left-0 bottom-0 right-0 bg-black opacity-50 z-10"
      ></div>
      <div className="fixed top-0 z-20 left-0 h-screen w-96 max-w-[80%] bg-white">
        <div className="w-full p-6 flex justify-end">
          <IoCloseSharp
            onClick={() => setToggleSidebar(false)}
            className="w-8 h-8 cursor-pointer"
          />
        </div>
      </div>
    </div>,
    modalRoot!
  );
};

export default Sidebar;