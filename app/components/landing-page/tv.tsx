import imgTv from "~/assets/tv.webp";
import { cn } from "~/lib/utils";

const Tv = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-0 left-[0.9%] top-[1.6%] bottom-[14%] right-[0.9%] overflow-hidden z-0 bg-black">
        {children}
      </div>
      <img src={imgTv} alt="Tv" className="w-full h-full relative z-1" />
    </div>
  );
};

export default Tv;
