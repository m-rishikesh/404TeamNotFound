import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FinanceAssistant from './components/FinanceAssistant.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      
      <FinanceAssistant/>
      <p>This is bk's code...</p>
      
    </>
  )
}

export default App
