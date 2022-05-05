const baseUrl = "https://minesweeper-data.herokuapp.com/api/";

export const getAll = async () => {
  const response = await fetch(`${baseUrl}/getall`);
  const data = await response.json();
  return data;
};

export const updateScore = async (userId: string, newScore: number) => {
  const response = await fetch(
    `${baseUrl}/update/${userId}/highscore&${newScore}`,
    {
      method: "POST",
      // body: JSON.stringify({ highest_score: newScore }),
    }
  );

  const data = await response.json();
  return data;
};

export const createUser = async (username: string, playerName: string) => {
  const response = await fetch(`${baseUrl}/create`, {
    method: "POST",
    body: JSON.stringify({
      username: username,
      name: playerName,
    }),
  });

  const data = response.json();
  return data;
};
