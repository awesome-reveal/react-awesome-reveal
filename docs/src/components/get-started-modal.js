import React from "react"
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  SlideIn,
  Text,
  useClipboard,
} from "@chakra-ui/core"

const GetStartedModal = ({
  installationCommand = "yarn add react-awesome-reveal",
  isOpen,
  onClose,
  referrer,
}) => {
  const { onCopy, hasCopied } = useClipboard(installationCommand)

  return (
    <SlideIn in={isOpen}>
      {styles => (
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          finalFocusRef={referrer}
          isCentered
        >
          <ModalOverlay opacity={styles.opacity} />
          <ModalContent color="purple.50" bg="gray.800" {...styles}>
            <ModalHeader>Installation</ModalHeader>
            <ModalBody>
              <Box bg="black" borderRadius="md" p={3}>
                <Text fontFamily="mono">{installationCommand}</Text>
              </Box>
            </ModalBody>

            <ModalFooter>
              <Button variantColor="purple" mr={3} onClick={onCopy}>
                {hasCopied ? "Copied" : "Copy"}
              </Button>
              <Button variant="ghost" variantColor="purple" onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </SlideIn>
  )
}

export default GetStartedModal
