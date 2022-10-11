// import { useState, useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import Routes from './Routes';
import { ReactQueryDevtools } from 'react-query/devtools'
import { GlobalStyle } from './styles/GlobalStyle';

function App() {

  // const [data, setData] = useState([{}])

  // useEffect(() => {
  //   fetch("/users").then(
  //     // res 객체의 json()을 이용하여 json 데이터를 객체로 변화
  //     res => res.json()
  //   ).then(
  //     data => {
  //       // 받아온 데이터를 data 변수에
  //       setData(data)
  //       console.log(data)
  //     }
  //   )

  // }, [])


  return (
    <RecoilRoot>
      <GlobalStyle />
      <Routes />
      <ReactQueryDevtools initialIsOpen={false} />
      {/* <div>

          {(typeof data.users === 'undefined') ? (
              // fetch가 완료되지 않았을 경우
              <p>Loading...</p>
          ) : (
              data.users.map((u) => (
                <p>{u.name}</p>
              ))

          )}

        </div> */}
    </RecoilRoot>
  );
}

export default App;
