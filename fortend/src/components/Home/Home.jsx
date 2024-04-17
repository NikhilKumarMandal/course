import React from 'react'
import Header from '../Header/Header'
import { Link } from "react-router-dom";

function Home() {
  return (
    <Header>
         <div className="pt-10 text-white flex items-center justify-center gap-10 mx-16 h-[90vh]">
                <div className="w-1/2 space-y-6">
                    <h1 className="text-5xl font-semibold">
                        Find out best
                        <span className="text-green-500 font-bold">
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
                    <img alt="homepage image" src='https://static.vecteezy.com/system/resources/previews/026/428/275/non_2x/3d-programmer-engineer-illustration-concept-of-script-coding-and-programming-web-site-professional-programmer-writing-code-for-testing-computer-software-3d-illustration-png.png' />
                </div>

            </div>
    </Header>

  )
}

export default Home