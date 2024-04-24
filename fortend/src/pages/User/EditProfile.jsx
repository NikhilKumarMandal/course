import React,{useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getUserData, updateProfile } from '../../redux/slices/AuthSlice';
import Header from '../../components/Header/Header';
import { AiOutlineArrowLeft } from "react-icons/ai";
import { BsPersonCircle } from 'react-icons/bs';

function EditProfile() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [previewImage,setPreviewImage] = useState('')

    const [updateData,setUpdateData] = useState({
        name: '',
        avatar: '',
    })

    const handleUserInput = (e) => {
        const {name,value} = e.target;
        setUpdateData({
          ...updateData,
          [name]: value || '' 
      });
    }

    const handleUpdateAvatar = (e) => {
        e.preventDefault()

        const uploadImage = e.target.files[0]

        if (uploadImage) {
            setUpdateData({
                ...updateData,
                avatar: uploadImage
            });
            const fileReader = new FileReader()
            fileReader.readAsDataURL(uploadImage);
            fileReader.addEventListener('load', function() {
                console.log(this.result);
                setPreviewImage(this.result)
            })
        }
    }

    const updateUserAccount = async (e) => {
        e.preventDefault()

        if ((!updateData.name && !updateData.avatar) || (updateData.name && updateData.name.trim().length < 5)) {
            if (!updateData.name && !updateData.avatar) {
                toast.error("At least one field is required");
            } else if (updateData.name.trim().length < 5) {
                toast.error("Name should be at least 5 characters");
            }
            return;
        }
        console.log("Submitting:", updateData);
        const formData = new FormData();
        if (updateData.name.trim()) {
            formData.append("name", updateData.name.trim());
        }
        if (updateData.avatar) {
            formData.append("avatar", updateData.avatar);
        }

        await dispatch(updateProfile(updateData))
        await dispatch(getUserData())
      
        navigate('/user/profile')
    }

  return (
    <Header>
            <div className="flex items-center justify-center h-[100vh]">
                <form
                    onSubmit={updateUserAccount}
                    noValidate
                    className="flex flex-col justify-center gap-5 rounded-lg p-4 text-white w-80 min-h-[26rem] shadow-[0_0_10px_black]"
                >
                    <h1 className="text-center text-2xl font-semibold">Edit profile</h1>
                    <label className="cursor-pointer" htmlFor="image_uploads">
                        {previewImage ? (
                            <img 
                                className="w-28 h-28 rounded-full m-auto"
                                src={previewImage}

                            />
                        ): (
                            <BsPersonCircle className="w-28 h-28 rounded-full m-auto" />
                        )}
                    </label>
                    <input 
                        onChange={handleUpdateAvatar}
                        className="hidden"
                        type="file"
                        id="image_uploads"
                        name="image_uploads"     
                    />
                    <div className="flex flex-col gap-1">
                        <label htmlFor="fullName" className="text-lg font-semibold">Full Name</label>
                        <input 
                            required
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Enter your name"
                            className="bg-transparent px-2 py-1 border"
                            value={updateData.name}
                            onChange={handleUserInput}
                        
                        />
                    </div>
                    <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 text-lg cursor-pointer">
                        Update profile
                    </button>
                    <Link to="/user/profile">
                        <p className="link text-accent cursor-pointer flex items-center justify-center w-full gap-2">
                            <AiOutlineArrowLeft /> Go back to profile
                        </p>
                    </Link>
                </form>
            </div>
    </Header>
  )
}

export default EditProfile
