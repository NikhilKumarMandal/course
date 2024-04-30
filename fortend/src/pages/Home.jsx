import React from 'react'
import Header from '../components/Header/Header.jsx'
import { Link } from "react-router-dom";
import { AuroraHero } from '../components/AuroraHero.jsx';

function Home() {
  return (
    <Header>

        <AuroraHero/>
         <div className="pt-10 text-white flex items-center justify-center gap-10 mx-16 h-[90vh]">
                <div className="w-1/2 space-y-6">
                    <h1 className="text-5xl font-semibold">
                        Find out best
                        <span className="text-green-500 font-bold p-1">
                            Online Courses
                        </span>
                    </h1>
                    <p className="text-xl text-gray-200">
                        We have a large library of courses taught by highly skilled and qualified faculties at a very affordable cost.
                    </p>

                    <div className="space-x-6">
                        <Link to="/courses">
                            <button className="bg-green-500 px-5 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-green-600 transition-all ease-in-out duration-300">
                                Explore courses
                            </button>
                        </Link>

                        <Link to="/contact">
                            <button className="border border-green-500 px-5 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-green-600 transition-all ease-in-out duration-300">
                                Contact Us
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="w-1/2 flex items-center justify-center">
                    <img alt="homepage image" src='https://cdni.iconscout.com/illustration/premium/thumb/chai-wala-2704961-2252411.png?f=webp' />
                </div>

            </div>
    </Header>

  )
}

export default Home