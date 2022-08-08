import { useState } from 'react'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import OAuth from '../components/OAuth'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'

function SignIn() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  // destructure email and password from the form data
  const {email, password} = formData

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
      const auth = getAuth()
      const userCredential = await signInWithEmailAndPassword(auth, email, password)

      if(userCredential.user) {
        navigate('/')
      }
    } catch(error) {
      toast.error('Bad User Credentials')
    }
  }

  return (
    <>
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Welcome Back!</p>
      </header>

      <form onSubmit={handleSubmit}>
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

        <Link to='/forgot-password' className='forgotPasswordLink'>Forgot Password</Link>

        <div className="signInBar">
          <p className="signInText">Sign In</p>
          <button className="signInButton">
            <ArrowRightIcon fill='#ffffff' width='34px' height='34px'/>
          </button>
        </div>
      </form>

      <OAuth />

      <Link to='/sign-up'm className='registerLink'>Sign Up Instead</Link>
    </div>
    </>
  )
}

export default SignIn
