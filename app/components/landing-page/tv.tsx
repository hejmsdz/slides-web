import imgTv from "~/assets/tv.webp?as=img";
import srcsetTv from "~/assets/tv.webp?w=400;800;1340&as=srcset";
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
      <img
        src={imgTv.src}
        srcSet={srcsetTv}
        sizes="(min-width: 672px) 672px, 100vw"
        alt="Tv"
        width={imgTv.w}
        height={imgTv.h}
        className="w-full h-full relative z-1"
        loading="lazy"
      />
    </div>
  );
};

export default Tv;
