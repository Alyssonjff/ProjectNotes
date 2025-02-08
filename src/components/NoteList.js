import React, { useState, useContext } from "react";
import { Box, Button, VStack, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay } from "@chakra-ui/react";
import { NotesContext } from "./NotesProvider";
import { Note } from "./Note";
import { EditForm } from "./EditForm";

export const NoteList = () => {
  const { notes, editNote, deleteNote, loadMoreNotes } = useContext(NotesContext);
  const [isOpen, setIsOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [noteToEdit, setEdit] = useState(null);

  const onClose = () => {
    setIsOpen(false);
    setNoteToDelete(null);
  };

  const confirmDelete = () => {
    if (noteToDelete) {
      deleteNote(noteToDelete.id);
    }
    onClose();
  };

  return (
    <VStack spacing={4} mt={4} w="100%" overflowY="auto" maxH="600px" onScroll={(e) => {
      const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
      if (bottom) loadMoreNotes();
    }}>
      {notes.map((note) => (
        <Box key={note.id} p={4} w="100%" maxW="800px" borderWidth={1} borderRadius="md" bg="gray.400" color="black">
          {noteToEdit?.id === note.id ? (
            <EditForm
              note={noteToEdit}
              onCancel={() => {
                setEdit(null);
              }}
              onSave={async ({ title, body }) => {
                await editNote({ id: note.id, title, body });
                setEdit(null)
              }}
            />
          ) : (
            <Note
              note={note}
              setEdit={setEdit}
              setIsOpen={setIsOpen}
              setNoteToDelete={setNoteToDelete}
            />
          )}
        </Box>
      ))}
      <AlertDialog isOpen={isOpen} leastDestructiveRef={undefined} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Confirmar Exclusão</AlertDialogHeader>
            <AlertDialogBody>
              Você realmente deseja deletar a anotação "{noteToDelete?.title}"?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onClose}>Cancelar</Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>Deletar</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </VStack>
  );
};