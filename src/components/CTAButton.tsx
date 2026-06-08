import { useEffect, useRef, useState, ReactNode, RefObject } from "react";
import { cn } from "../utils/cn";

interface CTAButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}

export function CTAButton({ children, onClick, href, variant = "secondary", className }: CTAButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const el = buttonRef.current;
    if (!el || typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      // Gentle drift for premium magnetic look
      setCoords({ x: x * 0.15, y: y * 0.15 });
    };

    const handleMouseLeave = () => {
      setCoords({ x: 0, y: 0 });
      setIsHovered(false);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const variantStyles = {
    primary: "bg-gold text-void border border-gold hover:bg-gold/90 hover:shadow-[0_0_15px_rgba(213,137,27,0.35)]",
    secondary: "bg-transparent text-teal border border-teal/40 hover:border-teal hover:bg-teal/5",
    ghost: "bg-transparent text-bronze hover:text-teal hover:bg-void"
  };

  const commonClasses = cn(
    "relative inline-flex items-center justify-center px-6 py-3 font-mono text-xs uppercase tracking-widest font-semibold transition-all duration-300 ease-out focus:outline-none focus:ring-1 focus:ring-gold focus:ring-offset-1 focus:ring-offset-void select-none cursor-pointer",
    variantStyles[variant],
    className
  );

  const style = {
    transform: isHovered ? `translate3d(${coords.x}px, ${coords.y}px, 0)` : "translate3d(0,0,0)",
    transition: isHovered ? "transform 0.1s ease-out" : "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
  };

  if (href) {
    return (
      <a
        ref={buttonRef as RefObject<HTMLAnchorElement | null>}
        href={href}
        className={commonClasses}
        style={style}
      >
        <span className="relative z-10 flex items-center gap-2">{children}</span>
        {variant !== "ghost" && (
          <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-current/5 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
        )}
      </a>
    );
  }

  return (
    <button
      ref={buttonRef as RefObject<HTMLButtonElement | null>}
      onClick={onClick}
      className={commonClasses}
      style={style}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {variant !== "ghost" && (
        <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-current/5 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
      )}
    </button>
  );
}
