import { Button, Space } from "@mantine/core";
import React from "react";
import {
  getFlags,
  getHidden,
  getMines,
  initBoardData,
  revealEmpty,
} from "../utils/helpers";
import Cell from "./Cell";
import Timer from "./Timer";

type BoardProps = {
  height: number;
  width: number;
  mines: number;
};

const Board = ({ height, width, mines }: BoardProps) => {
  const [boardData, setBoardData] = React.useState<any[]>([]);
  const [gameWon, setGameWon] = React.useState<boolean>();
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

  // React.useEffect(() => {
  //   let steps = JSON.parse(localStorage.getItem("stepHistory")!);

  //   // console.log(steps);
  //   // console.log(steps.length);
  // }, [boardData]);

  // React.useEffect(() => {
  //   console.log(boardData);
  //   // setStepData([...stepData, boardData]);
  // }, [boardData]);

  // React.useEffect(() => {
  //   // localStorage.setItem("stepHistory", JSON.stringify(stepData));
  //   console.log(stepData);
  // }, [stepData]);

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
    // console.log("Running");
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
    setBoardData(updatedData[updatedData.length - 1]);
    setStepData(updatedData);
  };

  const renderBoard = (data: any) => {
    return data.map((datarow: any) => {
      return datarow.map((dataitem: any) => {
        return (
          <div key={dataitem.x * datarow.length + dataitem.y}>
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
          </div>
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
        <Button
          variant="gradient"
          gradient={{ from: "indigo", to: "cyan" }}
          onClick={handleUndoClick}
        >
          Undo
        </Button>
        <Space />
      </div>
      {renderBoard(boardData)}
    </div>
  );
};

export default Board;
