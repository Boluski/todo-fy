"use client";

import config from "../../aws-exports";
import { Amplify } from "aws-amplify";
import { getCurrentUser, fetchUserAttributes, signOut } from "aws-amplify/auth";
import { IoMdAdd } from "react-icons/io";
import {
  Button,
  Title,
  Group,
  Stack,
  Drawer,
  Avatar,
  Text,
  SimpleGrid,
  LoadingOverlay,
  Modal,
  TextInput,
  ColorPicker,
  ColorSwatch,
  DEFAULT_THEME,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FiUser } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { xray } from "../utils/xray";
import ProjectCard from "../components/ProjectCard";
import { get, post } from "aws-amplify/api";

Amplify.configure(config);

export default function Dashboard() {
  const [projectTitle, setProjectTitle] = useState("");
  const [theme, setTheme] = useState(DEFAULT_THEME.colors.green[8]);
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
  type sqlData = {
    result: [
      {
        displayName: string;
      }
    ];
  };

  type project = {
    PID: number;
    title: string;
    main: string;
  };

  type sqlProjects = {
    result: project[];
  };

  type sqlSchema = {
    result: { insertId: number };
  };

  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, { toggle }] = useDisclosure(true);
  const [openedModal, setOpenModal] = useState(false);

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userDisplayName, setUserDisplayName] = useState("");
  const [userProjects, setUserProjects] = useState<project[]>([]);

  useEffect(() => {
    handleClick();
    toggle();
  }, []);

  const handleFirstProject = async () => {
    try {
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

  const handleClick = async () => {
    try {
      const { username } = await getCurrentUser();
      const email = await fetchUserAttributes();

      try {
        const request = get({
          apiName: "todofy",
          path: "/TODO-fy/getUser",
          options: {
            queryParams: { username: username },
          },
        });

        let { body } = await request.response;

        const response = (await body.json()) as sqlData;
        setUserDisplayName(response.result[0].displayName);
      } catch (error) {
        console.log(error);
      }

      try {
        const request = get({
          apiName: "todofy",
          path: "/TODO-fy/getUserProjects",
          options: {
            queryParams: { username: username },
          },
        });

        let { body } = await request.response;

        const response = (await body.json()) as sqlProjects;
        console.log("Results:", response.result);
        setUserProjects(response.result);
      } catch (error) {
        console.log(error);
      }

      setUserName(username);
      setUserEmail(email.email as string);
    } catch (e) {
      console.log(e);
      router.push("/");
    }
  };

  return (
    <>
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ blur: 6 }}
        loaderProps={{ color: "green.8" }}
      />
      <Stack px={20} pt={10} bg={"gray.0"} mih={"100vh"}>
        <Group justify="space-between">
          <Title c={"green.8"} order={1} size={"2.5rem"}>
            TODO-fy
          </Title>
          <Avatar
            name={userDisplayName}
            color="initials"
            size={"lg"}
            onClick={open}
          />
        </Group>
        <Group px={60} justify="space-between">
          <Title order={2} size={"3rem"}>
            Projects
          </Title>
          <Button
            radius={"md"}
            color="green.8"
            size="lg"
            rightSection={<IoMdAdd size={"2rem"} />}
            onClick={() => setOpenModal(true)}
          >
            Create New Project
          </Button>
        </Group>
        <SimpleGrid px={60} cols={3} spacing={"xl"} verticalSpacing={"xl"}>
          {userProjects.map((project) => (
            <ProjectCard
              key={project.PID}
              id={project.PID}
              title={project.title}
              color={project.main}
            />
          ))}
        </SimpleGrid>
      </Stack>
      {/* // ---------------------------------- */}
      <Modal
        opened={openedModal}
        // scrollAreaComponent={ScrollArea.Autosize}
        onClose={() => setOpenModal(false)}
        title={"New Project"}
        centered
        size={"xl"}
      >
        <Stack
        // justify="center"
        // h={"30rem"}
        >
          <Stack gap={0}>
            <Text size="1.25rem">Project Name:</Text>
            <TextInput
              color="green.8"
              variant="filled"
              size="md"
              mt={"xs"}
              value={projectTitle}
              onChange={(e) => {
                setProjectTitle(e.currentTarget.value);
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

          <Button color="green.8" size="lg" onClick={handleFirstProject}>
            Create Project
          </Button>
        </Stack>
      </Modal>
      {/* // ---------------------------------- */}
      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        title={"User Account"}
        overlayProps={{ blur: 4 }}
      >
        <Stack>
          <Title>{userDisplayName}</Title>
          <Group>
            <Avatar name={userDisplayName} color="initials" size={"xl"} />
            <Stack
              // styles={xray}
              justify={"start"}
              gap={10}
            >
              <Text size="1.2rem" style={{ fontWeight: "bold" }}>
                {userName}
              </Text>
              <Text size="1rem">{userEmail}</Text>
            </Stack>
          </Group>
          <Button
            color="green.8"
            onClick={async () => {
              await signOut();
              setUserName("");
              setUserEmail("");
              router.push("/");
            }}
          >
            Sign Out
          </Button>
        </Stack>
      </Drawer>
    </>
  );
}
