import { useRef } from 'react'
import { Button, HStack, Input, Textarea, VStack } from "@chakra-ui/react";

export const EditForm = ({ note, onSave, onCancel }) => {
  const inputRef = useRef(null);
  const bodyRef = useRef(null);

  const save = () => {
    const title = inputRef.current.value;
    const body = bodyRef.current.value;

    onSave({ title, body });
  };
  return(
    <VStack>
      <Input ref={inputRef} defaultValue={note.title} />
      <Textarea ref={bodyRef} defaultValue={note.body} />
      <HStack>
        <Button colorScheme="green" onClick={save}>Salvar</Button>
        <Button onClick={onCancel}>Cancelar</Button>
      </HStack>
    </VStack>
  )
};