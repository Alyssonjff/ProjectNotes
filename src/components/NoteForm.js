import React, { useState, useContext } from "react";
import { Button, Input, Textarea, VStack } from "@chakra-ui/react";
import { NotesContext } from "./NotesProvider";

export const NoteForm = () => {
  const { addNote } = useContext(NotesContext);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && body) addNote({ title, body });
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