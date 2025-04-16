
import React from 'react';
import NavbarWithNotifications from '@/components/NavbarWithNotifications';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavbarWithNotifications />
      <Hero />
      <Footer />
    </div>
  );
};

export default Home;
