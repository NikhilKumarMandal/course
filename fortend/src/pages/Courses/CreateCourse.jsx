import React, { useState } from 'react'
import toast from 'react-hot-toast';
import Header from '../../components/Header/Header'
import {  useDispatch } from 'react-redux';
import { Link,useNavigate } from 'react-router-dom';
import {  createNewCourse } from '../../redux/slices/CourseSlice';
import { AiOutlineArrowLeft } from "react-icons/ai";


function CreateCourse() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [previewImage,setPreviewImage] = useState('')

    const [inputData,setInputData] = useState({
        title: '',
        description: '',
        category: '',
        poster: '',
        createdBy: ''
    })

    const handleUserInput = (e) => {
        const {name,value} = e.target;
        setInputData({
          ...inputData,
          [name]: value || '' 
      });
    }

    const handleAdminPoster = (e) => {
        e.preventDefault()

        const uploadImage = e.target.files[0]

        if (uploadImage) {
            setInputData({
                ...inputData,
                poster: uploadImage
            });
            const fileReader = new FileReader()
            fileReader.readAsDataURL(uploadImage);
            fileReader.addEventListener('load', function() {
                console.log(this.result);
                setPreviewImage(this.result)
            })
        }
    }

    const handleAdminInput = async (e) => {
        e.preventDefault()
        if (!inputData.title || !inputData.description || !inputData.category || !inputData.poster || !inputData.createdBy) {
            toast.error(" Please fill all the details ")
        }

      const formData = new FormData();
      formData.append("title", inputData.title);
      formData.append("description", inputData.description);
      formData.append("category", inputData.category);
      formData.append("poster", inputData.poster);
      formData.append("createdBy", inputData.createdBy);

      // dispatch create account action
      const response = await dispatch(createNewCourse(formData));
      if(response?.payload?.success)
        navigate("/courses");

      setSignupData({
          name: "",
          email: "",
          password: "",
          avatar: ""
      });
      setPreviewImage("");
    }

  return (
    <Header>
<div className="flex items-center justify-center h-[100vh]">
                <form
                    onSubmit={handleAdminInput}
                    className="flex flex-col justify-center gap-5 rounded-lg p-4 text-white w-[700px] my-10 shadow-[0_0_10px_black] relative"
                >
                    
                    <Link className="absolute top-8 text-2xl link text-accent cursor-pointer">
                        <AiOutlineArrowLeft />
                    </Link>

                    <h1 className="text-center text-2xl font-bold">
                        Create New Course
                    </h1>

                    <main className="grid grid-cols-2 gap-x-10">
                        <div className="gap-y-6">
                            <div>
                                <label htmlFor="image_uploads" className="cursor-pointer">
                                    {previewImage ? (
                                        <img 
                                            className="w-full h-44 m-auto border"
                                            src={previewImage}
                                        />
                                    ): (
                                        <div className="w-full h-44 m-auto flex items-center justify-center border">
                                            <h1 className="font-bold text-lg">Upload your course poster</h1>
                                        </div>
                                    )}

                                </label>
                                <input 
                                    className="hidden"
                                    type="file"
                                    id="image_uploads"
                                    accept=".jpg, .jpeg, .png"
                                    name="image_uploads"
                                    onChange={handleAdminPoster}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-lg font-semibold" htmlFor="title">
                                    Course title
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="title"
                                    id="title"
                                    placeholder="Enter course title"
                                    className="bg-transparent px-2 py-1 border"
                                    value={inputData.title}
                                    onChange={handleUserInput}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <div className="flex flex-col gap-1">
                                <label className="text-lg font-semibold" htmlFor="createdBy">
                                    Course Instructor
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="createdBy"
                                    id="createdBy"
                                    placeholder="Enter course instructor"
                                    className="bg-transparent px-2 py-1 border"
                                    value={inputData.createdBy}
                                    onChange={handleUserInput}
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-lg font-semibold" htmlFor="category">
                                    Course category
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="category"
                                    id="category"
                                    placeholder="Enter course category"
                                    className="bg-transparent px-2 py-1 border"
                                    value={inputData.category}
                                    onChange={handleUserInput}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-lg font-semibold" htmlFor="description">
                                    Course description
                                </label>
                                <textarea
                                    required
                                    type="text"
                                    name="description"
                                    id="description"
                                    placeholder="Enter course description"
                                    className="bg-transparent px-2 py-1 h-24 overflow-y-scroll resize-none border"
                                    value={inputData.description}
                                    onChange={handleUserInput}
                                />
                            </div>
                        </div>
                    </main>

                    <button type="submit" className="w-full py-2 rounded-sm font-semibold text-lg cursor-pointer bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300">
                        Create Course
                    </button>


                </form>
                </div>
    </Header>
  )
}

export default CreateCourse