import { useState, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import productImage from './assets/productimg.png';
import './App.css';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function App() {

  const [productName, setProductName] = useState('');
  const [posRev, setPosRev] = useState(0);
  const [negRev, setNegRev] = useState(0);
  const [neuRev, setNeuRev] = useState(0);
  const [posScore, setPosScore] = useState(0);
  const [negScore, setNegScore] = useState(0);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/reviews'); 
        const data = await response.json();

   
        setProductName(data.ProductName || 'Product Name Unavailable');
        setPosRev(data.PositiveReviews || 0);
        setNegRev(data.NegativeReviews || 0);
        setNeuRev(data.NeutralReviews || 0);
        setPosScore(data.PositiveScore || 0);
        setNegScore(data.NegativeScore || 0);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="body">
      <div className="topbar">
        <h1>Product Reviews</h1>
        <div className="search">
          <div className="bar">
            <input type="text" className="inp" placeholder="Enter the link of product" />
          </div>
        </div>
      </div>
      <div className="lower">
        <div className="content">
          <h3>{productName}</h3>
          <img className="product" src={productImage} alt="Product" />
        </div>
        <div className="conRight">
        <div className="pie">
            <Doughnut
              data={{
                labels: ['Positive', 'Negative', 'Neutral'],
                datasets: [
                  {
                    data: [posRev, negRev, neuRev],
                    hoverOffset: 20,
                    backgroundColor: ["#00da0b", "#ff0000", "#fbff00"],
                    borderWidth: 0,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
          <div className="graph">
            <h4>Intensity of Reviews</h4>
            <Bar
              data={{
                labels: ["Positive", "Negative"],
                datasets: [
                  {
                    backgroundColor: "#00da0b",
                    borderRadius: 4,
                    label: "Positive",
                    data: [posScore, 0],
                  },
                  {
                    backgroundColor: ["#ff0000"],
                    label: "Negative",
                    borderRadius: 4,
                    data: [0, negScore],
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
         
        </div>
      </div>
    </div>
  );
}

export default App;
