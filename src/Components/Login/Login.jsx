import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody, Heading, useToast, Spinner } from '@chakra-ui/react';
import { Input, HStack, Stack, Text, InputRightElement, Button, InputGroup } from '@chakra-ui/react';
import './login.css';
import { client } from '../../Client.js';

const Login = ({ setIsAuth }) => {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const [errorMsg, setErrorMsg] = useState(false);

    const changeHandler = (event) => {
        const { value, name } = event.target;
        name === "password" ? setPassword(value) : setUserName(value);
    }

    const submitHandler = () => {
        setLoading(true);
        const body = {
            userName,
            password
        }

        client
            .post("/user/login", body)
            .then((resp) => {
                window.localStorage.setItem("token", resp.data.token);
                navigate('/');
                toast({
                    title: "Logged In Successfully",
                    status: 'success',
                    duration: 3000,
                    position: 'top-right',
                    isClosable: true,
                });
            })
            .catch((error) => {
                console.log('error', error);
                toast({
                    title: "Login Error",
                    description: error.message,
                    status: "error",
                    duration: 3000,
                    position: 'top-right',
                    isClosable: true,
                });
                setErrorMsg(true);
                setTimeout(() => {
                    setErrorMsg('');
                }, 3000);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <div>
            <div className='form'>
                <Card variant="filled" maxW="md" width="100%">
                    <CardHeader>
                        <Heading size='md'>Login</Heading>
                    </CardHeader>

                    <CardBody>
                        <Stack spacing={3}>
                            <Input placeholder='Enter Username' size='md' name="userName" value={userName} onChange={changeHandler} />
                        </Stack>
                        <InputGroup size='md'>
                            <Input
                                pr='4.5rem'
                                type={show ? 'text' : 'password'}
                                placeholder='Enter password'
                                name="password"
                                value={password}
                                onChange={changeHandler}
                            />
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' onClick={handleClick}>
                                    {show ? 'Hide' : 'Show'}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                        <HStack className='bottom'>
                            <Button
                                mt={2}
                                backgroundColor={"black"}
                                onClick={submitHandler}
                                colorScheme='twitter'
                                isLoading={loading}
                                spinner={<Spinner size="sm" />}
                            >
                                Submit
                            </Button>
                            <Button onClick={() => navigate('/register')} colorScheme='twitter'>Register here</Button>
                        </HStack>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

export default Login;
