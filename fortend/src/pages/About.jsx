import React from 'react'
import Header from '../components/Header/Header.jsx'
import tea from '../assets/tea.png'
function About() {
  return (
    <Header>
        <div className="pl-20 pt-20 flex flex-col text-white">
                <div className="flex items-center gap-5 mx-10">
                    <section className="w-1/2 space-y-10">
                        <h1 className="text-5xl text-yellow-500 font-semibold">
                            Affordable and quality Chai <span>💕</span>
                        </h1>
                        <p className="text-xl text-gray-200">
                        Many people drink tea for its potential health benefits, such as improving heart health, boosting the immune system, aiding digestion, and reducing the risk of chronic diseases.
                        <br />
                        Tea contains caffeine, which helps to stimulate alertness and concentration. 
                        </p>
                    </section>

                    <div className="w-1/2">
                        <img
                            id="test1"
                            style={{
                                filter: "drop-shadow(0px 10px 10px rgb(0,0,0));"
                            }}
                            alt="about main image"
                            className="drop-shadow-2xl"
                            src={tea}
                        />
                    </div>
                </div>

                <div className="carousel w-1/2 m-auto my-16">
                   
                </div>


            </div>
    </Header>
  )
}

export default About