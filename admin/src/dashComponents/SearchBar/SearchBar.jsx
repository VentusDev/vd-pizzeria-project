import React, { useState } from 'react'
import { useDashStore } from '../../store/dashStore'
import './SearchBar.scss'
import Input from '../../components/Input/Input';
import Magnifying from '@/assets/icons/Magnifying.jsx'

const SearchBar = ({className, ...props}) => {

 const { setQuery, query } = useDashStore();
  return (

    <Input
    icon={Magnifying}
    className={`searchBar ${className}`}
    placeholder='Wyszukaj...'
    type='text'
    value={query}
    onChange={(e) => setQuery(e.target.value.toLowerCase())}
    {...props}
     />
  )
}

export default SearchBar