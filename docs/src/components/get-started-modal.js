import { CopyIcon } from "@chakra-ui/icons";
import {
  Button,
  Code,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useClipboard,
} from "@chakra-ui/react";
import React, { useState } from "react";

const INSTALL_COMMANDS = [
  "npm install react-awesome-reveal@latest",
  "yarn add react-awesome-reveal@latest",
];

const PACKAGE_MANAGERS_REGEX = /^(npm|yarn)/;

const GetStartedModal = ({ isOpen, onClose, referrer }) => {
  const [installCommand, setInstallCommand] = useState(INSTALL_COMMANDS[0]);
  const { onCopy } = useClipboard(installCommand);

  function getPackageManagerNameFromInstallCommand(command) {
    return command.match(PACKAGE_MANAGERS_REGEX)?.[0];
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      finalFocusRef={referrer}
      isCentered
    >
      <ModalOverlay />
      <ModalContent color="purple.50" bg="gray.800">
        <ModalHeader>Installation</ModalHeader>
        <ModalBody>
          <Tabs colorScheme="purple" size="sm" variant="soft-rounded">
            <TabList>
              {INSTALL_COMMANDS.map((command) => (
                <Tab key={command} onClick={() => setInstallCommand(command)}>
                  {getPackageManagerNameFromInstallCommand(command)}
                </Tab>
              ))}
            </TabList>

            <TabPanels>
              {INSTALL_COMMANDS.map((command) => (
                <TabPanel key={command} px={0}>
                  <Flex
                    align="center"
                    justify="space-between"
                    bg="gray.900"
                    borderRadius="md"
                    p={3}
                  >
                    <Code bg="inherit" colorScheme="purple">
                      {command}
                    </Code>
                    <IconButton
                      colorScheme="purple"
                      icon={<CopyIcon />}
                      size="sm"
                      title="Copy to clipboard"
                      variant="ghost"
                      onClick={onCopy}
                    />
                  </Flex>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="purple" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GetStartedModal;
