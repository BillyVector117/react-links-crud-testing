import Links from "./components/Links";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <div className="container p-4 App">
      <div className="row">
        <Links />
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
