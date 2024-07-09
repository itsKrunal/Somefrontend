import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Components/Home/Home'
import Login from './Components/Login/Login'
import Register from './Components/Register/Register'
import Header from './Components/Header/Header'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute'

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<ProtectedRoute Component={Home}/>} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </>
  )
}

export default App