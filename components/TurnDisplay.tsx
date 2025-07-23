import { Mark } from "@/lib/types";
import IconX from "@/app/assets/icon-x-silver.svg";
import IconO from "@/app/assets/icon-o-silver.svg";
import Image from "next/image";

type Props = {
  turn: Mark;
};
export default function TurnDisplay({ turn }: Props) {
  return (
    <div
      className="flex items-center bg-semi-darknavy text-silver rounded-[5px] px-[15px] pt-[9px] pb-[13px] md:px-[30px] md:pt-[13px] md:pb-[19px] md:rounded-[10px] font-outfit font-bold text-[14px] md:text-[16px] tracking-[0.88px]"
      style={{ boxShadow: "0 -4px 0 0 inset #10212A" }}
    >
      {turn === Mark.X ? (
        <Image
          src={IconX}
          alt="x"
          className="w-[16px] h-[16px] md:w-[20px] md:h-[20px] inline-block mr-[9px]"
        />
      ) : (
        <Image
          src={IconO}
          alt="o"
          className="w-[16px] h-[16px] inline-block mr-[9px]"
        />
      )}
      TURN
    </div>
  );
}
