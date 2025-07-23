"use client";

import Image from "next/image";
import TurnDisplay from "@/components/TurnDisplay";
import { useState } from "react";
import { Mark } from "@/lib/types";

import Logo from "@/app/assets/logo.svg";
import IconRestart from "@/app/assets/icon-restart.svg";

export default function Solo() {
  const [turn, setTurn] = useState<Mark>(Mark.X);

  return (
    <>
      <header className="flex justify-between mx-[24px] mt-[24px] items-center">
        <Image src={Logo} alt="Logo" className="inline h-[32px]" />
        <TurnDisplay turn={turn} />
        <button
          className="w-[40px] h-[40px] flex justify-center items-center bg-silver rounded-[5px]"
          style={{ boxShadow: "0 -4px 0 0 inset #6B8997" }}
        >
          <Image src={IconRestart} alt="Restart" />
        </button>
      </header>
    </>
  );
}
