import { Link } from "react-router-dom"
import { useEffect, useState } from "react"

const hamburgerMenuSvg = (
  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
    <path d="M4 18L20 18" stroke="#000000" strokeWidth="2" strokelineup="round"/>
    <path d="M4 12L20 12" stroke="#000000" strokeWidth="2" strokelineup="round"/>
    <path d="M4 6L20 6" stroke="#000000" strokeWidth="2" strokelineup="round"/>
  </svg>
)

const closeSvg = (
  <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18" stroke="#000000" strokeWidth="2" strokelineup="round"/>
    <path d="M6 6L18 18" stroke="#000000" strokeWidth="2" strokelineup="round"/>
  </svg>
)

export default function Nav() {
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if(window.innerWidth < 600) {
      setIsMobile(true) // doesnt listen to resize event
    }
  }, [])

  const desktopNav = (
    <nav>
      <Link to="/">Field Notr</Link>
      <Link to="/notes">Notes</Link>
    </nav>
  )

  const mobileNav = (
    !isOpen ? (
      <nav className="mobile-nav-close">
        <h1>Field Notr</h1>
        <button onClick={() => setIsOpen(true)}>{hamburgerMenuSvg}</button>
      </nav>
    ) : (
      <nav className="mobile-nav-open">
        <Link to="/">Home</Link>
        <Link to="/notes">Notes</Link>
        <button onClick={() => setIsOpen(false)}>{closeSvg}</button>
      </nav>
    )
  )

    return (
      isMobile ? mobileNav : desktopNav
    )
  }