import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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

  return (
    <>
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Sign up</p>
      </header>

      <form>
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

      {/* Google OAuth */}
      <Link to='/sign-in' className='registerLink'>Already have an account? Sign In</Link>
    </div>
    </>
  )
}

export default SignUp
