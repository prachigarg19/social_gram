import Feed from "../../components/Feed/Feed";
import Header from "../../components/layout/Header/Header";
import LeftBar from "../../components/layout/LeftBar/LeftBar";
import RightBar from "../../components/layout/RightBar/RightBar";
import "./home.css";

export default function Home() {
  return (
    <>
      <Header />
      <div className="homeContainer">
        <LeftBar />
        <Feed />
        <RightBar />
      </div>
    </>
  );
}
