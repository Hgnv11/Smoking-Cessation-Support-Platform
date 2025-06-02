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