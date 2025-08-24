"use client";

import "../globals.css";

import Image from "next/image";
import TurnDisplay from "@/components/TurnDisplay";
import { useEffect, useState } from "react";
import { Mark } from "@/lib/types";

import Logo from "@/app/assets/logo.svg";
import IconRestart from "@/app/assets/icon-restart.svg";
import styled from "styled-components";
import XIcon from "@/app/assets/icon-x.svg";
import OIcon from "@/app/assets/icon-o.svg";
import XDark from "@/app/assets/icon-x-dark-navy.svg";
import ODark from "@/app/assets/icon-o-dark-navy.svg";
import OOutlineIcon from "@/app/assets/icon-o-outline.svg";
import XOutlineIcon from "@/app/assets/icon-x-outline.svg";
import { useRouter } from "next/navigation";

enum BoardItem {
  X,
  O,
  None,
}

export default function Multi() {
  const router = useRouter();
  const [turn, setTurn] = useState(BoardItem.X);
  const [showRestart, setShowRestart] = useState(false);
  const [board, setBoard] = useState(new Array(9).fill(BoardItem.None));
  const [player1, setPlayer1] = useState(BoardItem.X);
  const [scores, setScores] = useState([0, 0, 0]);
  const [win, setWin] = useState(false);
  const [tied, setTied] = useState(false);
  const [winState, setWinState] = useState([] as number[]);

  useEffect(() => {
    setPlayer1(parseInt(localStorage.getItem("player1")!) as BoardItem);
  }, []);

  useEffect(() => {
    for (let i = 0; i < 9; i += 3) {
      if (
        board[i] === board[i + 1] &&
        board[i + 1] === board[i + 2] &&
        board[i + 2] !== BoardItem.None
      ) {
        setWin(true);
        setWinState([i, i + 1, i + 2]);
        addScore();
        return;
      }
    }

    for (let i = 0; i < 3; i++) {
      if (
        board[i] === board[i + 3] &&
        board[i + 3] === board[i + 6] &&
        board[i + 6] !== BoardItem.None
      ) {
        setWin(true);
        setWinState([i, i + 3, i + 6]);
        addScore();
        return;
      }
    }

    if (
      board[0] === board[4] &&
      board[4] === board[8] &&
      board[8] !== BoardItem.None
    ) {
      setWin(true);
      setWinState([0, 4, 8]);
      addScore();
      return;
    }

    if (
      board[2] === board[4] &&
      board[4] === board[6] &&
      board[6] !== BoardItem.None
    ) {
      setWin(true);
      setWinState([2, 4, 6]);
      addScore();
      return;
    }

    if (board.filter((v) => v === BoardItem.None).length === 0) {
      setTied(true);
      const newScore = [...scores];
      newScore[2]++;
      setScores(newScore);
    }
  }, [board]);

  function addScore() {
    const newScore = [...scores];
    newScore[turn === BoardItem.X ? 1 : 0]++;
    setScores(newScore);
  }

  function makeMove(pos: number) {
    const newBoard = [...board];
    newBoard[pos] = turn;
    setBoard(newBoard);
    setTurn(turn === BoardItem.X ? BoardItem.O : BoardItem.X);
  }

  function newGame() {
    setBoard(new Array(9).fill(BoardItem.None));
    setWinState([]);
    setWin(false);
    setTied(false);
  }

  function restart() {
    setBoard(new Array(9).fill(BoardItem.None));
    setTurn(BoardItem.X);
    setScores([0, 0, 0]);
    setWinState([]);
    setWin(false);
  }

  return (
    <>
      <header className="flex justify-between mx-[24px] mt-[24px] items-center mb-[64px] md:mx-auto md:w-[460px] md:mt-[201px] md:mb-[19px] xl:mt-[130px]">
        <Image src={Logo} alt="Logo" className="inline h-[32px] cursor-pointer" onClick={() => router.push('/')}/>
        <TurnDisplay turn={turn as unknown as Mark} />
        <button
          className="w-[40px] h-[40px] flex justify-center items-center bg-silver rounded-[5px] md:w-[52px] md:h-[52px] md:rounded-[10px] cursor-pointer hover:bg-silver-hover"
          style={{ boxShadow: "0 -4px 0 0 inset #6B8997" }}
          onClick={() => setShowRestart(true)}
        >
          <Image
            src={IconRestart}
            alt="Restart"
            className="w-[15.38px] md:w-[20px]"
          />
        </button>
      </header>

      <main className="mb-[127px]">
        <GameBoard>
          {board.map((item, key) => {
            return (
              <div
                key={key}
                className={
                  winState.indexOf(key) !== -1
                    ? item === BoardItem.X
                      ? "winx"
                      : "wino"
                    : ""
                }
                onClick={() => makeMove(key)}
              >
                {winState.indexOf(key) !== -1 ? (
                  <Image
                    src={item === BoardItem.X ? XDark : ODark}
                    alt={item === BoardItem.X ? "x" : "o"}
                  />
                ) : (
                  item !== BoardItem.None ? (
                    <Image
                      src={item === BoardItem.X ? XIcon : OIcon}
                      alt={item === BoardItem.X ? "x" : "o"}
                    />
                  ) : (
                    <Image
                      className="only-hover"
                      src={turn === BoardItem.X ? XOutlineIcon : OOutlineIcon}
                      alt="hover outline"
                    />
                  )
                )}
              </div>
            );
          })}
        </GameBoard>

        <BottomBar>
          <div className="bg-light-blue">
            <div className="head">
              X ({player1 === BoardItem.X ? "P1" : "P2"})
            </div>
            <div className="body">{scores[BoardItem.X as number]}</div>
          </div>
          <div className="bg-silver">
            <div className="head">TIES</div>
            <div className="body">{scores[BoardItem.None as number]}</div>
          </div>
          <div className="bg-light-yellow">
            <div className="head">
              O ({player1 === BoardItem.X ? "P2" : "P1"})
            </div>
            <div className="body">{scores[BoardItem.O as number]}</div>
          </div>
        </BottomBar>

        {/* Win-lose dialog */}
        {win && (
          <div
            className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center"
            style={{ backgroundColor: "rgba(0, 0, 0, .5)" }}
          >
            <section className="w-screen bg-semi-darknavy text-center pt-[40px] pb-[48px] md:pt-[45px] md:pb-[45px] font-outfit">
              <h1 className="font-bold text-[14px] md:text-[16px] tracking-[0.88px] text-silver mb-[16px]">
                PLAYER {turn !== player1 ? "1" : "2"} WINS!
              </h1>
              <p
                className="font-bold text-[24px] tracking-[1.5px] text-light-blue flex w-fit mx-auto items-center mb-[24px] md:text-[40px] md:tracking-[2.5px] md:mb-[31px]"
                style={{
                  color:
                    turn !== BoardItem.X
                      ? "var(--color-light-blue)"
                      : "var(--color-light-yellow)",
                }}
              >
                <Image
                  src={turn !== BoardItem.X ? XIcon : OIcon}
                  alt="x"
                  className="inline-block w-[28px] h-[28px] mr-[9px] md:w-[64px] md:h-[64px] md:mr-[24px]"
                />
                TAKES THIS ROUND
              </p>
              <div>
                <button
                  className="pt-[15px] pl-[17px] pr-[16px] pb-[17px] bg-silver text-[#1A2A33] font-bold text-[16px] tracking-[1px] rounded-[10px] mr-[16px] cursor-pointer hover:bg-silver-hover"
                  style={{ boxShadow: "0 -4px 0 0 inset #6B8997" }}
                  onClick={() => {
                    localStorage.clear();
                    router.push("/");
                  }}
                >
                  QUIT
                </button>
                <button
                  className="pt-[15px] pl-[17px] pr-[16px] pb-[17px] bg-light-yellow text-[#1A2A33] font-bold text-[16px] tracking-[1px] rounded-[10px] cursor-pointer hover:bg-lightyellow-hover"
                  style={{ boxShadow: "0 -4px 0 0 inset #CC8B13" }}
                  onClick={() => newGame()}
                >
                  NEXT ROUND
                </button>
              </div>
            </section>
          </div>
        )}

        {/* restart game dialog */}
        {showRestart && (
          <div
            className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center"
            style={{ backgroundColor: "rgba(0, 0, 0, .5)" }}
          >
            <section className="w-screen bg-semi-darknavy text-center pt-[40px] pb-[48px] md:pt-[67px] md:pb-[66px] font-outfit">
              <h1 className="font-bold text-[24px] tracking-[1.5px] text-silver mb-[24px] md:text-[40px] md:tracking-[2.5px] md:mb-[31px]">
                RESTART GAME?
              </h1>
              <div>
                <button
                  className="pt-[15px] pl-[17px] pr-[16px] pb-[17px] bg-silver text-[#1A2A33] font-bold text-[16px] tracking-[1px] rounded-[10px] mr-[16px] cursor-pointer hover:bg-silver-hover"
                  style={{ boxShadow: "0 -4px 0 0 inset #6B8997" }}
                  onClick={() => {
                    setShowRestart(false);
                  }}
                >
                  NO, CANCEL
                </button>
                <button
                  className="pt-[15px] pl-[17px] pr-[16px] pb-[17px] bg-light-yellow text-[#1A2A33] font-bold text-[16px] tracking-[1px] rounded-[10px] cursor-pointer hover:bg-lightyellow-hover"
                  style={{ boxShadow: "0 -4px 0 0 inset #CC8B13" }}
                  onClick={() => {
                    restart();
                    setShowRestart(false);
                  }}
                >
                  YES, RESTART
                </button>
              </div>
            </section>
          </div>
        )}

        {/* tie dialog */}
        {tied && (
          <div
            className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center"
            style={{ backgroundColor: "rgba(0, 0, 0, .5)" }}
          >
            <section className="w-screen bg-semi-darknavy text-center pt-[40px] pb-[48px] font-outfit">
              <h1 className="font-bold text-[24px] tracking-[1.5px] text-silver mb-[24px] md:text-[40px] md:tracking-[2.5px] md:mb-[31px]">
                ROUND TIED
              </h1>
              <div>
                <button
                  className="pt-[15px] pl-[17px] pr-[16px] pb-[17px] bg-silver text-[#1A2A33] font-bold font-[16px] tracking-[1px] rounded-[10px] mr-[16px]"
                  style={{ boxShadow: "0 -4px 0 0 inset #6B8997" }}
                  onClick={() => {
                    localStorage.clear();
                    router.push("/");
                  }}
                >
                  QUIT
                </button>
                <button
                  className="pt-[15px] pl-[17px] pr-[16px] pb-[17px] bg-light-yellow text-[#1A2A33] font-bold font-[16px] tracking-[1px] rounded-[10px]"
                  style={{ boxShadow: "0 -4px 0 0 inset #CC8B13" }}
                  onClick={() => newGame()}
                >
                  NEXT ROUND
                </button>
              </div>
            </section>
          </div>
        )}
      </main>
    </>
  );
}

const GameBoard = styled.section`
  display: grid;
  grid-template-columns: auto auto auto;
  gap: 20px;
  width: 328px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    width: 460px;
  }

  div {
    width: 96px;
    height: 96px;
    border-radius: 10px;
    box-shadow: 0 -8px 0 0 inset #10212a;
    background-color: var(--color-semi-darknavy);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    .only-hover {
      display: none;
    }

    &:hover .only-hover {
      display: block;
    }

    @media (min-width: 768px) {
      width: 140px;
      height: 140px;
      border-radius: 20px;
    }

    img {
      width: 40px;
      height: 40px;
      position: relative;
      bottom: 4px;

      @media (min-width: 768px) {
        width: 64px;
        height: 64px;
      }
    }
  }

  .winx {
    background-color: var(--color-light-blue);
    box-shadow: 0 -8px 0 0 inset #118c87;
  }

  .wino {
    background-color: var(--color-light-yellow);
    box-shadow: 0 -8px 0 0 inset #cc8b13;
  }
`;

const BottomBar = styled.section`
  width: 328px;
  display: grid;
  grid-template-columns: auto auto auto;
  margin-left: auto;
  margin-right: auto;
  gap: 20px;
  font-family: var(--font-outfit);

  @media (min-width: 768px) {
    width: 460px;
  }

  & > div {
    width: 100%;
    height: 64px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    @media (min-width: 768px) {
      height: 72px;
      border-radius: 15px;
    }

    & > div {
      width: fit-content;
      color: var(--color-dark-navy);

      &.head {
        font-weight: medium;
        font-size: 14px;
        line-height: auto;
        letter-spacing: 0.88px;
      }

      &.body {
        font-weight: bold;
        font-size: 20px;
        line-height: auto;
        letter-spacing: 1.25px;
        margin-top: -3px;

        @media (min-width: 768px) {
          font-size: 24px;
          letter-spacing: 1.5px;
        }
      }
    }
  }
`;
