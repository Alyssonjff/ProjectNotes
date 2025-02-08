import { ChakraProvider, Box } from "@chakra-ui/react";
import { NotesProvider } from "./components/NotesProvider";
import { NoteList } from "./components/NoteList";
import { NoteForm } from "./components/NoteForm";

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

export default NotesApp;