"use client";

import {
  Group,
  Title,
  Text,
  Stack,
  Center,
  Grid,
  GridCol,
  Fieldset,
  TextInput,
  PasswordInput,
  Button,
  Anchor,
} from "@mantine/core";
import { useRouter } from "next/navigation";

export default function Login() {
  const xray = {
    root: {
      outline: "2px solid blue",
    },
  };

  const router = useRouter();

  return (
    <>
      <Grid gutter={0}>
        <GridCol span={6}>
          <Stack
            w={"100%"}
            h={"100vh"}
            bg={"green.8"}
            justify="center"
            align="center"
          >
            <Title size={"4rem"} c={"white"}>
              Welcome back!
            </Title>
            <Text size={"2rem"} c={"white"}>
              Time to get back to the grind.
            </Text>
          </Stack>
        </GridCol>

        <GridCol span={6}>
          <Stack w={"100%"} h={"100vh"} justify="center" align="center">
            <Stack maw={"40rem"} w={"80%"}>
              <Title c={"green.8"}>Login</Title>
              <Stack gap={0}>
                <Text size="1.25rem">Username:</Text>
                <TextInput
                  color="green.8"
                  variant="filled"
                  size="md"
                  mt={"xs"}
                />
              </Stack>

              <Stack gap={0}>
                <Text size="1.25rem">Password:</Text>
                <PasswordInput variant="filled" size="md" mt={"xs"} />
              </Stack>

              <Group justify="flex-end" mt={"md"}>
                <Button
                  onClick={() => router.push("/getStarted")}
                  variant="transparent"
                  color="green.8"
                  size="lg"
                >
                  Sign Up
                </Button>
                <Button color="green.8" size="lg">
                  Login
                </Button>
              </Group>
            </Stack>
          </Stack>
        </GridCol>
      </Grid>
    </>
  );
}
