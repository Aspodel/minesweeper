import { Button, Center, Container, Space } from "@mantine/core";
import React from "react";
import { useLocation } from "react-router-dom";
import { useBoards } from "../utils/context";
import {
  getFlags,
  getHidden,
  getMines,
  initBoardData,
  revealEmpty,
} from "../utils/helpers";
import Cell from "./Cell";
import Leaderboard from "./Leaderboard";
import Timer from "./Timer";

const Board = () => {
  const { height, width, mines } = useBoards();
  const [boardData, setBoardData] = React.useState<any[]>([]);
  const [stepData, setStepData] = React.useState<any[]>([]);
  const [mineCount, setMineCount] = React.useState<number>(mines);
  const [gameStatus, setGameStatus] = React.useState("Game in progress");
  const [openedModal, setOpenedModal] = React.useState<boolean>(false);
  const [time, setTime] = React.useState(Date.now());

  React.useEffect(() => {
    let initStep = initBoardData(height, width, mines);
    setBoardData(initStep);
    setStepData((prevState) => [...prevState, initStep]);
  }, []);

  // reveals the whole board
  const revealBoard = () => {
    let updatedData = [...boardData];

    updatedData.map((datarow: any) => {
      datarow.map((dataitem: any) => {
        dataitem.isRevealed = true;
      });
    });

    setBoardData(updatedData);
    setStepData((prevState) => [...prevState, updatedData]);
  };

  // Handle User Events
  const handleCellClick = (x: number, y: number) => {
    // check if revealed. return if true.
    if (boardData[x][y].isRevealed || boardData[x][y].isFlagged) return null;

    // check if mine. game over if true
    if (boardData[x][y].isMine) {
      setGameStatus("You Lost");
      revealBoard();
      alert("game over");
    }

    let updatedData = JSON.parse(JSON.stringify(boardData));
    updatedData[x][y].isFlagged = false;
    updatedData[x][y].isRevealed = true;

    if (updatedData[x][y].isEmpty) {
      updatedData = revealEmpty(x, y, updatedData, height, width);
    }

    if (getHidden(updatedData).length === mines) {
      setMineCount(0);
      setGameStatus("You Win");
      alert("You Win");
    }

    setBoardData(updatedData);
    setStepData((prevState) => [...prevState, updatedData]);
    setMineCount(mines - getFlags(updatedData).length);
  };

  const handleContextMenu = (e: any, x: number, y: number) => {
    e.preventDefault();
    let updatedData = JSON.parse(JSON.stringify(boardData));
    let mines = mineCount;

    // check if already revealed
    if (updatedData[x][y].isRevealed) return;

    if (updatedData[x][y].isFlagged) {
      updatedData[x][y].isFlagged = false;
      mines++;
    } else {
      updatedData[x][y].isFlagged = true;
      mines--;
    }

    if (mines === 0) {
      const mineArray = getMines(updatedData);
      const flagArray = getFlags(updatedData);
      if (JSON.stringify(mineArray) === JSON.stringify(flagArray)) {
        setMineCount(0);
        setGameStatus("You Win");
        revealBoard();
        alert("You Win");
      }
    }

    setBoardData(updatedData);
    setMineCount(mines);
  };

  const handleUndoClick = () => {
    let updatedData = JSON.parse(JSON.stringify(stepData));
    updatedData.pop();
    // console.log("Board", updatedData[updatedData.length - 1]);
    // console.log("Update", updatedData);
    if (updatedData.length > 1) {
      setBoardData(updatedData[updatedData.length - 1]);
      setStepData(updatedData);
    }
  };

  const renderBoard = (data: any) => {
    return data.map((datarow: any) => {
      return datarow.map((dataitem: any) => {
        return (
          <React.Fragment key={dataitem.x * datarow.length + dataitem.y}>
            <Cell
              onClick={() => handleCellClick(dataitem.x, dataitem.y)}
              onContextMenu={(e: any) =>
                handleContextMenu(e, dataitem.x, dataitem.y)
              }
              dataItem={dataitem}
            />
            {datarow[datarow.length - 1] === dataitem ? (
              <div className="clear" />
            ) : (
              ""
            )}
          </React.Fragment>
        );
      });
    });
  };
  return (
    <div className="board">
      <div className="game-info">
        <span className="info">Mines remaining: {mineCount}</span>
        <h1 className="info">{gameStatus}</h1>
        <Timer initTime={time} />
        {/* <Leaderboard /> */}
        {/* <Button
          variant="gradient"
          gradient={{ from: "indigo", to: "cyan" }}
          onClick={handleUndoClick}
        >
          Undo
        </Button> */}
        <Space />
      </div>
      <div className={`game-screen game-${height}`}>
        <div className="game-container">{renderBoard(boardData)}</div>
      </div>
    </div>
  );
};

export default Board;
