"use client";

import {
  Group,
  Title,
  Text,
  Stack,
  Grid,
  GridCol,
  TextInput,
  PasswordInput,
  Button,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Amplify } from "aws-amplify";
import config from "../../aws-exports";
import { signIn, getCurrentUser } from "aws-amplify/auth";

Amplify.configure(config);
export default function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const [userNameError, setUserNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [loginDisabled, setLoginDisabled] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);

  const router = useRouter();

  const handleEmpty = (userName: string, password: string) => {
    if (userName == "" || password == "") {
      setLoginDisabled(true);
    } else {
      setLoginDisabled(false);
    }
  };

  const handleClick = async () => {
    setLoginLoading(true);
    console.log(userName);
    console.log(password);
    try {
      await signIn({
        username: userName,
        password: password,
      });
      router.push("/dashboard");
    } catch (error) {
      setUserNameError("Username may not exist.");
      setPasswordError("Password may be incorrect.");
      setLoginDisabled(true);
      setLoginLoading(false);
      console.log(error);
    }
  };

  const isAuth = async () => {
    try {
      await getCurrentUser();
      router.push("/dashboard");
    } catch (error) {}
  };

  useEffect(() => {
    isAuth();
  }, []);

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
                  value={userName}
                  error={userNameError}
                  onChange={(e) => {
                    handleEmpty(e.currentTarget.value, password);
                    setUserName(e.currentTarget.value);

                    if (e.currentTarget.value == "") {
                      setUserNameError("Username can not be empty");
                    } else {
                      setUserNameError("");
                    }
                  }}
                />
              </Stack>

              <Stack gap={0}>
                <Text size="1.25rem">Password:</Text>
                <PasswordInput
                  variant="filled"
                  size="md"
                  mt={"xs"}
                  value={password}
                  error={passwordError}
                  onChange={(e) => {
                    handleEmpty(userName, e.currentTarget.value);
                    setPassword(e.currentTarget.value);

                    if (e.currentTarget.value == "") {
                      setPasswordError("Password can not be empty");
                    } else {
                      setPasswordError("");
                    }
                  }}
                />
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
                <Button
                  disabled={loginDisabled}
                  loading={loginLoading}
                  color="green.8"
                  size="lg"
                  onClick={handleClick}
                >
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
