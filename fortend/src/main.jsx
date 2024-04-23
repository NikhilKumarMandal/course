import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import toast, { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux'
import store from './redux/store.js'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import NotFound from './pages/NotFound.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx';
import CourseList from './pages/Courses/CourseList.jsx';
import Contact from './pages/Contact.jsx';
import CourseDescription from './pages/Courses/CourseDescription.jsx';
import Denied from './pages/Denied.jsx';
import RequrieAuth from './components/RequrieAuth.jsx';
import CreateCourse from './pages/Courses/CreateCourse.jsx';



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
    <Route path='/' element={<Home/>}/>
    <Route path='/about' element={<About/>} />
    <Route path='/signup' element={<Signup/>} />
    <Route path='/login' element={<Login/>} />
    <Route path='/denied' element={<Denied/>} />
    <Route path='/courses' element={<CourseList/>} />
    <Route path='/contact' element={<Contact/>} />
    <Route path='/course/description/' element={<CourseDescription/>} />
    <Route path="*" element={<NotFound />}/>

    <Route  element={<RequrieAuth allowedRole={['admin']} /> }>
    <Route path="/course/create" element={<CreateCourse/>}/>
    </Route>
    
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <Toaster />
  <React.StrictMode>
  <RouterProvider router={router} />
  </React.StrictMode>
  </Provider>,
)
