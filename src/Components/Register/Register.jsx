import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardBody, Heading, useToast } from '@chakra-ui/react'
import { Input, HStack, Stack, InputRightElement, Button, InputGroup } from '@chakra-ui/react'
import { useState } from 'react'
import './register.css'
import { client } from '../../Client'

const Register = () => {
    const navigate = useNavigate();
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const changeHandler = (event) => {
        const { value, name } = event.target;
        name === 'password' ? setPassword(value) : setUsername(value);
    }

    const toast = useToast();

    const submitHandler = () => {
        const body = {
            userName: username,
            password
        }

        client.post("/user/register", body)
            .then((resp) => {
                navigate('/login');
            })
            .catch((error) => {
                const err = error.response?.data?.message || "Registration failed";
                toast({
                    title: "Registration Error",
                    description:err,
                    status: "error",
                    duration: 3000,
                    position: 'top-right',
                    isClosable: true,
                });
            })
    }

    return (
        <div>
            <div className='form'>
                <Card variant="filled" maxW="md" width="100%">
                    <CardHeader>
                        <Heading size='md'>Register</Heading>
                    </CardHeader>

                    <CardBody>
                        <Stack spacing={3}>
                            <Input placeholder='Enter Username' size='md' name="username" value={username} onChange={changeHandler} />
                        </Stack>
                        <InputGroup size='md'>
                            <Input
                                pr='4.5rem'
                                type={show ? 'text' : 'password'}
                                placeholder='Enter Password'
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
                        <HStack>
                            <Button mt={4} backgroundColor={"black"} onClick={submitHandler} colorScheme='twitter'>
                                Submit
                            </Button>
                            {errorMsg && <div className='error'>{errorMsg}</div>}
                        </HStack>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}

export default Register
