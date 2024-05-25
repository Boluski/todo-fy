"use client";

import { Hub } from "aws-amplify/utils";
import config from "../../amplifyconfiguration.json";
import { Amplify } from "aws-amplify";
import { getCurrentUser, fetchUserAttributes, signOut } from "aws-amplify/auth";
import { Button } from "@mantine/core";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  Amplify.configure(config);

  const router = useRouter();

  Hub.listen("auth", ({ payload }) => {
    switch (payload.event) {
      case "signedIn":
        console.log("signedIn");
        break;
      case "signedOut":
        console.log("signedOut");
        router.push("/");
        break;
    }
  });

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

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
  useEffect(() => {
    handleClick();
  }, []);

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
        }}
      >
        Sign Out
      </Button>
    </>
  );
}
