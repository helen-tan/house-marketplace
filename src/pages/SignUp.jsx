import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import OAuth from '../components/OAuth'
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'

function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  // destructure name, email and password from the form data
  const {name, email, password} = formData

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // Get auth value with getAuth()
      const auth = getAuth()
      // Register user with createUserWithEmailAndPassword - returns a Promise
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      // Get the user info from the Promise
      const user = userCredential.user

      // update displayName
      updateProfile(auth.currentUser, {
        displayName: name
      })

      // Steps to save user to Firestore database
      const formDataCopy = {...formData}
      delete formDataCopy.password // don't want password to be submitted to database - delete it from object
      formDataCopy.timestamp = serverTimestamp() // setting a new timestamp property in the obj

      await setDoc(doc(db, 'users', user.uid), formDataCopy)

      // Redirect to homepage
      navigate('/')

    } catch(error) {
      toast.error('Something went wrong with registration')
    }
  }

  return (
    <>
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Sign up</p>
      </header>

      <form onSubmit={handleSubmit}>
      <input
          type="text"
          className='nameInput'
          placeholder='Email'
          id='name'
          value={name}
          onChange={handleChange}
        />
        <input
          type="email"
          className='emailInput'
          placeholder='Email'
          id='email'
          value={email}
          onChange={handleChange}
        />
        <div className="passwordInputDiv">
          <input
            type={showPassword ? 'text' : 'password'}
            className='passwordInput'
            placeholder='Password'
            id='password'
            value={password}
            onChange={handleChange}
          />
          <img src={visibilityIcon} alt="show password"
          className='showPassword' onClick={() => setShowPassword((prevState) => !prevState)}/>
        </div>

        <div className="signUpBar">
          <p className="signUpText">Create Account</p>
          <button className="signUpButton">
            <ArrowRightIcon fill='#ffffff' width='34px' height='34px'/>
          </button>
        </div>
      </form>

      <OAuth />

      <Link to='/sign-in' className='registerLink'>Already have an account? Sign In</Link>
    </div>
    </>
  )
}

export default SignUp
