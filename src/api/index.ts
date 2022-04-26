export const getAll = async () => {
  const response = await fetch(
    "https://minesweeper-data.herokuapp.com/api/getall"
  );
  const data = await response.json();
  return data;
};
