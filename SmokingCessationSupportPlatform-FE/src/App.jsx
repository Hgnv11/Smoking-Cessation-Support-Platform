<<<<<<< HEAD
import React from 'react';
import { Layout } from 'antd';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ExploreSection from './components/ExploreSection';
import ArticleSection from './components/ArticleSection';
import LeaderboardSection from './components/LeaderboardSection';
import TestimonialsSection from './components/TestimonialsSection';
import Footer from './components/Footer';
import './App.css';

const { Content } = Layout;
=======
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/home";
import Login from "./pages/auththenPage/login/login";
import Register from "./pages/auththenPage/register/register";
import ForgotPass from "./pages/auththenPage/forgotPass/forgotPass";
import ForgotPassCode from "./pages/auththenPage/forgotPass-code/forgotPass-code";
import MakePlan from "./pages/quitPlan/makePlan";
import Community from "./pages/community/community";
import UserCoach from "./pages/userCoach/userCoach";
import Layout from "./components/layout/layout";

function App() {
  const ProtectAuth = () => {};
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "forgot-password", element: <ForgotPass /> },
        { path: "forgot-password-code", element: <ForgotPassCode /> },
        { path: "make-plan", element: <MakePlan /> },
        { path: "community", element: <Community /> },
        { path: "user-coach", element: <UserCoach /> },
      ],
    },
  ]);
>>>>>>> origin/MinhThien

const App = () => {
  return (
    <Layout className="layout">
      <Header />
      <Content>
        <HeroSection />
        <ExploreSection />
        <ArticleSection />
        <LeaderboardSection />
        <TestimonialsSection />
      </Content>
      <Footer />
    </Layout>
  );
};

export default App;