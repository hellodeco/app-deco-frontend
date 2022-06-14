import React, { useCallback } from "react";
import {
  Heading,
  Button,
  Tag,
  Link,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import Userfront from "@userfront/core";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_CURRENT_USER_NOTION_INTEGRATION,
  GET_CURRENT_USER_NOTION_DATABASE_INFO,
} from "../../graphql/queries";
import { DROP_AND_MIGRATE_USERS_NOTION_DATABASE } from "../../graphql/mutations";

export const NotionAuth = () => {
  const notionIntegration = useQuery(GET_CURRENT_USER_NOTION_INTEGRATION);
  const notionDatabase = useQuery(GET_CURRENT_USER_NOTION_DATABASE_INFO);
  const [formatNotionDatabase, formatNotionDatabaseData] = useMutation(
    DROP_AND_MIGRATE_USERS_NOTION_DATABASE
  );

  const handleAuthWithNotion = useCallback(() => {
    const params = new URLSearchParams();
    params.append('authToken', Userfront.tokens?.accessToken);
    const authUrl = `${
      process.env.REACT_APP_API_URL
    }/oauth/notion?${params.toString()}`;
    const tab = window.open(authUrl, '_blank');
    tab?.focus();

    const interval = setInterval(() => {
      if (tab?.closed) {
        notionIntegration.refetch();
        notionDatabase.refetch();
        clearInterval(interval);
      }
    }, 300);
  }, [notionIntegration, notionDatabase]);

  const handleFormatNotionDatabase = async () => {
    await formatNotionDatabase();
    await notionDatabase.refetch();
  };

  if (notionIntegration.loading || notionDatabase.loading) {
    return <span>Loading notion data...</span>;
  }

  const notionIntegrationData =
    notionIntegration.data?.getCurrentUserNotionIntegration;
  const notionDatabaseData =
    notionDatabase.data?.getCurrentUserNotionDatabaseInfo;

  if (notionIntegrationData && notionDatabaseData) {
    return (
      <>
        <Heading size="md">Your Connected Notion Page</Heading>

        <Heading mt="15px" size="sm">
          Status:
        </Heading>

        {!notionDatabaseData.needsFormatting ? (
          <Tag
            mt="15px"
            width="-webkit-fit-content"
            size="lg"
            variant="solid"
            colorScheme="green"
          >
            Ready to receive email!
          </Tag>
        ) : (
          <>
            <Tag
              mt="15px"
              width="-webkit-fit-content"
              size="lg"
              variant="solid"
              colorScheme="red"
            >
              Not ready to receive email! Please format your database using the
              button below.
            </Tag>
            <Button
              w="300px"
              my="30px"
              onClick={() => handleFormatNotionDatabase()}
            >
              Format Notion DB
            </Button>
          </>
        )}

        {formatNotionDatabaseData?.loading && <>Formatting your notion db...</>}

        <Heading mt="15px" size="sm">
          Workspace:
        </Heading>

        <Tag
          mt="15px"
          width="-webkit-fit-content"
          size="lg"
          variant="solid"
          colorScheme="gray"
        >
          {notionIntegrationData.workspaceIcon}{" "}
          {notionIntegrationData.workspaceName} - Owner:{" "}
          {notionIntegrationData.userFullName} - Email:{" "}
          {notionIntegrationData.email}
        </Tag>

        <Heading mt="15px" size="sm">
          Database:
        </Heading>

        <Link mt="15px" href={notionDatabaseData.url} isExternal>
          {notionDatabaseData.icon} {notionDatabaseData.title}{" "}
          <ExternalLinkIcon mx="2px" />
        </Link>

        <Button w="300px" my="30px" onClick={handleAuthWithNotion}>
          Change Connected Notion Page
        </Button>
      </>
    );
  }

  return (
    <>
      <Heading size="md">Connect your Notion Account</Heading>
      <Button w="300px" my="30px" onClick={handleAuthWithNotion}>
        Connect to Notion
      </Button>
    </>
  );
};
