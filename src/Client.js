import axios from 'axios'

export const client = axios.create({
  baseURL:'https://somebackend-dd7m.onrender.com/',
})