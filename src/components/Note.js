import { Button, HStack, Text } from "@chakra-ui/react";

export const Note = ({ note, setEdit , setNoteToDelete, setIsOpen }) => (
  <>
    <Text fontWeight="bold">{note.title}</Text>
    <Text>{note.body}</Text>
    <HStack mt="5">
      <Button size="sm" onClick={() => setEdit(note)}>Editar</Button>
      <Button size="sm" colorScheme="red" onClick={() => {
        setNoteToDelete(note);
        setIsOpen(true);
      }}>Deletar</Button>
    </HStack>
  </>
);