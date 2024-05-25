"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signUp,
  confirmSignUp,
  getCurrentUser,
  signIn,
} from "aws-amplify/auth";
import config from "../../amplifyconfiguration.json";
import { Amplify } from "aws-amplify";
import {
  Stack,
  Stepper,
  StepperStep,
  Group,
  Button,
  Text,
  TextInput,
  PasswordInput,
  Title,
  ColorPicker,
  ColorSwatch,
  DEFAULT_THEME,
  PinInput,
} from "@mantine/core";

export default function GetStarted() {
  const xray = {
    root: {
      outline: "2px solid blue",
    },
  };

  const router = useRouter();
  const [active, setActive] = useState(0);
  const [theme, setTheme] = useState(DEFAULT_THEME.colors.green[8]);
  const nextSlide = () => {
    setActive((current) => (current < 3 ? current + 1 : current));
  };

  Amplify.configure(config);

  const [userName, setUserName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [verificationCode, setVerificationCode] = useState("");

  const handleSignUp = async () => {
    console.log(userName);
    console.log(displayName);
    console.log(email);
    console.log(password);
    console.log(confirmPassword);
    if (
      userName == "" ||
      displayName == "" ||
      email == "" ||
      password == "" ||
      confirmPassword == ""
    ) {
      console.log("Empty fields");
    } else {
      try {
        if (password == confirmPassword) {
          await signUp({
            username: userName,
            password: password,
            options: {
              userAttributes: {
                email: email,
              },
            },
          });
          nextSlide();
        } else {
          console.log("Password don't match");
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleVerification = async () => {
    console.log(verificationCode);
    try {
      await confirmSignUp({
        username: userName,
        confirmationCode: verificationCode,
      });
      nextSlide();
    } catch (e) {
      console.log(e);
    }
  };

  const handleFirstProject = async () => {
    try {
      await signIn({ username: userName, password: password });
    } catch (e) {
      console.log(e);
    }

    router.push("/dashboard");
  };

  return (
    <>
      <Stack h={"100vh"} bg={"green.8"} justify="center" align="center">
        <Stack bg={"white"} miw={"50rem"} mih={"40rem"} w={"45%"}>
          <Stepper
            active={active}
            onStepClick={setActive}
            allowNextStepsSelect={false}
            color="green.8"
            size="xl"
            p={"xl"}
          >
            <StepperStep
              allowStepSelect={false}
              label="First step"
              description="Create an account"
            >
              <Stack>
                <Stack gap={0}>
                  <Text size="1.25rem">Username:</Text>
                  <TextInput
                    value={userName}
                    onChange={(e) => {
                      setUserName(e.currentTarget.value);
                    }}
                    color="green.8"
                    variant="filled"
                    size="md"
                    mt={"xs"}
                  />
                </Stack>
                <Stack gap={0}>
                  <Text size="1.25rem">Display Name:</Text>
                  <TextInput
                    value={displayName}
                    onChange={(e) => {
                      setDisplayName(e.currentTarget.value);
                    }}
                    color="green.8"
                    variant="filled"
                    size="md"
                    mt={"xs"}
                  />
                </Stack>
                <Stack gap={0}>
                  <Text size="1.25rem">Email Address:</Text>
                  <TextInput
                    inputMode="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.currentTarget.value);
                    }}
                    color="green.8"
                    variant="filled"
                    size="md"
                    mt={"xs"}
                  />
                </Stack>

                <Stack gap={0}>
                  <Text size="1.25rem">Password:</Text>
                  <PasswordInput
                    value={password}
                    onChange={(e) => {
                      setPassword(e.currentTarget.value);
                    }}
                    variant="filled"
                    size="md"
                    mt={"xs"}
                  />
                </Stack>

                <Stack gap={0}>
                  <Text size="1.25rem">Confirm Password:</Text>
                  <PasswordInput
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.currentTarget.value);
                    }}
                    variant="filled"
                    size="md"
                    mt={"xs"}
                  />
                </Stack>
                <Group justify="flex-end">
                  <Button
                    onClick={() => router.push("/login")}
                    variant="transparent"
                    color="green.8"
                    size="lg"
                  >
                    Login
                  </Button>

                  <Button color="green.8" size="md" onClick={handleSignUp}>
                    Get Started
                  </Button>
                </Group>
              </Stack>
            </StepperStep>

            <StepperStep
              allowStepSelect={false}
              label="Second step"
              description="Verify email"
            >
              <Stack
                h={"30rem"}
                // styles={xray}
                align="center"
                justify="center"
                gap={0}
              >
                <Title c={"green.8"} order={1} size={"5rem"}>
                  Verify Your Email
                </Title>
                <Title
                  order={2}
                  size={"1.2rem"}
                  w={"40rem"}
                  style={{ textAlign: "center" }}
                >
                  We have sent you an email with a code to verify that you are
                  human. Check your spam folder, if it's not in your inbox.
                </Title>
                <PinInput
                  length={6}
                  mt={24}
                  size="xl"
                  inputMode="numeric"
                  placeholder=""
                  value={verificationCode}
                  onComplete={(e) => {
                    setVerificationCode(e);
                  }}
                />
                <Button
                  mt={24}
                  color="green.8"
                  size="lg"
                  onClick={handleVerification}
                >
                  Email Verified
                </Button>
              </Stack>
            </StepperStep>

            <StepperStep
              allowStepSelect={false}
              label="Final step"
              description="Your project"
            >
              <Stack justify="center" h={"30rem"}>
                <Stack gap={0}>
                  <Text size="1.25rem">Project Name:</Text>
                  <TextInput
                    color="green.8"
                    variant="filled"
                    size="md"
                    mt={"xs"}
                  />
                </Stack>

                <Stack gap={0}>
                  <Group>
                    <Text size="1.25rem">Theme:</Text>
                    <ColorSwatch color={theme} />
                  </Group>

                  <ColorPicker
                    format="hex"
                    withPicker={false}
                    fullWidth
                    value={theme}
                    onChange={setTheme}
                    focusable={true}
                    swatchesPerRow={8}
                    swatches={[
                      DEFAULT_THEME.colors.green[8],
                      DEFAULT_THEME.colors.blue[8],
                      DEFAULT_THEME.colors.red[8],
                      DEFAULT_THEME.colors.violet[8],
                      DEFAULT_THEME.colors.orange[8],
                      DEFAULT_THEME.colors.cyan[8],
                      DEFAULT_THEME.colors.teal[8],
                      DEFAULT_THEME.colors.lime[8],
                    ]}
                  />
                </Stack>

                <Button color="green.8" size="lg" onClick={handleFirstProject}>
                  Create Project
                </Button>
              </Stack>
            </StepperStep>
          </Stepper>
        </Stack>
      </Stack>
    </>
  );
}