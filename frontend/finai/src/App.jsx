import { useState } from 'react'

import './App.css'
import FinanceAssistant from './components/FinanceAssistant.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      
      <FinanceAssistant/>
      
    </>
  )
}

export default App
