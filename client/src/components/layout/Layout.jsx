import React from "react";
import Header from "./Header/Header";
import RightBar from "./RightBar/RightBar";
import LeftBar from "./LeftBar/LeftBar";
import "./layout.css";
class Layout extends React.Component {
  render() {
    return (
      <>
        {/* <Header />
        <main>
          <LeftBar />
          {this.props.children}
          <RightBar />
        </main> */}
      </>
    );
  }
}
export default Layout;
