import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";
import { Affix } from "antd";

function Community() {
  return (
    <>
      <Affix offsetTop={0}>
        <Header />
      </Affix>
      <div>community</div>
      <Footer />
    </>
  );
}

export default Community;
