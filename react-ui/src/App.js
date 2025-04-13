import './App.css';
import ChartComponent from './charts-component/chart-component';
import PredictionPanel from './PredictionPanel';


function App() {
  return (
    <div className="App">
      <h1>Flu Prediction Dashboard</h1>
      <ChartComponent />
      <PredictionPanel />
    </div>
  );
}

export default App;

