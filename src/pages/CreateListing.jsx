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
    bedrooms: 1,
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
  // Destructure formData
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude
  } = formData

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

  const onSubmit = (e) => {
    e.preventDefault()
    console.log(formData)
  }

  // Executes when we click on one of the form fields
  // In our form it executes when we: click button, type in text field, or when we submit a file
  const onMutate = (e) => {
    let boolean = null
    // for boolean buttons
    if (e.target.value === 'true') {
      boolean = true
    }
    if (e.target.value === 'false') {
      boolean = false
    }
    // Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files
      }) )
    }

    // Text/Booleans/Numbers
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value
      }))
      // if the value is not a boolean (i.e. a null), then it will be assigned the right side value (which is whatever typed in the text field)
    }
  }

  if(loading) {
    return <Spinner />
  }

  return (
    <div className='profile'>
      <header>
        <p className="pageHeader">Create a Listing</p>
      </header>

      <main>
        <form onSubmit={onSubmit}>
          <label className='formLabel'>Sell / Rent</label>
          <div className="formButtons">
            <button
              type='button'
              className={type === 'sale' ? 'formButtonActive' : 'formButton'}
              id='type'
              value='sale'
              onClick={onMutate}>
              Sell
            </button>
            <button
              type='button'
              className={type === 'rent' ? 'formButtonActive' : 'formButton'}
              id='type'
              value='rent'
              onClick={onMutate}>
              Rent
            </button>
          </div>
          {/* Name field */}
          <label className='formLabel'>Name</label>
          <input
            className='formInputName'
            type="text"
            id='name'
            value={name}
            onChange={onMutate}
            maxLength='32'
            minLength='10'
            required
          />
          {/* Bedrooms & Bathrooms fields */}
          <div className="formRooms flex">
            <div>
              <label className='formLabel'>Bedrooms</label>
              <input
                className='formInputSmall'
                type="number"
                id='bedrooms'
                value={bedrooms}
                onChange={onMutate}
                min='1'
                max='50'
                required
              />
            </div>
            <div>
              <label className='formLabel'>Bathrooms</label>
              <input
                className='formInputSmall'
                type='number'
                id='bathrooms'
                value={bathrooms}
                onChange={onMutate}
                min='1'
                max='50'
                required
              />
            </div>
          </div>
          {/* Parking field */}
          <label className='formLabel'>Parking Spot</label>
          <div className="formButtons">
            <button
              className={parking ? 'formButtonActive' : 'formButton'}
              type='button'
              id='parking'
              value={true}
              onClick={onMutate}
              min='1'
              max='50'
            >
              Yes
            </button>
            <button
              className={ !parking && parking !== null ? 'formButtonActive' : 'formButton' }
              type='button'
              id='parking'
              onClick={onMutate}
            >
              No
            </button>
          </div>
          {/* Furnished fields */}
          <label className='formLabel'>Furnished</label>
          <div className="formButtons">
            <button
              className={ furnished ? 'formButtonActive' : 'formButton' }
              type='button'
              id='furnished'
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={ !furnished && furnished !== null ? 'formButtonActive' :'formButton' }
              type='button'
              id='furnished'
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          {/* Address field */}
          <label className='formLabel'>Address</label>
          <textarea
            className='formInputAddress'
            id="address"
            value={address}
            onChange={onMutate}
            required
          />

          {/* If not geolocation enabled, show tha lat and lng fields */}
          { !geolocationEnabled && (
            <div className="formLatLng flex">
              <div>
                <label className='formLabel'>Latitude</label>
                <input
                  className='formInputSmall'
                  type="number"
                  id='latitude'
                  value={latitude}
                  onChange={onMutate}
                  required
                />
              </div>
              <div>
                <label className='formLabel'>Longitude</label>
                <input
                  className='formInputSmall'
                  type="number"
                  id='longitude'
                  value={longitude}
                  onChange={onMutate}
                  required
                />
              </div>
            </div>
          )}

          {/* Offer field */}
          <label className='formLabel'>Offer</label>
          <div className="formButtons">
            <button
              className={ offer ? 'formButtonActive' : 'formButton' }
              type='button'
              id='offer'
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={ !offer && offer !== null ? 'formButtonActive' : 'formButton' }
              type='button'
              id='offer'
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          {/* Regular price field */}
          <label className='formLabel'>Regular Price</label>
          <div className="formPriceDiv">
            <input
              className='formInputSmall'
              type="number"
              id='regularPrice'
              value={regularPrice}
              onChange={onMutate}
              min='50'
              max='750000000'
              required
            />
            { type === 'rent' && (
              <p className='formPriceText'>$ / Month</p>
            )}
          </div>

          {/* Dicounted price field */}
          { offer && (
            <>
              <label className='formLabel'>Discounted Price</label>
              <input
                className='formInputSmall'
                type="number"
                id='discountedPrice'
                value={discountedPrice}
                onChange={onMutate}
                min='50'
                max='750000000'
                required={offer}
              />
            </>
          )}

          {/* Images upload field */}
          <label className='formLabel'>Images</label>
          <p className="imagesInfo">
            The first image will be the cover (max 6)
          </p>
          <input
            className='formInputFile'
            type="file"
            id='images'
            onChange={onMutate}
            max='6'
            accept='.jpg,.png,.jpeg'
            multiple
            required
          />

          <button type='submit' className="primaryButton createListingButton">
            Create Listing
          </button>
        </form>
      </main>
    </div>
  )
}

export default CreateListing
