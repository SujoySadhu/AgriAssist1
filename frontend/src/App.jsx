import { useState } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import Index from "./views/core/Index";
import Detail from "./views/core/Detail";
import Search from "./views/core/Search";
import Category from "./views/core/Category";
import About from "./views/pages/About";
import Contact from "./views/pages/Contact";
import Register from "./views/auth/Register";
import Login from "./views/auth/Login";
import Logout from "./views/auth/Logout";
import ForgotPassword from "./views/auth/ForgotPassword";
import CreatePassword from "./views/auth/CreatePassword";
import Dashboard from "./views/dashboard/MyAccount";
import Posts from "./views/dashboard/Posts";
import AddPost from "./views/dashboard/AddPost";
import EditPost from "./views/dashboard/EditPost";
import Comments from "./views/dashboard/Comments";
import Notifications from "./views/dashboard/Notifications";
import Profile from "./views/dashboard/Profile";
import MainWrapper from "../src/layouts/MainWrapper"
import ChatInterface from "./views/chatbot/ChatInterface";
import VerifyOTP from "./views/auth/VerifyOTP";
import DiseaseDetection from "./views/core/DiseaseDetection";
import MyAccount from "./views/dashboard/MyAccount";
// import PDFProcessor from "./views/chatbot/PDFProcessor";

function App() {
  
  return (
    <LanguageProvider>
      <BrowserRouter>
        <MainWrapper>
       
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/category/" element={<Category />} />
            <Route path="/category/:slug/" element={<Category />} />
            <Route path="/search/" element={<Search />} />
            <Route path="/search/:slug/" element={<Detail/>} />
            <Route path="/:slug/" element={<Detail />} />

            {/* Authentication */}
            <Route path="/register/" element={<Register />} />
            <Route path="/login/" element={<Login />} />
            <Route path="/logout/" element={<Logout />} />
            <Route path="/forgot-password/" element={<ForgotPassword />} />
            <Route path="/create-password/" element={<CreatePassword />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />

            {/* Dashboard */}
            <Route path="/dashboard/" element={<MyAccount />} />
            <Route path="/posts/" element={<Posts />} />
            <Route path="/add-post/" element={<AddPost />} />
            <Route path="/edit-post/:id/" element={<EditPost />} />
            <Route path="/comments/" element={<Comments />} />
            <Route path="/notifications/" element={<Notifications />} />
            <Route path="/profile/" element={<Profile />} />

            {/* Pages */}
            <Route path="/about/" element={<About />} />
            <Route path="/contact/" element={<Contact />} />
            {/* Chatbot */}
            <Route path="/chatbot/" element={<ChatInterface />} />
            <Route path="/disease-detection" element={<DiseaseDetection />} />
          </Routes>
        </MainWrapper>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App
