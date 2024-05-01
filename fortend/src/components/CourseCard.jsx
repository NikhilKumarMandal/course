import React from 'react'
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function CourseCard({data}) {
    const cardVariants = {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
      };
    const navigate = useNavigate();
  return (
    <motion.div
    initial="initial"
    animate="animate"
    variants={cardVariants}
    onClick={() => navigate("/course/description/", { state: { ...data } })}
    className="relative w-[22rem] h-[430px] rounded-lg overflow-hidden shadow-xl cursor-pointer group bg-gray-900"
  >
    <div className="overflow-hidden h-full rounded-lg bg-gradient-to-br from-indigo-900 to-purple-900">
      <motion.img
        whileHover={{ scale: 1.05 }}
        className="w-full h-[250px] object-cover object-center rounded-t-lg"
        src={data?.poster?.url}
        alt="course thumbnail"
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50 backdrop-blur-lg">
        <h2 className="text-xl font-bold text-yellow-400 mb-2">{data?.title}</h2>
        <p className="text-gray-300 line-clamp-3 mb-3">{data?.description}</p>
        <div className="flex items-center justify-between text-gray-400">
          <p>
            <span className="font-semibold text-yellow-400">Category:</span> {data?.category}
          </p>
          <p>
            <span className="font-semibold text-yellow-400">Lectures:</span> {data?.numOfVideos}
          </p>
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="font-semibold text-yellow-400">Instructor:</p>
          <p className="font-semibold">{data?.createdBy}</p>
        </div>
      </div>
    </div>
  </motion.div>

  )
}

export default CourseCard