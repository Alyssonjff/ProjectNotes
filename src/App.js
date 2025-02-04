import React, { useEffect, useState, createContext, useContext } from "react";
import { ChakraProvider, Box, Button, Input, Textarea, VStack, HStack, Text, useToast, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay } from "@chakra-ui/react";
import axios from "axios";

const NotesContext = createContext();
const API_URL = "https://jsonplaceholder.typicode.com/posts";

const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const toast = useToast();

  useEffect(() => {
    loadMoreNotes();
  }, []);

  const loadMoreNotes = async () => {
    const res = await axios.get(API_URL);
    const newNotes = res.data.slice(0, 20);
    setNotes(newNotes);
    setHasMore(newNotes.length === 20);
  };

  const addNote = async (title, body) => {
    const newNote = { title, body, userId: 1 };
    const res = await axios.post(API_URL, newNote);
    setNotes([...notes, res.data]);
    toast({ title: "Anotação adicionada", status: "success", duration: 2000 });
  };

  const editNote = async (id, title, body) => {
    await axios.put(`${API_URL}/${id}`, { title, body, userId: 1 });
    setNotes(notes.map((note) => (note.id === id ? { ...note, title, body } : note)));
    toast({ title: "Anotação editada", status: "info", duration: 2000 });
  };

  const deleteNote = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    setNotes(notes.filter((note) => note.id !== id));
    toast({ title: "Anotação deletada", status: "error", duration: 2000 });
  };

  return (
    <NotesContext.Provider value={{ notes, addNote, editNote, deleteNote, loadMoreNotes, hasMore }}>{children}</NotesContext.Provider>
  );
};

const NotesApp = () => {
  return (
    <ChakraProvider>
      <NotesProvider>
        <Box display="flex" alignItems="center" justifyContent="center" minH="100vh" p={4}>
          <Box p={4} maxW="800px" bg="gray.200" borderRadius="md" boxShadow="lg">
            <NoteForm />
            <NoteList />
          </Box>
        </Box>
      </NotesProvider>
    </ChakraProvider>
  );
};

const NoteForm = () => {
  const { addNote } = useContext(NotesContext);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && body) addNote(title, body);
    setTitle("");
    setBody("");
  };

  return (
    <VStack as="form" onSubmit={handleSubmit} spacing={4} w="100%" bg="gray.300" p={4} borderRadius="md">
      <Input placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <Textarea placeholder="Conteúdo" value={body} onChange={(e) => setBody(e.target.value)} required />
      <Button type="submit" colorScheme="blue">Adicionar Anotação</Button>
    </VStack>
  );
};

const NoteList = () => {
  const { notes, editNote, deleteNote, loadMoreNotes, hasMore } = useContext(NotesContext);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

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
      if (bottom && hasMore) loadMoreNotes();
    }}>
      {notes.map((note) => (
        <Box key={note.id} p={4} w="100%" maxW="800px" borderWidth={1} borderRadius="md" bg="gray.400" color="black">
          {editId === note.id ? (
            <VStack>
              <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
              <Textarea value={editBody} onChange={(e) => setEditBody(e.target.value)} />
              <HStack>
                <Button colorScheme="green" onClick={() => { editNote(note.id, editTitle, editBody); setEditId(null); }}>Salvar</Button>
                <Button onClick={() => setEditId(null)}>Cancelar</Button>
              </HStack>
            </VStack>
          ) : (
            <>
              <Text fontWeight="bold">{note.title}</Text>
              <Text>{note.body}</Text>
              <HStack>
                <Button size="sm" onClick={() => { setEditId(note.id); setEditTitle(note.title); setEditBody(note.body); }}>Editar</Button>
                <Button size="sm" colorScheme="red" onClick={() => { setNoteToDelete(note); setIsOpen(true); }}>Deletar</Button>
              </HStack>
            </>
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

export default NotesApp;