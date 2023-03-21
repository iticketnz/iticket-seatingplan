import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'

const root = ReactDOM.createRoot(
  document.getElementById('SeatingPlan') as HTMLElement
)
root.render(
  <React.StrictMode>
    <App
      eventid={30819}
      showinguid={'44897047-7F5E-424C-891B-C058BE24DB94'}
      sessionid={'muum0sxkdntjsqt4d1342wb0'}
      showingid={84164}
      priceageid={161151}
      quantity={2}
      price={50}
      style={{ height: '1000px' }}
    />
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
