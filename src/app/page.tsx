"use client";
import { Stack, Title, Button, Group, Paper } from "@mantine/core";
import { useRouter } from "next/navigation";
import config from "../aws-exports";
import { Amplify } from "aws-amplify";
import { getCurrentUser } from "aws-amplify/auth";
import { useEffect } from "react";

Amplify.configure(config);

export default function Home() {
  const router = useRouter();

  // Checks if the current user is authenticated.
  const isAuth = async () => {
    try {
      await getCurrentUser();
      router.push("/dashboard");
    } catch (e) {
      console.log(e);
      console.log("no user");
    }
  };

  // Runs on first page render.
  useEffect(() => {
    isAuth();
  }, []);

  return (
    <Stack mih={"100vh"} bg={"green.8"}>
      <Title ml={"xl"} c={"white"} size={"2.7rem"} order={1}>
        TODO-fy
      </Title>

      <Stack align="center" justify="center" h={"80%"}>
        <Title
          c={"white"}
          size={"6rem"}
          style={{ textAlign: "center" }}
          px={10}
        >
          Your all in one productivity tool
        </Title>

        <Title
          size={"2rem"}
          c={"white"}
          style={{ textAlign: "center" }}
          px={10}
        >
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

        <Paper w={"60%"} mb={100} shadow="xl">
          <Stack style={{ border: "2px solid gray" }}>
            <video autoPlay muted loop width={"100%"}>
              <source src="./Demo.mp4" type="video/mp4" />
            </video>
          </Stack>
        </Paper>
      </Stack>
    </Stack>
  );
}
