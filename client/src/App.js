import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

function App() {

  const [data, setData] = useState([{}])

  useEffect(() => {
    fetch("/users").then(
      // res 객체의 json()을 이용하여 json 데이터를 객체로 변화
      res => res.json()
    ).then(
      data => {
        // 받아온 데이터를 data 변수에
        setData(data)
        console.log(data)
      }
    )

  }, [])


  return (

    <div className="App">
      <header className="App-header">

        <div>

          {(typeof data.users === 'undefined') ? (
              // fetch가 완료되지 않았을 경우
              <p>Loading...</p>
          ) : (
              data.users.map((u) => (
                <p>{u.name}</p>
              ))

          )}

        </div>
        
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
