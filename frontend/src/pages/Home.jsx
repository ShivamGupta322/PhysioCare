import React from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'
import Faq from '../components/FaqComponent'
import { Conditions } from '../components/Conditions'


const Home = () => {
  return (
    <div>
      <Header />
      <SpecialityMenu />
      <TopDoctors />
      <Conditions />
      <Banner />
      <Faq/>
    </div>
  )
}

export default Home