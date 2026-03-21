import imgPhone from "~/assets/phone.webp?as=img";
import srcsetPhone from "~/assets/phone.webp?w=320;640&as=srcset";
import { cn } from "~/lib/utils";

const Phone = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-0 left-[3.4%] top-[1.5%] bottom-[2%] right-[4.4%] overflow-hidden z-0 bg-black">
        {children}
      </div>
      <img
        src={imgPhone.src}
        srcSet={srcsetPhone}
        sizes="320px"
        alt="Phone"
        width={imgPhone.w}
        height={imgPhone.h}
        className="w-full h-full relative z-1"
        loading="lazy"
      />
    </div>
  );
};

export default Phone;
