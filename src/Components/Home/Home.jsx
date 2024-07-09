import React, { useEffect, useState } from 'react';
import { client } from '../../Client';
import { authHeaders } from '../../Utils';
import { Box, Button, Table, Tbody, Td, Th, Thead, Tr, IconButton, useDisclosure, useToast, Flex } from '@chakra-ui/react';
import { FaPlay, FaPause, FaCheck } from 'react-icons/fa';
import AddTodoModal from '../AddTodoModal/AddTodoModal';
import { Puff } from 'react-loader-spinner';

const Home = () => {
    const [todos, setTodos] = useState([]);
    const [isCompleted, setCompleted] = useState(false);
    const [loading, setLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = () => {
        setLoading(true);
        client
            .get("/todo/get-todo", authHeaders())
            .then((resp) => {
                setTodos(resp.data);
            })
            .catch((error) => {
                console.error('Error fetching todos:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleStart = (todoId) => {
        if (loading) return;
        setLoading(true);
        const ongoingTask = todos.find(todo => todo.isOngoing);
        if (ongoingTask) {
            toast({
                title: "Ongoing Task",
                description: `You cannot start a new task while '${ongoingTask.title}' is ongoing.`,
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            setLoading(false);
        } else {
            client.post("/todo/update-todo", { id: todoId }, authHeaders())
                .then(() => {
                    fetchTodos();
                })
                .catch((error) => {
                    console.log(error.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };

    const handlePause = (todoId) => {
        if (loading) return;
        setLoading(true);
        client.post("/todo/update-todo", { id: todoId }, authHeaders())
            .then(() => {
                fetchTodos();
            })
            .catch((error) => {
                console.log(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleDone = (todoId) => {
        if (loading) return;
        setLoading(true);
        client.post("/todo/update-todo", { id: todoId, isDone: true }, authHeaders())
            .then(() => {
                fetchTodos();
            })
            .catch((error) => {
                console.log(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const formatHours = (hours) => {
        if (!hours) return "Not started yet!"
        if (hours < 1) {
            const minutes = Math.round(hours * 60);
            return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
        } else {
            const wholeHours = Math.floor(hours);
            const remainderMinutes = Math.round((hours % 1) * 60);
            if (remainderMinutes === 0) {
                return `${wholeHours} hour${wholeHours !== 1 ? 's' : ''}`;
            } else {
                return `${wholeHours} hour${wholeHours !== 1 ? 's' : ''} ${remainderMinutes} minute${remainderMinutes !== 1 ? 's' : ''}`;
            }
        }
    };

    return (
        <Box p={4}>
            <Flex justifyContent={'flex-end'} alignItems={'flex-end'} flexWrap="wrap">
                <Button onClick={() => setCompleted(!isCompleted)} color={'white'} _hover={{ background: "gray" }} background={'black'} mb={4}>
                    {isCompleted ? "Show pending tasks" : "Show Completed tasks"}
                </Button>
                <Button ml={2} onClick={onOpen} color={'white'} _hover={{ background: "gray" }} background={'black'} mb={4}>
                    Add Todo
                </Button>
            </Flex>
            <AddTodoModal isOpen={isOpen} fetchTodos={fetchTodos} onClose={onClose} />

            <Box overflowX="auto" position="relative">
                {loading && (
                    <Flex justify="center" align="center" position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)">
                        <Puff type="Oval" color="#00BFFF" height={50} width={50} />
                    </Flex>
                )}
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Title</Th>
                            <Th>Description</Th>
                            <Th>Created At</Th>
                            <Th>Time Used</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {todos?.filter((item) => isCompleted ? item.isDone == true : !item.isDone).map((todo) => (
                            <Tr key={todo._id}>
                                <Td>{todo.title}</Td>
                                <Td>{todo.description}</Td>
                                <Td>{new Date(todo.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true })}</Td>
                                <Td>{formatHours(todo.hours)}</Td>
                                {isCompleted ? <Td>😊 All Set!</Td> : <Td>
                                    {!todo.isOngoing ? (
                                        <IconButton
                                            aria-label="Start"
                                            icon={<FaPlay />}
                                            onClick={() => handleStart(todo._id)}
                                            variant="outline"
                                            colorScheme="green"
                                            mr={2}
                                            isDisabled={loading}
                                        />
                                    ) : (
                                        <IconButton
                                            aria-label="Pause"
                                            icon={<FaPause />}
                                            onClick={() => handlePause(todo._id)}
                                            variant="outline"
                                            colorScheme="orange"
                                            mr={2}
                                            isDisabled={loading}
                                        />
                                    )}
                                    <IconButton
                                        aria-label="Done"
                                        icon={<FaCheck />}
                                        onClick={() => handleDone(todo._id)}
                                        variant="outline"
                                        colorScheme="blue"
                                        isDisabled={loading}
                                    />
                                </Td>}
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
        </Box>
    );
};

export default Home;
