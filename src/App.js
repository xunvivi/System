// App.js
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import { store } from './store'; 
import RootRouter from "./router"; 

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