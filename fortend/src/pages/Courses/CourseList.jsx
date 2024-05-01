import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllCourses } from '../../redux/slices/CourseSlice';
import Header from '../../components/Header/Header'
import CourseCard from '../../components/CourseCard';

function CourseList() {
    const dispatch = useDispatch()
    
    const {courseData} = useSelector((state) => state.course);

    const loadCourse = async () => {
        await dispatch(getAllCourses())
    }

    useEffect(() => {
        loadCourse()
    }, [])


  return (
    <Header>
       <div className="min-h-screen pt-12 px-4 sm:px-6 lg:px-8 flex flex-col gap-6 text-white">
    <h1 className="text-center text-3xl font-semibold mb-3 sm:mb-5">
        Explore the courses made by
        <span className="font-bold text-yellow-500">
            Industry experts
        </span>
    </h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {courseData?.map((element) => {
            return <CourseCard key={element._id} data={element} />;
        })}
    </div>
</div>

    </Header>
  )
}

export default CourseList