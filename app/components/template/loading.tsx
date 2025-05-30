import { Hourglass } from "ldrs/react";
import "ldrs/react/Hourglass.css";

const Loading = () => {
  return (
    <div className="w-full h-full bg-white fixed z-10 grid place-items-center">
      <div className="grid place-items-center gap-5">
        <Hourglass
          size="50"
          bgOpacity="0.1"
          speed="1.75"
          color="oklch(62.3% .214 259.815)"
        />
        <p>Loading, please wait...</p>
      </div>
    </div>
  );
};

export default Loading;
