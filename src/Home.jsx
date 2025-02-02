import Logo from '../public/images/treasure_hunt_logo.jpg'

export default function Home() {
  return (
    <div>

      <div className='d-flex justify-content-between p-3' style={{ background: '#E8F9FF' }} >
        <a href="" className='text-decoration-none text-dark'>Home</a>
        <a href="/login" className='text-decoration-none text-dark'>Login</a>
      </div>

      <div className='text-center'>
        <h1 className='title bg-transparent' style={{ fontSize: '100px', padding: '200px' }} >MYSTERY HUNT</h1>
      </div>

      <div className='container'>
        <h2 className='text-center title'>RULES</h2>

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
      </div>


    </div>
  )
}
