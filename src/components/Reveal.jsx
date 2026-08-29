import { useEffect, useRef, useState } from "react";

export default function Reveal({
  children,
  delay = 0,
  direction = "up",
}) {
  const ref = useRef(null);
  const [visible, setVisible] =
    useState(false);

  useEffect(() => {
    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        },
        {
          threshold: 0.12,
        }
      );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const transforms = {
    up: visible
      ? "translate-y-0"
      : "translate-y-10",

    left: visible
      ? "translate-x-0"
      : "-translate-x-10",

    right: visible
      ? "translate-x-0"
      : "translate-x-10",
  };

  return (
    <div
      ref={ref}
      className={`transform transition-all duration-1000 ${transforms[direction]} ${
        visible
          ? "opacity-100"
          : "opacity-0"
      }`}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}