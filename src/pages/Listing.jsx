import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
import Spinner from '../components/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'
import Map, { Marker } from 'react-map-gl'
import mapboxgl from 'mapbox-gl'

function Listing() {
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [shareLinkCopied, setShareLinkCopied] = useState(false)

  const navigate = useNavigate()
  const params = useParams()
  const auth = getAuth()

  // Fetch data of single listing from firestore DB
  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.listingId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        setListing(docSnap.data())
        setLoading(false)
      }
    }

    fetchListing()
  }, [navigate, params.listingId])


  if (loading) {
    return <Spinner />
  }

  return (
    <main>
      {/* Slider */}

      {/* Share Icon */}
      <div className="shareIconDiv" onClick={() => {
        navigator.clipboard.writeText(window.location.href) // Copy link to clipboard
        setShareLinkCopied(true)
        setTimeout(() => {
          setShareLinkCopied(false)
        }, 2000)
      }}>
        <img src={shareIcon} alt="Share Icon" />
      </div>

      {shareLinkCopied && <p className='linkCopied'>Link Copied!</p>}

      <div className="listingDetails">
        <p className="listingName">
          {listing.name} - ${listing.offer
            ? listing.discountedPrice
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : listing.regularPrice
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </p>
        <p className="listingLocation">{listing.location}</p>
        <p className="listingType">
          For {listing.type === 'rent' ? 'Rent' : 'Sale'}
        </p>
        {/* Show how much is saved if on offer */}
        {listing.offer && (
          <p className='discountPrice'>
            ${listing.regularPrice - listing.discountedPrice} discount
          </p>
        )}

        <ul className='listingDetailsList'>
          <li>
            {listing.bedrooms > 1
              ? `${listing.bedrooms} Bedrooms`
              : '1 Bedroom'}
          </li>
          <li>
            {listing.bathrooms > 1
              ? `${listing.bathrooms} Bathrooms`
              : '1 Bathroom'}
          </li>
          <li>{listing.parking && 'Parking Spot'}</li>
          <li>{listing.furnished && 'Furnished'}</li>

          <p className="listingLocationTitle">Location</p>

          {/* Map */}
          <Map
            mapboxAccessToken={process.env.REACT_APP_MAPBOX_API_KEY}
            initialViewState={{
              longitude: listing.geolocation.lng,
              latitude: listing.geolocation.lat,
              zoom: 13
            }}
            style={{width: 600, height: 400}}
            mapStyle="mapbox://styles/mapbox/streets-v9"
          >

          </Map>


          {/* Contact button to show if listing does not belong to user */}
          {auth.currentUser?.uid !== listing.userRef && (
            <Link to={`/contact/${listing.userRef}?listingName=${listing.name}`} className='primaryButton'>
              Contact Landlord
            </Link>
          )}
        </ul>
      </div>
    </main>
  )
}

export default Listing
