import React from 'react';
import { Box, Flex, Heading } from '@chakra-ui/react';

const Header = () => {
    return (
        <Box bg="black" p={4} color="white" width={'100%'}>
            <Flex justify="space-between" align="center" wrap="wrap">
                <Heading as="h1" size="lg" textAlign="center" width="100%">
                    Todo App
                </Heading>
            </Flex>
        </Box>
    );
};

export default Header;
