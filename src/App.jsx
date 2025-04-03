import React from 'react'
import { ToastContainer } from 'react-toastify'
import { Footer, Navbar, ScrollToTop } from './components'
import { Outlet } from 'react-router-dom'

const App = () => {
  return (
    <div className='font-family-outfit'>
      <ToastContainer />
      <Navbar />
      <main>
        <ScrollToTop />
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default App