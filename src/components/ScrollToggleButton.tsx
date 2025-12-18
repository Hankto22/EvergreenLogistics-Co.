import { useEffect, useRef, useState } from "react";

function ArrowIcon({ direction }: { direction: string }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`arrow ${direction}`}
    >
      <path
        d="M12 4v16m0 0l-6-6m6 6l6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ScrollToggleButton() {
  const [visible, setVisible] = useState(false);
  const [direction, setDirection] = useState("down"); // down | up
  const hideTimeout = useRef<number | null>(null);

  // Auto-hide after inactivity
  const resetAutoHide = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => {
      setVisible(false);
    }, 2500);
  };

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      setVisible(scrollTop > 100);

      // Determine direction based on position
      if (scrollTop + windowHeight >= docHeight - 50) {
        setDirection("up");
      } else {
        setDirection("down");
      }

      resetAutoHide();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // Initial check

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    if (direction === "up") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-label={
        direction === "up" ? "Scroll to top of page" : "Scroll to bottom of page"
      }
      aria-live="polite"
      className={`scroll-btn ${visible ? "show" : ""}`}
    >
      <ArrowIcon direction={direction} />
    </button>
  );
}