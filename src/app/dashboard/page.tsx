"use client";

import config from "../../aws-exports";
import { Amplify } from "aws-amplify";
import { getCurrentUser, fetchUserAttributes, signOut } from "aws-amplify/auth";
import {
  Button,
  Title,
  Group,
  Stack,
  Drawer,
  Avatar,
  Text,
  SimpleGrid,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FiUser } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { xray } from "../utils/xray";
import ProjectCard from "../components/ProjectCard";

Amplify.configure(config);

export default function Dashboard() {
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    handleClick();
  }, []);

  const handleClick = async () => {
    try {
      const { username } = await getCurrentUser();
      const email = await fetchUserAttributes();

      console.log(email.email);

      setUserName(username);
      setUserEmail(email.email as string);
    } catch (e) {
      console.log(e);
      router.push("/");
    }
  };

  return (
    <>
      <Stack px={20} pt={10} bg={"gray.0"} mih={"100vh"}>
        <Group justify="space-between">
          <Title c={"green.8"} order={1} size={"2.5rem"}>
            TODO-fy
          </Title>
          <Avatar
            name="Boluwatife Ajibola"
            color="initials"
            size={"lg"}
            onClick={open}
          />
        </Group>
        <Group px={60} justify="space-between">
          <Title order={2} size={"3rem"}>
            Projects
          </Title>
          <Button color="green.8" size="lg">
            Create New Project
          </Button>
        </Group>
        <SimpleGrid px={60} cols={3} spacing={"xl"} verticalSpacing={"xl"}>
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
        </SimpleGrid>
      </Stack>
      // ----------------------------------
      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        title={"User Account"}
        overlayProps={{ blur: 4 }}
      >
        <Stack>
          <Title>Boluwatife Ajibola</Title>
          <Group>
            <Avatar name="Boluwatife Ajibola" color="initials" size={"xl"} />
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
      {/* <h1>Dashboard </h1>

      <h1>UserName: {userName}</h1>
      <h1>Email Address: {userEmail}</h1>
      <Button
        onClick={async () => {
          await signOut();
          setUserName("");
          setUserEmail("");
          router.push("/");
        }}
      >
        Sign Out
      </Button> */}
    </>
  );
}
