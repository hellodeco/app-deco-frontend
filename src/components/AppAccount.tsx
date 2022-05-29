import { Flex, Heading, Divider, Button } from "@chakra-ui/react";
import React from "react";
import type { User } from "../types/types";

interface AppAccountProps {
  userData: User;
}

function AppAccount({ userData }: AppAccountProps) {
  const handleStripeBillingPortal = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log(userData?.userfrontID);
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/stripe/billing-portal`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userfrontUserId: userData?.userfrontID }),
      }
    );

    if (response.status !== 200) {
      console.log("Error opening Stripe billing portal");
      return;
    }
    const resBody = await response.json();
    window.location = resBody.sessionUrl;
  };

  return (
    <Flex flexDirection="column">
      <Heading size="xl">Account Details</Heading>
      <Divider my="30px" />
      <Heading size="md">Signup Information</Heading>
      {userData?.fullName}
      <br />
      {userData?.signupEmail}
      <br />
      <Heading size="md">Manage Billing</Heading>
      <Button onClick={handleStripeBillingPortal}>Open Billing Portal</Button>
    </Flex>
  );
}

export default AppAccount;
