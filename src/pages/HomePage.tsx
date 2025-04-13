
import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import CTA from "@/components/home/CTA";

const HomePage = () => {
  return (
    <Layout>
      <Hero />
      <Features />
      <CTA />
    </Layout>
  );
};

export default HomePage;
