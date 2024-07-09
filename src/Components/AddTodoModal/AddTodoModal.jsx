import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Input, Stack, Button, useToast } from '@chakra-ui/react';
import { client } from '../../Client';
import { authHeaders } from '../../Utils';

const AddTodoModal = ({ isOpen, onClose, fetchTodos }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const toast = useToast();

    const handleTitleChange = (event) => setTitle(event.target.value);
    const handleDescriptionChange = (event) => setDescription(event.target.value);

    const handleSubmit = () => {
        if (!title || !description) {
            toast({
                title: "Validation Error",
                description: "Title and Description cannot be empty.",
                status: "error",
                position: 'top-right',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const body = {
            title,
            description,
        };

        client.post('/todo/add-todo', body, authHeaders())
            .then((resp) => {
                toast({
                    title: "Todo Added",
                    position: 'top-right',
                    description: "Your todo has been added successfully.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                onClose();
                setTitle('');
                setDescription('');
                fetchTodos()
            })
            .catch((error) => {
                toast({
                    title: "Error",
                    position: 'top-right',
                    description: "There was an error adding your todo.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
                console.error('Error adding to-do:', error);
            });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add a new Todo</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Stack spacing={3}>
                        <Input placeholder="Title" value={title} onChange={handleTitleChange} />
                        <Input placeholder="Description" value={description} onChange={handleDescriptionChange} />
                    </Stack>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="teal" mr={3} onClick={handleSubmit}>
                        Submit
                    </Button>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddTodoModal;
