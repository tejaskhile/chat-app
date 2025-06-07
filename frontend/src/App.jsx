import './App.css';
import { useEffect } from 'react';

function App() {

  useEffect(() => {
    const render_api = process.env.REACT_APP_API_URL || process.env.RENDER_APP_API_URL;
    fetch(`${render_api}/api/server`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then((res) => res.json())
      .then((data) => console.log("Server Response:", data))
      .catch((err) => console.error("API call failed:", err));
  }, [])


  return (
      <div className="App"></div>
  );
}

export default App;
