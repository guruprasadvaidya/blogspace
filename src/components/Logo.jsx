
import React from "react";
import { Link } from "react-router-dom";

function Logo({ width = "auto" }) {
  return (
    <Link
      to="/"
      aria-label="Go to homepage"
      className="inline-flex w-fit shrink-0 items-center gap-2 whitespace-nowrap"
      style={{ width, minWidth: "max-content" }}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7956A8] text-lg font-bold text-white">
        B
      </span>

      <span className="text-xl font-bold tracking-tight text-[#171717]">
        Blog<span className="text-[#7956A8]">space.</span>
      </span>
    </Link>
  );
}

export default Logo;
