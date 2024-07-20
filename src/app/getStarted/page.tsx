"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  signUp,
  confirmSignUp,
  getCurrentUser,
  signIn,
} from "aws-amplify/auth";
import config from "../../aws-exports";
import { Amplify } from "aws-amplify";
import { post } from "aws-amplify/api";
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
import * as EmailValidator from "email-validator";
import PasswordValidator from "password-validator";

Amplify.configure(config);

const passwordSchema = new PasswordValidator();
passwordSchema
  .is()
  .min(8)
  .is()
  .max(100)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits(1)
  .has()
  .symbols(1)
  .has()
  .not()
  .spaces();

export default function GetStarted() {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [theme, setTheme] = useState(DEFAULT_THEME.colors.green[8]);

  const [userName, setUserName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [projectTitle, setProjectTitle] = useState("");

  const [userNameError, setUserNameError] = useState("");
  const [displayNameError, setDisplayNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [verificationCode, setVerificationCode] = useState("");

  const [getStartedDisabled, setGetStartedDisabled] = useState(true);
  const [getStartedLoading, setGetStartedLoading] = useState(false);

  const [verifyDisabled, setVerifyDisabled] = useState(true);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [pinError, setPinError] = useState(false);

  const [projectTitleError, setProjectTitleError] = useState("");
  const [projectDisabled, setProjectDisabled] = useState(true);
  const [projectLoading, setProjectLoading] = useState(false);

  const themeArray = [
    DEFAULT_THEME.colors.green[8],
    DEFAULT_THEME.colors.blue[8],
    DEFAULT_THEME.colors.red[8],
    DEFAULT_THEME.colors.violet[8],
    DEFAULT_THEME.colors.orange[8],
    DEFAULT_THEME.colors.cyan[8],
    DEFAULT_THEME.colors.teal[8],
    DEFAULT_THEME.colors.lime[8],
  ];

  const nextSlide = () => {
    setActive((current) => (current < 3 ? current + 1 : current));
  };

  const prevSlide = () => {
    setActive((current) => (current > 0 ? current - 1 : current));
  };

  const addUser = async () => {
    try {
      const restOperation = post({
        apiName: "todofy",
        path: "/TODO-fy/addUser",
        options: {
          body: {
            username: userName,
            email: email,
            displayName: displayName,
          },
        },
      });
      const { body } = await restOperation.response;

      const myJSON = await body.json();
      console.log(myJSON);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetStartedButton = (
    userName: string,
    displayName: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
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
      setGetStartedDisabled(true);
    } else {
      setGetStartedDisabled(false);
    }
  };

  const handleSignUp = async () => {
    console.log(userName);
    console.log(displayName);
    console.log(email);
    console.log(password);
    console.log(confirmPassword);

    try {
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
    } catch (e) {
      console.log("Login Error:", e);

      setGetStartedLoading(false);
      setGetStartedDisabled(true);
      setUserNameError("This username as been taken.");
    }
  };

  const handleVerification = async () => {
    setVerifyLoading(true);
    console.log(verificationCode);
    try {
      await confirmSignUp({
        username: userName,
        confirmationCode: verificationCode,
      });
      await addUser();
      nextSlide();
    } catch (error) {
      console.log((error as Error).name);
      if ((error as Error).name == "AliasExistsException") {
        setEmailError("This email as already been taken.");
        setGetStartedLoading(false);
        setGetStartedDisabled(true);
        prevSlide();
        setPinError(false);
      } else {
        setPinError(true);
      }
      setVerificationCode("");
      setVerifyDisabled(true);
      setVerifyLoading(false);
    }
  };

  type sqlSchema = {
    result: { insertId: number };
  };

  const handleFirstProject = async () => {
    setProjectLoading(true);
    try {
      await signIn({ username: userName, password: password });

      const themeID = themeArray.indexOf(theme) + 1;
      const payload = {
        title: projectTitle,
        theme: themeID,
        owner: userName,
      };

      const request = post({
        apiName: "todofy",
        path: "/TODO-fy/addProject",
        options: {
          body: payload,
        },
      });

      const { body } = await request.response;
      const response = (await body.json()) as sqlSchema;
      console.log(response.result.insertId);
      router.push(`/project/${response.result.insertId}`);
    } catch (e) {
      console.log(e);
    }
  };

  const isAuth = async () => {
    try {
      await getCurrentUser();
      router.push("/dashboard");
    } catch (e) {
      console.log(e);

      console.log("no user");
    }
  };

  useEffect(() => {
    isAuth();
  }, []);

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
                    error={userNameError}
                    onChange={(e) => {
                      setUserName(e.currentTarget.value);
                      if (e.currentTarget.value == "") {
                        setUserNameError("Username can not be empty.");
                      } else {
                        setUserNameError("");
                      }

                      handleGetStartedButton(
                        e.currentTarget.value,
                        displayName,
                        email,
                        password,
                        confirmPassword
                      );
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
                    error={displayNameError}
                    onChange={(e) => {
                      setDisplayName(e.currentTarget.value);
                      if (e.currentTarget.value == "") {
                        setDisplayNameError("Displayname can not be empty.");
                      } else {
                        setDisplayNameError("");
                      }
                      handleGetStartedButton(
                        userName,
                        e.currentTarget.value,
                        email,
                        password,
                        confirmPassword
                      );
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
                    error={emailError}
                    onChange={(e) => {
                      let enable = false;
                      handleGetStartedButton(
                        userName,
                        displayName,
                        e.currentTarget.value,
                        password,
                        confirmPassword
                      );

                      setEmail(e.currentTarget.value);
                      if (e.currentTarget.value == "") {
                        setEmailError("Email can not be empty.");
                      } else {
                        if (EmailValidator.validate(e.currentTarget.value)) {
                          setEmailError("");
                          setGetStartedDisabled(false);
                        } else {
                          setEmailError("This is not an email.");
                          setGetStartedDisabled(true);
                        }
                      }
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
                    error={passwordError}
                    onChange={(e) => {
                      handleGetStartedButton(
                        userName,
                        displayName,
                        email,
                        e.currentTarget.value,
                        confirmPassword
                      );
                      setPassword(e.currentTarget.value);

                      if (e.currentTarget.value == "") {
                        setPasswordError("Password can not be empty.");
                      } else {
                        if (passwordSchema.validate(e.currentTarget.value)) {
                          setPasswordError("");

                          if (e.currentTarget.value == confirmPassword) {
                            setConfirmPasswordError("");
                            setGetStartedDisabled(false);
                          } else {
                            setConfirmPasswordError(
                              "Passwords does not match."
                            );
                            setGetStartedDisabled(true);
                          }
                        } else {
                          setPasswordError(
                            "Password must have at least 8 characters and must have at least lowercase, uppercase, number and special character."
                          );
                          setGetStartedDisabled(true);
                        }
                      }
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
                    error={confirmPasswordError}
                    onChange={(e) => {
                      handleGetStartedButton(
                        userName,
                        displayName,
                        email,
                        password,
                        e.currentTarget.value
                      );

                      setConfirmPassword(e.currentTarget.value);
                      if (e.currentTarget.value == "") {
                        setConfirmPasswordError(
                          "Confirm password can not be empty."
                        );
                      } else {
                        if (passwordSchema.validate(e.currentTarget.value)) {
                          // setConfirmPasswordError("");
                          // setGetStartedDisabled(false);

                          if (e.currentTarget.value == password) {
                            setConfirmPasswordError("");
                            setGetStartedDisabled(false);
                          } else {
                            setConfirmPasswordError(
                              "Passwords does not match."
                            );
                            setGetStartedDisabled(true);
                          }
                        } else {
                          setConfirmPasswordError(
                            "Password must have at least 8 characters and must have at least lowercase, uppercase, number and special character."
                          );
                          setGetStartedDisabled(true);
                        }
                      }
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

                  <Button
                    disabled={getStartedDisabled}
                    loading={getStartedLoading}
                    color="green.8"
                    size="md"
                    onClick={() => {
                      setGetStartedLoading(true);
                      handleSignUp();
                    }}
                  >
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
                  error={pinError}
                  onComplete={(e) => {
                    setVerificationCode(e);
                    setVerifyDisabled(false);
                  }}
                />
                <Text
                  style={{ fontWeight: "bold" }}
                  c={"red"}
                  hidden={!pinError}
                >
                  You entered a wrong verification code.
                </Text>
                <Button
                  mt={24}
                  color="green.8"
                  size="lg"
                  onClick={handleVerification}
                  disabled={verifyDisabled}
                  loading={verifyLoading}
                >
                  Verify
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
                    value={projectTitle}
                    error={projectTitleError}
                    onChange={(e) => {
                      setProjectTitle(e.currentTarget.value);

                      if (e.currentTarget.value == "") {
                        setProjectTitleError(
                          "You must give this project a name."
                        );
                        setProjectDisabled(true);
                      } else {
                        setProjectTitleError("");
                        setProjectDisabled(false);
                      }
                    }}
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
                    swatches={themeArray}
                  />
                </Stack>

                <Button
                  disabled={projectDisabled}
                  loading={projectLoading}
                  color="green.8"
                  size="lg"
                  onClick={handleFirstProject}
                >
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
