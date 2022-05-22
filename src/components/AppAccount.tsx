import { Flex, Heading, Divider } from "@chakra-ui/react";
import type { User } from "../types/types";

interface AppAccountProps {
  userData: User;
}

function AppAccount({ userData }: AppAccountProps) {
  return (
    <Flex flexDirection="column">
      <Heading size="xl">Account Details</Heading>
      <Divider my="30px" />
      <Heading size="lg">Your Deco Email</Heading>
      {userData?.fullName}
      {userData?.emailAddress}
    </Flex>
  );
}

export default AppAccount;
