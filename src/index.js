import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import { UserProvider } from './context/userContext';
import Home from './pages/Home';
import Project from './pages/Project';
import UserAuth from './auth/UserAuth';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(

    <UserProvider>
    <BrowserRouter>
      <App />
    <Routes>
      <Route path="/" element={<UserAuth> <Home/> </UserAuth> } />
      {/* <Route path="/chat" element={ <AiChat/> } /> */}
      <Route path="/login" element={ <Login/> } />
      <Route path="/register" element={ <Register/> } />
      <Route path="/profile" element={<div>Profile</div>} />
      <Route path="/project" element={<UserAuth> <Project/> </UserAuth>} />
    </Routes>
    </BrowserRouter>
    </UserProvider>
);

