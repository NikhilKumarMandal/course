import React from 'react'
import Header from '../components/Header/Header.jsx'
import fuck from '../assets/fuck.png'
function About() {
  return (
    <Header>
        <div className="min-h-screen pt-12 px-4 sm:px-6 lg:px-8 flex flex-col gap-6 text-white">
    <div className="flex flex-col md:flex-row items-center gap-5">
        <section className="w-full md:w-1/2 space-y-5 md:space-y-10">
        <h1 className="text-4xl md:text-5xl text-yellow-500 font-semibold p-4 pb-8">
        Affordable and quality Courses <span>💕</span>
       </h1>
            <p className="text-base md:text-xl text-gray-200">
            Are you looking to enhance your skills, boost your career prospects, or explore new interests without breaking the bank? Look no further! Our platform offers a diverse range of affordable and high-quality courses designed to meet your learning needs.
            
            </p>
        </section>

        <div className="w-full md:w-1/2">
            <img
                id="test1"
                style={{
                    filter: "drop-shadow(0px 10px 10px rgb(0,0,0));"
                }}
                alt="about main image"
                className="drop-shadow-2xl w-full"
                src={fuck}
            />
        </div>
    </div>
    <section className="py-6 ">
	<div className="container flex flex-col items-center justify-center p-4 mx-auto space-y-8 sm:p-10">
		<h1 className="text-4xl font-bold leading-none text-center sm:text-5xl">Our team</h1>
		<p className="max-w-2xl text-center dark:text-gray-600">At a assumenda quas cum earum ut itaque commodi saepe rem aspernatur quam natus quis nihil quod, hic explicabo doloribus magnam neque, exercitationem eius sunt!</p>
		<div className="flex flex-row flex-wrap-reverse justify-center">
			<div className="flex flex-col justify-center m-8 text-center">
				<img alt="" className="self-center flex-shrink-0 w-24 h-24 mb-4 bg-center bg-cover rounded-full dark:bg-gray-500" src="https://source.unsplash.com/100x100/?portrait?0" />
				<p className="text-xl font-semibold leading-tight">Leroy Jenkins</p>
				<p className="dark:text-gray-600">Visual Designer</p>
			</div>
			<div className="flex flex-col justify-center m-8 text-center bg-cover">
				<img alt="" className="self-center flex-shrink-0 w-24 h-24 mb-4 bg-center bg-cover rounded-full dark:bg-gray-500" src="https://source.unsplash.com/100x100/?portrait?1" />
				<p className="text-xl font-semibold leading-tight">Leroy Jenkins</p>
				<p className="dark:text-gray-600">Visual Designer</p>
			</div>
			<div className="flex flex-col justify-center m-8 text-center">
				<img alt="" className="self-center flex-shrink-0 w-24 h-24 mb-4 bg-center bg-cover rounded-full dark:bg-gray-500" src="https://source.unsplash.com/100x100/?portrait?2" />
				<p className="text-xl font-semibold leading-tight">Leroy Jenkins</p>
				<p className="dark:text-gray-600">Visual Designer</p>
			</div>
			<div className="flex flex-col justify-center m-8 text-center">
				<img alt="" className="self-center flex-shrink-0 w-24 h-24 mb-4 bg-center bg-cover rounded-full dark:bg-gray-500" src="https://source.unsplash.com/100x100/?portrait?3" />
				<p className="text-xl font-semibold leading-tight">Leroy Jenkins</p>
				<p className="dark:text-gray-600">Visual Designer</p>
			</div>
			<div className="flex flex-col justify-center m-8 text-center">
				<img alt="" className="self-center flex-shrink-0 w-24 h-24 mb-4 bg-center bg-cover rounded-full dark:bg-gray-500" src="https://source.unsplash.com/100x100/?portrait?4" />
				<p className="text-xl font-semibold leading-tight">Leroy Jenkins</p>
				<p className="dark:text-gray-600">Visual Designer</p>
			</div>
			<div className="flex flex-col justify-center m-8 text-center">
				<img alt="" className="self-center flex-shrink-0 w-24 h-24 mb-4 bg-center bg-cover rounded-full dark:bg-gray-500" src="https://source.unsplash.com/100x100/?portrait?5" />
				<p className="text-xl font-semibold leading-tight">Leroy Jenkins</p>
				<p className="dark:text-gray-600">Visual Designer</p>
			</div>
		</div>
	</div>
</section>
    
</div>





    </Header>
  )
}

export default About