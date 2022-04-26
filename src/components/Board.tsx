import React from "react";
import {
  createEmptyArray,
  getFlags,
  getHidden,
  getMines,
  getRandomNumber,
  plantMines,
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

  React.useEffect(() => {
    setBoardData(initBoardData(height, width, mines));
  }, []);

  React.useEffect(() => {
    let steps = JSON.parse(localStorage.getItem("stepHistory")!);

    // console.log(steps);
    // console.log(steps.length);
  }, [boardData]);

  React.useEffect(() => {
    setStepData([...stepData, boardData]);
  }, [boardData]);

  React.useEffect(() => {
    localStorage.setItem("stepHistory", JSON.stringify(stepData));
  }, [stepData]);

  const initBoardData = (height: number, width: number, mines: number) => {
    let data = createEmptyArray(height, width);
    data = plantMines(data, height, width, mines);
    data = getNeighbours(data, height, width);
    // console.log(data);
    return data;
  };

  const traverseBoard = (x: number, y: number, data: any) => {
    const el = [];

    //up
    if (x > 0) {
      el.push(data[x - 1][y]);
    }

    //down
    if (x < height - 1) {
      el.push(data[x + 1][y]);
    }

    //left
    if (y > 0) {
      el.push(data[x][y - 1]);
    }

    //right
    if (y < width - 1) {
      el.push(data[x][y + 1]);
    }

    // top left
    if (x > 0 && y > 0) {
      el.push(data[x - 1][y - 1]);
    }

    // top right
    if (x > 0 && y < width - 1) {
      el.push(data[x - 1][y + 1]);
    }

    // bottom right
    if (x < height - 1 && y < width - 1) {
      el.push(data[x + 1][y + 1]);
    }

    // bottom left
    if (x < height - 1 && y > 0) {
      el.push(data[x + 1][y - 1]);
    }

    return el;
  };

  // get number of neighbouring mines for each board cell
  const getNeighbours = (data: any, height: number, width: number) => {
    let updatedData = data;

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (data[i][j].isMine !== true) {
          let mine = 0;
          const area = traverseBoard(data[i][j].x, data[i][j].y, data);
          area.map((value: any) => {
            if (value.isMine) {
              mine++;
            }
          });
          if (mine === 0) {
            updatedData[i][j].isEmpty = true;
          }
          updatedData[i][j].neighbour = mine;
        }
      }
    }

    return updatedData;
  };

  // reveals the whole board
  const revealBoard = () => {
    let updatedData = [...boardData];

    updatedData.map((datarow) => {
      datarow.map((dataitem: any) => {
        dataitem.isRevealed = true;
      });
    });

    setBoardData(updatedData);
  };

  /* reveal logic for empty cell */
  const revealEmpty = (x: number, y: number, data: any) => {
    let area = traverseBoard(x, y, data);

    area.map((value) => {
      if (
        !value.isFlagged &&
        !value.isRevealed &&
        (value.isEmpty || !value.isMine)
      ) {
        data[value.x][value.y].isRevealed = true;
        if (value.isEmpty) {
          revealEmpty(value.x, value.y, data);
        }
      }
    });

    return data;
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

    let updatedData = [...boardData];
    updatedData[x][y].isFlagged = false;
    updatedData[x][y].isRevealed = true;

    if (updatedData[x][y].isEmpty) {
      updatedData = revealEmpty(x, y, updatedData);
    }

    if (getHidden(updatedData).length === mines) {
      setMineCount(0);
      setGameStatus("You Win");
      alert("You Win");
    }

    setBoardData(updatedData);
    setMineCount(mines - getFlags(updatedData).length);
  };

  const contextMenu = (e: any) => {
    e.preventDefault();
    console.log(e);
    return;
  };

  const clickMe = (x: number, y: number) => (event: any) => {
    event.preventDefault();
    console.log("test");
  };

  const handleContextMenu = (
    e: any,
    x: number,
    y: number
  ) /* => (e: any) */ => {
    e.preventDefault();
    console.log("Running");
    let updatedData = [...boardData];
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
        <span
          className="info"
          onContextMenu={(e) => {
            e.preventDefault();
            console.log("first");
          }}
        >
          Mines remaining: {mineCount}
        </span>
        <h1 className="info" onContextMenu={contextMenu}>
          {gameStatus}
        </h1>
        <Timer />
      </div>
      {renderBoard(boardData)}
    </div>
  );
};

export default Board;
