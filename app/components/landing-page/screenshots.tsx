import { useId, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useMediaQuery } from "~/hooks/use-media-query";
import Phone from "./phone";
import Tv from "./tv";
import imgHome from "~/assets/screenshots/main-screen.webp";
import imgPresentation from "~/assets/screenshots/presentation-ui.webp";
import imgSlide1 from "~/assets/screenshots/slide1.webp";
import imgSlide2 from "~/assets/screenshots/slide2.webp";

const Screenshots = () => {
  const isMd = useMediaQuery(`(min-width: 640px)`);

  const phoneRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: phoneRef,
    offset: ["60% end", "end end"],
  });
  const tvRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: tvScrollYProgress } = useScroll({
    target: tvRef,
    offset: ["start end", "80% start"],
  });

  const rotateRaw = useTransform(scrollYProgress, [0, 1], ["0deg", "-90deg"]);
  const rotate = useSpring(rotateRaw, { stiffness: 300, damping: 40 });
  const scale = useTransform(scrollYProgress, [0, 1], [1, isMd ? 0.8 : 0.5]);
  const y = useTransform(tvScrollYProgress, [0, 0.3, 1], ["0%", "10%", "25%"]);
  const homeScreenOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const presentationScreenOpacity = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 1],
  );

  // 5 positions: empty → slide1 → slide2 → slide1 → empty
  // each quarter hosts one transition (0.15 of scroll) + a short pause
  const presentationScreenTranslateYRaw = useTransform(
    tvScrollYProgress,
    [0, 0.15, 0.25, 0.4, 0.5, 0.65, 0.75, 0.9, 1.0],
    [
      "0%",
      "-100%",
      "-100%",
      "-200%",
      "-200%",
      "-300%",
      "-300%",
      "-400%",
      "-400%",
    ],
  );
  const presentationScreenTranslateY = useSpring(
    presentationScreenTranslateYRaw,
    { stiffness: 300, damping: 30 },
  );

  // slide1 is visible at positions 1 and 3
  const tvSlide1Opacity = useTransform(
    tvScrollYProgress,
    [0, 0.15, 0.25, 0.4, 0.5, 0.65, 0.75, 0.9, 1.0],
    [0, 1, 1, 0, 0, 1, 1, 0, 0],
  );
  // slide2 is visible at position 2
  const tvSlide2Opacity = useTransform(
    tvScrollYProgress,
    [0.25, 0.4, 0.5, 0.65],
    [0, 1, 1, 0],
  );

  const captionId = useId();

  return (
    <section className="py-20 bg-muted/30 overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Intuicyjna obsługa
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Do stworzenia slajdów wystarczy kilka kliknięć, a sterowanie
            prezentacją odbywa się za&nbsp;pomocą prostych gestów. Możesz
            skupić&nbsp;się na&nbsp;prowadzeniu śpiewu!
          </p>
        </div>

        <figure
          role="presentation"
          aria-label="Animacja przedstawiająca obsługę aplikacji"
        >
          <figcaption id={captionId} className="sr-only">
            Na początku widoczny jest ekran główny z listą pieśni dodanych do
            zestawu. Następnie telefon obraca się do orientacji poziomej i
            uruchamiana jest prezentacja: najpierw widać czarny ekran, potem z
            prawej strony wyjeżdża tekst refrenu pieśni, a następnie pierwszej
            zwrotki. Poniżej telefonu widać telewizor, na którym wyświetlają się
            te same slajdy co na telefonie, z synchronizacją w czasie
            rzeczywistym.
          </figcaption>
          <div
            className="flex justify-center sticky top-0 z-10"
            aria-hidden="true"
          >
            <div className="max-w-xs max-h-screen flex flex-col" ref={phoneRef}>
              <motion.div
                style={{
                  rotate,
                  scale,
                  y,
                }}
                transition={{
                  type: "spring",
                  duration: 1,
                  bounce: 0.2,
                }}
              >
                <Phone>
                  <motion.img
                    src={imgHome}
                    alt="Ekran główny aplikacji z listą pieśni dodanych do zestawu"
                    className="absolute w-full h-full object-cover left-0 top-0"
                    style={{ opacity: homeScreenOpacity }}
                  />
                  <motion.div
                    className="absolute w-full h-full left-0 top-0"
                    style={{
                      opacity: presentationScreenOpacity,
                      translateY: presentationScreenTranslateY,
                    }}
                    transition={{
                      type: "spring",
                      duration: 0.5,
                      bounce: 0.2,
                    }}
                  >
                    <div className="aspect-[0.45]" />
                    {[imgSlide1, imgSlide2, imgSlide1].map((img, index) => (
                      <div
                        className="aspect-[0.45] flex items-center justify-center relative"
                        key={index}
                      >
                        <img
                          src={img}
                          alt={`Slajd ${index + 1}`}
                          className="rotate-90 scale-[1.777]"
                        />
                      </div>
                    ))}
                    <div className="aspect-[0.45]" />
                  </motion.div>
                  <motion.img
                    src={imgPresentation}
                    alt="Widok prezentacji pieśni"
                    className="absolute w-full h-full object-cover left-0 top-0"
                    style={{ opacity: presentationScreenOpacity }}
                    transition={{
                      duration: 0.5,
                      type: "spring",
                      bounce: 0.2,
                    }}
                  />
                </Phone>
              </motion.div>
            </div>
          </div>
          <div
            ref={tvRef}
            className="max-w-2xl mx-auto z-0 -translate-y-[10%]"
            aria-hidden="true"
          >
            <Tv>
              <motion.img
                src={imgSlide1}
                alt="Slajd 1"
                className="absolute w-full h-full object-cover left-0 top-0"
                style={{ opacity: tvSlide1Opacity }}
              />
              <motion.img
                src={imgSlide2}
                alt="Slajd 2"
                className="absolute w-full h-full object-cover left-0 top-0"
                style={{ opacity: tvSlide2Opacity }}
              />
            </Tv>
          </div>
        </figure>
      </div>
    </section>
  );
};

export default Screenshots;
