import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import './Header.scss'
import { panelPath } from '@/utils/panelVaribales.jsx'
import VentusDev from '../../assets/icons/VentusDev';
import { useAuthStore } from '../../store/authStore';

const Header = ({pagesLinks}) => {
  const location = useLocation();
  const title = pagesLinks.find((item,i)=> item.includes(location.pathname))
  const { user } = useAuthStore();

  return (
    <div className="appContentHeader">
    <h1 className="appContentHeaderText">{user&&title?title[3]:''}</h1>
 
  <Link to={panelPath}>
  <VentusDev />
  </Link>

  </div>
  )
}

export default Header