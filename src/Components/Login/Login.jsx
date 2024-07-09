import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardBody, Heading } from '@chakra-ui/react';
import { Input, HStack, Stack, Text, InputRightElement, Button, InputGroup } from '@chakra-ui/react';
import { useState } from 'react';
import './login.css';
import { client } from '../../Client.js';

const Login = ({setIsAuth}) => {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState(false);

    const changeHandler = (event) => {
        const { value, name } = event.target;
        name === "password" ? setPassword(value) : setUserName(value);
    }

    const submitHandler = () => {
        const body = {
            userName,
            password
        }

        client
            .post("/user/login", body)
            .then((resp) => {
                window.localStorage.setItem("token", resp.data.token);
                navigate('/');
                setIsAuth(true);
            })
            .catch((error) => { 
                console.log('error', error); 
                setErrorMsg(true);
                setInterval(()=> {
                    setErrorMsg('')
                }, [3000])
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
                                <Button mt={2} backgroundColor={"black"} onClick={submitHandler} colorScheme='twitter'>
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
