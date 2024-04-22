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
            <div className="min-h-[90vh] pt-12 pl-20 flex flex-col gap-10 text-white">
                <h1 className="text-center text-3xl font-semibold mb-5">
                    Explore the courses made by
                    <span className="font-bold text-yellow-500">
                        Industry experts
                    </span>
                </h1>
                <div className="mb-10 flex flex-wrap gap-14">
                {courseData?.map((element) => {
                        return <CourseCard key={element._id} data={element} />
                    })}

                </div>
            </div>
    </Header>
  )
}

export default CourseList