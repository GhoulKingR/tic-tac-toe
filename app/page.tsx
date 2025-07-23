import Image from "next/image";
import Logo from "@/app/assets/logo.svg";
import Link from "next/link";
import MarkPicker from "@/components/MarkPicker";

export default function Home() {
  return (
    <div className="font-outfit w-screen h-screen flex justify-center items-center">
      <section className="w-[327px] md:w-[420px]">
        <Image
          src={Logo}
          alt="Logo"
          className="mx-auto mb-[32px] md:mb-[40px]"
        />

        <div
          className="bg-semi-darknavy rounded-[15px] pt-[24px] pb-[30px] px-[24px] text-center mb-[32px] md:mb-[40px]"
          style={{ boxShadow: "0px -8px 0 0 inset #10212A" }}
        >
          <h1 className="text-silver font-bold text-[16px] leading-auto tracking-[1px] mb-[24px]">
            PICK PLAYER 1'S MARK
          </h1>
          <MarkPicker />
          <p className="font-medium text-[14px] tracking-[0.88px] text-silver">
            REMEMBER X GOES FIRST
          </p>
        </div>

        <Link
          href="/solo"
          className="block text-center w-full pt-[14px] pb-[22px] font-bold tracking-[1px] text-[16px] text-dark-navy bg-light-yellow rounded-[15px] mb-[16px] md:mb-[20px] hover:bg-lightyellow-hover"
          style={{ boxShadow: "0 -8px 0 0 inset #CC8B13" }}
        >
          NEW GAME (VS CPU)
        </Link>
        <Link
          href="/multi"
          className="block text-center w-full pt-[14px] pb-[22px] font-bold tracking-[1px] text-[16px] text-dark-navy bg-light-blue rounded-[15px] hover:bg-lightblue-hover"
          style={{ boxShadow: "0 -8px 0 0 inset #118C87" }}
        >
          NEW GAME (VS PLAYER)
        </Link>
      </section>
    </div>
  );
}
