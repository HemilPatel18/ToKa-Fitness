import { useEffect } from 'react'
import Pages from './routing'

import { RegisterTest } from './api'

import './App.css'

import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'

function App() {

  // useEffect(() => {
  //   RegisterTest();
  // }, [])

  return (
    <>
      <Header />
      <main className="main-content">
        <Pages /> 
      </main>
      <Footer />
    </>
  )
}

export default App
