import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllCourses } from '../../redux/slices/CourseSlice';
import Header from '../../components/Header/Header'
import CourseCard from '../../components/CourseCard';
import { useNavigate } from 'react-router-dom';

function CourseList() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    const {courseData} = useSelector((state) => state.course);
    const {isLoggedIn} = useSelector((state) => state?.auth)

    console.log("hello",isLoggedIn);

    useEffect(() => {
        if (isLoggedIn === false) {
            navigate('/login')
        }
    },[])

  
  console.log(action.payload);
    



    useEffect(() => {
        dispatch(getAllCourses())  
    }, [])


  return (
    <Header>
    <div className="container mx-auto pt-12 px-4 sm:px-6 lg:px-8 text-white">
      <h1 className="text-center text-3xl sm:text-4xl font-semibold mb-3 sm:mb-5">
        Explore the courses made by{" "}
        <span className="font-bold text-yellow-500">Industry experts</span>
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {courseData?.map((element) => (
          <div
            key={element._id}
            className="flex justify-center w-full sm:w-auto"
          >
            <CourseCard data={element} />
          </div>
        ))}
      </div>
    </div>
  </Header>
  )
}

export default CourseList