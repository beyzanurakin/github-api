import React from 'react'
import { GithubContext } from '../context/context'

function Navbar() {
  const data = React.useContext(GithubContext)
  return <div>{data}</div>
}

export default Navbar
