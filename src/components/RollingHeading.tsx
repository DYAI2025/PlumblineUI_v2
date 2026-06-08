import { useState, useEffect } from "react";
import { motion } from "motion/react";

interface RollingHeadingProps {
  text: string;
  className?: string;
  delayMs?: number;
  as?: "h2" | "span" | "div" | "h1" | "h3" | "p";
}

interface CharObject {
  char: string;
  styleClass: string;
}

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";
const SYMBOLS = "!?#@*-+=/[]{}<>_";

// Function to parse the bracketed sections of the text for styled classes
function parseText(rawText: string): CharObject[] {
  const result: CharObject[] = [];
  let currentStyle = "inherit";

  for (let i = 0; i < rawText.length; i++) {
    const char = rawText[i];
    if (char === "{") {
      currentStyle = "gold";
    } else if (char === "}") {
      currentStyle = "inherit";
    } else if (char === "[") {
      currentStyle = "bronze";
    } else if (char === "]") {
      currentStyle = "inherit";
    } else if (char === "<") {
      currentStyle = "teal";
    } else if (char === ">") {
      currentStyle = "inherit";
    } else if (char === "|") {
      if (currentStyle === "red") {
        currentStyle = "inherit";
      } else {
        currentStyle = "red";
      }
    } else {
      let styleClass = "";
      if (currentStyle === "gold") {
        styleClass = "text-gold font-black";
      } else if (currentStyle === "bronze") {
        styleClass = "text-bronze font-black";
      } else if (currentStyle === "teal") {
        styleClass = "text-teal font-black";
      } else if (currentStyle === "red") {
        styleClass = "text-[#ff4d4d] font-black";
      }
      result.push({ char, styleClass });
    }
  }
  return result;
}

function RollingChar({ targetChar, index, triggerKey, styleClass }: { targetChar: string; index: number; triggerKey: string; styleClass: string }) {
  const [currentChar, setCurrentChar] = useState(targetChar);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (targetChar === " " || targetChar === "\u00A0") {
      setCurrentChar(" ");
      setIsDone(true);
      return;
    }

    let pool = LOWER;
    if (UPPER.includes(targetChar)) {
      pool = UPPER;
    } else if (LOWER.includes(targetChar)) {
      pool = LOWER;
    } else if (DIGITS.includes(targetChar)) {
      pool = DIGITS;
    } else if (SYMBOLS.includes(targetChar)) {
      pool = SYMBOLS;
    } else {
      pool = LOWER;
    }

    setIsDone(false);

    // Staggered departure-board style roll duration (left-to-right cascade)
    const maxSteps = 8 + Math.floor(Math.random() * 5) + index * 2.2;
    let step = 0;

    const interval = setInterval(() => {
      if (step >= maxSteps) {
        setCurrentChar(targetChar);
        setIsDone(true);
        clearInterval(interval);
      } else {
        const randomChar = pool[Math.floor(Math.random() * pool.length)];
        setCurrentChar(randomChar);
        step++;
      }
    }, 45); // snappy 45ms update tick

    return () => clearInterval(interval);
  }, [targetChar, index, triggerKey]);

  if (targetChar === " ") {
    return <span className="inline-block">&nbsp;</span>;
  }

  return (
    <span
      className={`inline-flex justify-center select-none ${styleClass || ""}`}
      style={{
        perspective: "300px",
        minWidth: "0.58em", // ensures stable column alignment with the Inter font
      }}
    >
      <motion.span
        key={currentChar + isDone}
        initial={{ rotateX: -90, opacity: 0.5, scaleY: 0.9 }}
        animate={{ rotateX: 0, opacity: 1, scaleY: 1 }}
        transition={{ duration: 0.08, ease: "easeOut" }}
        style={{
          display: "inline-block",
          transformOrigin: "center",
          backfaceVisibility: "hidden",
        }}
        className={isDone ? "text-inherit" : "text-gold font-bold"}
      >
        {currentChar}
      </motion.span>
    </span>
  );
}

export function RollingHeading({ text, className, delayMs = 0, as = "h2" }: RollingHeadingProps) {
  const [shouldRender, setShouldRender] = useState(delayMs === 0);

  useEffect(() => {
    if (delayMs > 0) {
      const timer = setTimeout(() => setShouldRender(true), delayMs);
      return () => clearTimeout(timer);
    }
  }, [delayMs]);

  const Tag = as;

  if (!shouldRender) {
    const parsedText = parseText(text);
    const rawString = parsedText.map(t => t.char).join("");
    return (
      <Tag className={className}>
        <span className="opacity-0">{rawString}</span>
      </Tag>
    );
  }

  const parsedChars = parseText(text);

  return (
    <Tag className={className}>
      {parsedChars.map((charObj, index) => (
        <RollingChar
          key={index}
          targetChar={charObj.char}
          index={index}
          triggerKey={text}
          styleClass={charObj.styleClass}
        />
      ))}
    </Tag>
  );
}
