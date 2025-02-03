import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Home from './components/Home'
import ImageManagement from './components/ImageManagement'
import TextManagement from './components/TextManagement'
import ColorManagement from './components/ColourManagement'
// import './App.css' // you can rename if you want
import './Dashboard.css'

function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('home')

  const renderContent = () => {
    switch(activeTab) {
      case 'home':
        return <Home />
      case 'image':
        return <ImageManagement />
      case 'text':
        return <TextManagement />
      case 'color':
        return <ColorManagement />
      default:
        return <Home />
    }
  }

  // For the logout button, we'll call "onLogout" which we'll get from props
  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        <nav className="top-nav">
          <h1>Maintain.it</h1>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </nav>
        <div className="content-area">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

export default Dashboard
