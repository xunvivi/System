import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import RootRouter from "./router"; 
import '@fortawesome/fontawesome-free/css/all.min.css';



function App() {
  return (
      <div className="App">
        <RootRouter />
      </div>
  );
}

export default App;