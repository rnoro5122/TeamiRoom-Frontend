import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainScreen from "./components/MainScreen";
import PromiseScreen from "./components/PromiseScreen";
import { AppContextProvider } from "./context/AppContext";

function App() {
  return (
    <AppContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainScreen />} />
          <Route path="/promise/:id" element={<PromiseScreen />} />
        </Routes>
      </Router>
    </AppContextProvider>
  );
}

export default App;
