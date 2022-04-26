export const getMines = (data: any) => {
  let mineArray: any[] = [];

  data.map((datarow: any) => {
    datarow.map((dataitem: any) => {
      if (dataitem.isMine) {
        mineArray.push(dataitem);
      }
    });
  });

  return mineArray;
};

export const getFlags = (data: any) => {
  let flagArray: any[] = [];

  data.map((datarow: any) => {
    datarow.map((dataitem: any) => {
      if (dataitem.isFlagged) {
        flagArray.push(dataitem);
      }
    });
  });

  return flagArray;
};

export const getHidden = (data: any) => {
  let hiddenArray: any[] = [];

  data.map((datarow: any) => {
    datarow.map((dataitem: any) => {
      if (!dataitem.isRevealed) {
        hiddenArray.push(dataitem);
      }
    });
  });

  return hiddenArray;
};

export const getRandomNumber = (dimension: any) => {
  return Math.floor(Math.random() * 1000 + 1) % dimension;
};

export const createEmptyArray = (height: number, width: number) => {
  let data: any[] = [];

  for (let i = 0; i < height; i++) {
    data.push([]);
    for (let j = 0; j < width; j++) {
      data[i][j] = {
        x: i,
        y: j,
        isMine: false,
        neighbour: 0,
        isRevealed: false,
        isEmpty: false,
        isFlagged: false,
      };
    }
  }
  return data;
};
// plant mines on the board
export const plantMines = (
  data: any,
  height: number,
  width: number,
  mines: number
) => {
  let randomx,
    randomy,
    minesPlanted = 0;

  while (minesPlanted < mines) {
    randomx = getRandomNumber(width);
    randomy = getRandomNumber(height);
    if (!data[randomx][randomy].isMine) {
      data[randomx][randomy].isMine = true;
      minesPlanted++;
    }
  }

  return data;
};

