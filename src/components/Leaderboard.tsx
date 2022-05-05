import { Table } from "@mantine/core";
import React from "react";
import { getAll } from "../api";

const Leaderboard = () => {
  const [data, setData] = React.useState<any[]>([]);

  React.useEffect(() => {
    const getData = async () => {
      const result = await getAll();
      setData(result);
    };

    getData();
  }, []);

  const header = (
    <tr>
      <th>Top</th>
      <th>Player</th>
      <th>Score</th>
    </tr>
  );

  const rows = data.map((element, index: number) => (
    <tr key={index * Math.random()}>
      <td>{index + 1}</td>
      <td>{element.username}</td>
      <td>{element.highest_score}</td>
    </tr>
  ));

  return (
    <Table highlightOnHover verticalSpacing="sm">
      <thead>{header}</thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default Leaderboard;
