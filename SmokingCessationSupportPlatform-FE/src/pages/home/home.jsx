import Header from "../../components/header/header";
import Poster from "../../components/poster/poster";
import Footer from "../../components/footer/footer";
import { Affix } from "antd";

function Home() {
  return (
    <>
      <Affix offsetTop={0}>
        <Header />
      </Affix>
      <Poster />
      <div>Home</div>
      <Footer />
    </>
  );
}

export default Home;
