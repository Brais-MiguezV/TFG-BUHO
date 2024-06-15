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
          <LateralNav />
          <Pages />
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
