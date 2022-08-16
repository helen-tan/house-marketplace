import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'
import Spinner from '../components/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl'
import mapboxgl from 'mapbox-gl'
import { FaMapMarkerAlt } from 'react-icons/fa'
import {Navigation, Pagination, Scrollbar, A11y} from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/a11y';


function Listing() {
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [shareLinkCopied, setShareLinkCopied] = useState(false)
  const [markerClicked, setMarkerClicked] = useState(true)

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
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        slidesPerView={1}
        pagination={{ clickable: true }}
        navigation
         style={{ height: '300px' }}
      >
        {listing.imageUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              style={{
                background: `url(${listing.imageUrls[index]}) center no-repeat`,
                backgroundSize: 'cover'
              }}
              className="swiperSlideDiv"
            ></div>
          </SwiperSlide>
        ))}

      </Swiper>

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
          <div className="leafletContainer">
            <Map
              mapboxAccessToken={process.env.REACT_APP_MAPBOX_API_KEY}
              initialViewState={{
                longitude: listing.geolocation.lng,
                latitude: listing.geolocation.lat,
                zoom: 13
              }}
              style={{width: 600, height: 400}}
              mapStyle="mapbox://styles/mapbox/streets-v11"
            >
              <Marker anchor='center' latitude={listing.geolocation.lat} longitude={listing.geolocation.lng} onClick={() => {setMarkerClicked(!markerClicked)}}>
                  <FaMapMarkerAlt color="red" size="3em"/>
              </Marker>

              {markerClicked && (
                <Popup latitude={listing.geolocation.lat} longitude={listing.geolocation.lng} closeOnClick={false} >
                  <div>{listing.location}</div>
                </Popup>
              )}

              <NavigationControl position='top-left' showCompass={false}/>
            </Map>
          </div>


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
