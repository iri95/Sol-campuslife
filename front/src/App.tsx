import React from "react";
import "./App.css";
import AppRouter from "./AppRouter";
import NavBar from "./components/common/NavBar";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";
// import "../src/utils/fcm";

function App() {
  return (
    <div className="App">
      <RecoilRoot>
        <AppRouter />
      </RecoilRoot>
    </div>
  );
}

export default App;
