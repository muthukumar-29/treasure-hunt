import Logo from '../public/images/treasure_hunt_logo.jpg'
import profile from "./assets/profile.png"

export default function Home() {
  return (
    <div>

      <div className='d-flex justify-content-between p-3' style={{ background: '#98D9F9' }} >
        <a href="" className='text-decoration-none text-dark'>Home</a>
        <a href="/login" className='text-decoration-none text-dark'>Login</a>
      </div>

      <div className='text-center initial'>
        <h1 className='title bg-transparent'>MYSTERY HUNT</h1>
      </div>
      <br />
      <div className='container'>
        <h1 className='text-center title'>RULES</h1>

        <div className='row'>
          <div className='col-12 col-md-6 col-lg-6'>
            <img src={Logo} alt="" className='img-fluid' width={400} />
          </div>
          <div className='col-12 col-md-6 col-lg-6 mt-5'>
            <ul style={{ fontSize: '18px' }}>
              <li>Only One Mobile is Allowed.</li>
              <li>One Member from ours to follow Yours.</li>
              <li>Each Team have 5 Questions.</li>
              <li>Answer did not have any spaces and special characters.</li>
              <li>All Letters should in Lowercase.</li>
              <br />
              <p className="font-weight-bold">Note :</p>
              <li className='text-danger font-weight-bold'>Reload or any navigation will affect your participation.</li>
              <li className='text-danger font-weight-bold'>Enable Camera access in<br /> chrome - settings - site settings - access to camera</li>
              <li className='text-danger font-weight-bold'>Do not Turn off your Mobile to affect your participation.</li>
            </ul>
          </div>
        </div>
      </div>

      <br />
      <div>
        <h1 className='text-center title'>Organizers</h1>
        <div className='row'>
          <div className='col-12 col-lg-2'>
            <img src={profile} alt="" className='img-fluid p-5' />
            <p className='font-weight-bold text-center'> Ms. P. BARKAVI <br /> Assistant Professor <br /> Organizing Head </p>
          </div>
          <div className='col-12 col-lg-2'>
            <img src={profile} alt="" className='img-fluid p-5' />
            <p className='font-weight-bold text-center'> M. MUTHUKUMAR <br /> I - MCA </p>
          </div>
          <div className='col-12 col-lg-2'>
            <img src={profile} alt="" className='img-fluid p-5' />
            <p className='font-weight-bold text-center'> B. BASKAR <br /> I - MCA </p>
          </div>
          <div className='col-12 col-lg-2'>
            <img src={profile} alt="" className='img-fluid p-5' />
            <p className='font-weight-bold text-center'> S. BALAJI <br /> I - MCA </p>
          </div>
          <div className='col-12 col-lg-2'>
            <img src={profile} alt="" className='img-fluid p-5' />
            <p className='font-weight-bold text-center'> B. UDAYAKUMAR <br /> III - BCA 'A'</p>
          </div>
          <div className='col-12 col-lg-2'>
            <img src={profile} alt="" className='img-fluid p-5' />
            <p className='font-weight-bold text-center'> S. PREM KUMAR <br /> III - BCA 'B'</p>
          </div>
        </div>
      </div>

      <br />

      <div className='text-center'>
        <p className='text-white copyright p-3 mb-0'>© {new Date().getFullYear()} QMAZE. All Rights Reserved</p>
      </div>


    </div>
  )
}
