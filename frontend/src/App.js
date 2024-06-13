import "./App.css";
import Header from "./components/Header";
import LateralNav from "./components/LateralNav";
import { BrowserRouter } from "react-router-dom";
import Pages from "./pages/Pages";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <div className="mainDiv">
          <Pages />
        <LateralNav />
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
