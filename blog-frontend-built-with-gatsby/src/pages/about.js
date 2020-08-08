import React from "react"
import { Link } from "gatsby" 
import Header from '../components/header'

export default function About() {
  return (
    <div style={{ color: `teal` }}>
      <Header title="hello wen" />
      <Link to="/contact">to contact</Link>
      <p>Such wow. Very React.</p>
    </div>
  )
}
