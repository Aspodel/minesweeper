import {
  Text,
  Center,
  Container,
  Title,
  Stack,
  Space,
  TextInput,
  Button,
} from "@mantine/core";
import React from "react";
import { getAll } from "../api";

const Home = () => {
  React.useEffect(() => {
    const getData = async () => {
      const result = await getAll();
      console.log("Running");
      console.log(result);
    };

    getData();
  }, []);

  React.useEffect(() => {});
  return (
    <div className="home">
      <Container>
        <Stack sx={{ textAlign: "center" }}>
          <Title order={1}>Minesweeper</Title>
          <Text size="xl">No Sweep, No Invasion</Text>
          <TextInput
            placeholder="Your name"
            size="md"
            required
            sx={{ width: 500, margin: "auto" }}
          />
          <Button
            size="lg"
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan" }}
            sx={{ width: 200, margin: "auto" }}
          >
            Let's go
          </Button>
        </Stack>
      </Container>
    </div>
  );
};

export default Home;
