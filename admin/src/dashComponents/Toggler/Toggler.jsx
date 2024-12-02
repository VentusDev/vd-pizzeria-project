import React from 'react'
import './Toggler.scss'

const Toggler = ({state, onClick, title, className=''}) => {
  return (
    <div className={`${className} modeToggle ${state ? 'active' : ''}`}>
    <span
        className={`switch`}
        title={title}
        onClick={onClick}
    ></span>
</div>
  )
}

export default Toggler