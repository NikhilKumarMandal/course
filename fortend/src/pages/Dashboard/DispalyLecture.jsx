import React, { useEffect,useState } from 'react'
import {useDispatch,useSelector} from 'react-redux'
import {useNavigate,useLocation} from 'react-router-dom'
import { getCourseLectures,deleteCourseLecture } from '../../redux/slices/LectureSlice.js'
import Header from '../../components/Header/Header.jsx'

function DispalyLecture() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {lectures} = useSelector((state) => state?.lecture)
    const {state} = useLocation()
    const {role} = useSelector((state) => state?.auth)

    console.log(role);

    const [currentVideo, setCurrentVideo] = useState(0);

    const onLectureDelete = async (courseId,lectureId) => {
        console.log("hello World!!!!",courseId, lectureId);
        await dispatch(deleteCourseLecture({courseId: courseId, lectureId: lectureId}));
        await dispatch(getCourseLectures(courseId));
    }

    

    useEffect(() => {
        console.log("helo",state);
        if(!state) navigate("/courses");
        const res = dispatch(getCourseLectures(state._id))
        console.log("world",res.data);
    },[])

    console.log("hello wolrld",lectures && lectures[currentVideo]?.avatar?.url);
  
  return (
    <Header>
      <div className="flex flex-col gap-10 items-center justify-center min-h-[90vh] py-10 text-wihte mx-[5%]">
                <div className="text-center text-2xl font-semibold text-yellow-500">
                    Course Name: {state?.title}
                </div>

                {(lectures && lectures.length > 0 ) ?  
                    (<div className="flex justify-center gap-10 w-full">
                    {/* left section for playing videos and displaying course details to admin */}
                   <div className="space-y-5 w-[28rem] p-2 rounded-lg shadow-[0_0_10px_black]">
                        <video 
                            src={lectures && lectures[currentVideo]?.avatar?.url}
                            className="object-fill rounded-tl-lg rounded-tr-lg w-full"   
                            controls
                            disablePictureInPicture
                            muted
                            controlsList="nodownload"
                            preload="metadata"
                        >
                          
                        </video>    
                        <div>
                            <h1>
                                <span className="text-yellow-500"> Title: {" "}
                                </span>
                                {lectures && lectures[currentVideo]?.title}
                            </h1>
                            <p>
                                <span className="text-yellow-500 line-clamp-4">
                                    Description: {" "}
                                </span>
                                {lectures && lectures[currentVideo]?.description}
                            </p>
                        </div>
                   </div>

                   {/* right section for displaying list of lectres */}
                   <ul className="w-[28rem] p-2 rounded-lg shadow-[0_0_10px_black] space-y-4">
                        <li className="font-semibold text-xl text-yellow-500 flex items-center justify-between">
                            <p>Lectures list</p>
                            {role === "admin" && (
                                <button onClick={() => navigate("/course/addlecture", {state: {...state}})} className="btn-primary px-2 py-1 rounded-md font-semibold text-sm">
                                    Add new lecture
                                </button>
                            )}
                        </li> 
                        {lectures && 
                            lectures.map((lecture, idx) => {
                                return (
                                    <li className="space-y-2" key={lecture._id} >
                                        <p className="cursor-pointer" onClick={() => setCurrentVideo(idx)}>
                                            <span>
                                                {" "} Lecture {idx + 1} : {" "}
                                            </span>
                                            {lecture?.title}
                                        </p>
                                        {role === "admin" && (
                                            <button onClick={() => onLectureDelete(state?._id, lecture?._id)} className="btn-accent px-2 py-1 rounded-md font-semibold text-sm">
                                                Delete lecture
                                            </button>
                                        )}
                                    </li>
                                )
                            })    
                        }
                   </ul>
                </div>) : (
                    role === "admin" && (
                        <button onClick={() => navigate("/course/addlecture", {state: {...state}})} className="btn-primary px-2 py-1 rounded-md font-semibold text-sm">
                            Add new lecture
                        </button>
                    )
                )}
            </div>
    </Header>
  )
}

export default DispalyLecture
