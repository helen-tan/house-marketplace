import { useState, useEffect, useRef } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import Spinner from '../components/Spinner'

function CreateListing() {
  const [geolocationEnabled, setGeolocationEnabled] = useState(true)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    bedroom: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: '',
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0
  })

  const auth = getAuth()
  const navigate = useNavigate()
  const isMounted = useRef(true)

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if(user) {
          setFormData({...formData, userRef: user.uid}) // add another field 'userRef' tp the formData state
        } else {
          navigate('/sign-in') // if no user, go to sign-in page
        }
      })
    }

    return () => {
      isMounted.current = false
    }
  }, [isMounted])

  if(loading) {
    return <Spinner />
  }

  return (
    <div>CreateListing</div>
  )
}

export default CreateListing
