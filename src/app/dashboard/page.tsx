"use client";

import config from "../../amplifyconfiguration.json";
import { Amplify } from "aws-amplify";
import { getCurrentUser, fetchUserAttributes, signOut } from "aws-amplify/auth";
import { Button } from "@mantine/core";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  Amplify.configure(config);

  const router = useRouter();

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
      <h1>Dashboard </h1>

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
      </Button>
    </>
  );
}
