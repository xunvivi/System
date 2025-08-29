import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import { store } from './store'; 
import RootRouter from "./router"; 
import '@fortawesome/fontawesome-free/css/all.min.css';



function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <RootRouter />
      </div>
    </Provider>
  );
}

export default App;