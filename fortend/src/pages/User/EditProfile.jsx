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

    const [updatedData,setUpdatedData] = useState({
        name: '',
        avatar: '',
    })

    const handleUserUpdateInput = (e) => {
        const {name,value} = e.target;
        setUpdatedData({
          ...updatedData,
          [name]: value 
      });
    }
 
    const handleUserUpdateImage = (e) => {
        e.preventDefault()

        const uploadImage = e.target.files[0]

        if (uploadImage) {
            setUpdatedData({
                ...updatedData,
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

    const handleUpdatedUserAccount = async (e) => {
        e.preventDefault();
        if (!updatedData.name || !updatedData.avatar) {
            toast.error("Please fill all the details");
            return;
        }
        if (!(updatedData.avatar instanceof File)) {
            toast.error("Please select a valid image file for the avatar");
            return;
        }
        // Continue with form submission
        const formData = new FormData();
        formData.append("name", updatedData.name);
        formData.append("avatar", updatedData.avatar);
        const response = await dispatch(updateProfile(formData));
        if(response?.payload?.success)
        await dispatch(getUserData());
        navigate("/user/profile");
    }

  return (
    <Header>
            <div className="flex items-center justify-center h-[100vh]">
                <form
                    onSubmit={handleUpdatedUserAccount}
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
                        onChange={handleUserUpdateImage}
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
                            value={updatedData.name}
                            onChange={handleUserUpdateInput}
                        
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
