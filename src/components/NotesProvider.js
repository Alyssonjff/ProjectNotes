import React, { useEffect, useState, createContext } from "react";
import { useToast } from "@chakra-ui/react";
import { createNote, getAll, removeNote, updateNote } from "../api";

export const NotesContext = createContext();
// the userId is hard coded to 1 because we dont have users authentication
const USER_ID = 1;

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const toast = useToast();

  useEffect(() => {
    loadMoreNotes();
  }, []);

  const loadMoreNotes = async () => {
    const res = await getAll();
    setNotes(res.data);
  };

  const addNote = async ({ title, body }) => {
    const newNote = { title, body, userId: USER_ID };
    const res = await createNote(newNote);
    setNotes([res.data, ...notes]);
    toast({ title: "Anotação adicionada", status: "success", duration: 2000 });
  };

  const editNote = async ({ id, title, body }) => {
    await updateNote({ id, title, body, userId: USER_ID })
    setNotes(notes.map((note) => (note.id === id ? { ...note, title, body } : note)));
    toast({ title: "Anotação editada", status: "info", duration: 2000 });
  };

  const deleteNote = async (id) => {
    await removeNote(id);
    setNotes(notes.filter((note) => note.id !== id));
    toast({ title: "Anotação deletada", status: "error", duration: 2000 });
  };

  return (
    <NotesContext.Provider value={{ notes, addNote, editNote, deleteNote, loadMoreNotes }}>{children}</NotesContext.Provider>
  );
};