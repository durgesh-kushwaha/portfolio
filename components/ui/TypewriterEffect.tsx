"use client";
import { Typewriter } from "react-simple-typewriter";

const TypewriterEffect = () => {
  return (
    <span className="typewriter-text">
      <Typewriter
        words={[
          "Data Analytics Intern",
          "AI & DS Student",
          "Web Developer",
          "SEO Specialist",
          "Problem Solver",
        ]}
        loop={true}
        cursor
        cursorStyle="_"
        typeSpeed={70}
        deleteSpeed={50}
        delaySpeed={2000}
      />
    </span>
  );
};

export default TypewriterEffect;