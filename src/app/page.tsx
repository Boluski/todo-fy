"use client";
import { Input, Stack, Center, Title, Button, Group } from "@mantine/core";
import { useRouter } from "next/navigation";

export default function Home() {
  const xray = {
    root: {
      outline: "2px solid blue",
    },
  };

  const router = useRouter();

  return (
    <Stack h={"100vh"} styles={xray} bg={"green.8"}>
      <Title ml={"xl"} c={"white"} size={"2.7rem"} order={1}>
        TODO-fy
      </Title>

      <Stack align="center" justify="center" h={"80%"}>
        <Title c={"white"} size={"6rem"}>
          Your all in one productivity tool
        </Title>

        <Title size={"2rem"} c={"white"}>
          Speed up your productivity with TODO-fy! Productivity as never been
          easier
        </Title>
        <Group w={"22rem"} justify="space-between" mt={"xl"}>
          <Button
            onClick={() => router.push("/getStarted")}
            color="white"
            variant="light"
            size="xl"
          >
            Get Started
          </Button>
          <Button
            onClick={() => router.push("/login")}
            color="white"
            variant="outline"
            size="xl"
          >
            Login
          </Button>
        </Group>
      </Stack>
    </Stack>
  );
}