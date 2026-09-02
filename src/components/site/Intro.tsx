import { useEffect, useState } from "react";

import logo from "@/assets/logo-jailes.png";
import tela from "@/assets/tela-macro.jpg";

const WORDS = ["CALIDAD", "TEXTURA", "PERSONALIZACIÓN"];
const STORAGE_KEY = "jailes-intro-seen";

/**
 * Intro cinematográfica de ~3.6s. Sólo se reproduce una vez por sesión y
 * respeta prefers-reduced-motion.
 */
export function Intro() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || sessionStorage.getItem(STORAGE_KEY)) return;
    sessionStorage.setItem(STORAGE_KEY, "1");
    setVisible(true);
    document.body.style.overflow = "hidden";
    const timers = [
      setTimeout(() => setStep(1), 700),
      setTimeout(() => setStep(2), 1400),
      setTimeout(() => setStep(3), 2000),
      setTimeout(() => setStep(4), 2600),
      setTimeout(() => setStep(5), 3100),
      setTimeout(() => setClosing(true), 3600),
      setTimeout(() => {
        setVisible(false);
        document.body.style.overflow = "";
      }, 4300),
    ];
    return () => {
      timers.forEach(clearTimeout);
      document.body.style.overflow = "";
    };
  }, []);

  if (!visible) return null;

  const skip = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
    }, 500);
  };

  return (
    <div
      className={`fixed inset-0 z-100 flex items-center justify-center bg-background transition-opacity duration-700 ${
        closing ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      <img
        src={tela}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-[2200ms] ease-out"
        style={{
          opacity: step >= 1 ? 0.22 : 0.06,
          transform: `scale(${1.12 + step * 0.015})`,
        }}
      />
      <div className="absolute inset-0 bg-background/70" />

      <div className="relative flex flex-col items-center gap-6 text-center">
        <img
          src={logo}
          alt=""
          width={64}
          height={88}
          className="h-16 w-auto transition-all duration-700"
          style={{ opacity: step >= 2 ? 1 : 0, transform: step >= 2 ? "none" : "translateY(10px)" }}
        />
        <div className="h-7 overflow-hidden">
          {WORDS.map((word, index) => (
            <p
              key={word}
              className="eyebrow text-foreground transition-all duration-500"
              style={{
                opacity: step === index + 2 ? 1 : 0,
                transform: step === index + 2 ? "none" : "translateY(8px)",
                position: index === 0 ? "relative" : "absolute",
                left: index === 0 ? undefined : "50%",
                marginLeft: index === 0 ? undefined : "-50%",
                width: index === 0 ? undefined : "100%",
              }}
            >
              {word}
            </p>
          ))}
        </div>
        <p
          className="font-display text-4xl tracking-[0.3em] transition-all duration-700 sm:text-6xl"
          style={{ opacity: step >= 5 ? 1 : 0, transform: step >= 5 ? "none" : "scale(0.96)" }}
        >
          JAILES
        </p>
      </div>

      <button
        type="button"
        onClick={skip}
        className="pointer-events-auto absolute bottom-8 right-8 text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
      >
        Saltar intro
      </button>
    </div>
  );
}
