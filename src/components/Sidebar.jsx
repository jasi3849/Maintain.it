import { FaHome, FaImage, FaFont, FaPalette } from 'react-icons/fa'
import './sidebar.css'

function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'home', icon: <FaHome />, label: 'Home' },
    { id: 'image', icon: <FaImage />, label: 'Image' },
    { id: 'text', icon: <FaFont />, label: 'Text' },
    { id: 'color', icon: <FaPalette />, label: 'Color' }
  ]

  return (
    <div className="sidebar">
      <div className="logo">
        <img src="/logo.png" alt="Maintain.it" />
        <h2>Maintain.it</h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar