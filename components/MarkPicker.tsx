"use client";
import { useEffect, useState } from "react";
import { Mark } from "@/lib/types";
import styled from "styled-components";

export default function MarkPicker() {
  const [player1, setPlayer1] = useState(Mark.O);

  useEffect(() => {
    localStorage.setItem("player1", player1.toString());
  }, [player1]);

  return (
    <div className="bg-dark-navy flex rounded-[10px] p-[9px] mb-[17px]">
      <div
        className="flex-grow h-[54px] flex items-center justify-center rounded-[10px] hover:bg-[rgb(168,191,201,0.05)] cursor-pointer"
        style={{
          backgroundColor: player1 === Mark.X ? "var(--color-silver)" : "",
        }}
        onClick={() => setPlayer1(Mark.X)}
      >
        <svg
          width="64"
          height="64"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transform: "scale(0.5)" }}
        >
          <path
            d="M15.002 1.147 32 18.145 48.998 1.147a3 3 0 0 1 4.243 0l9.612 9.612a3 3 0 0 1 0 4.243L45.855 32l16.998 16.998a3 3 0 0 1 0 4.243l-9.612 9.612a3 3 0 0 1-4.243 0L32 45.855 15.002 62.853a3 3 0 0 1-4.243 0L1.147 53.24a3 3 0 0 1 0-4.243L18.145 32 1.147 15.002a3 3 0 0 1 0-4.243l9.612-9.612a3 3 0 0 1 4.243 0Z"
            fill={player1 === Mark.X ? "#1A2A33" : "#A8BFC9"}
            fillRule="evenodd"
          />
        </svg>
      </div>
      <div
        className="flex-grow h-[54px] flex items-center justify-center rounded-[10px] hover:bg-[rgb(168,191,201,0.05)] cursor-pointer"
        style={{
          backgroundColor: player1 === Mark.X ? "" : "var(--color-silver)",
        }}
        onClick={() => setPlayer1(Mark.O)}
      >
        <svg
          width="64"
          height="64"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transform: "scale(0.5)" }}
        >
          <path
            d="M32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0Zm0 18.963c-7.2 0-13.037 5.837-13.037 13.037 0 7.2 5.837 13.037 13.037 13.037 7.2 0 13.037-5.837 13.037-13.037 0-7.2-5.837-13.037-13.037-13.037Z"
            fill={player1 === Mark.X ? "#A8BFC9" : "#1A2A33"}
          />
        </svg>
      </div>
    </div>
  );
}