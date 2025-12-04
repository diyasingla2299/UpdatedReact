
// import React, { useState, useEffect } from 'react';
// import api from '../api/axios';
// import { useNavigate, Link } from 'react-router-dom';
// import './SignUpPage.css';
// import loginBg from '../images/login_page_background.jpg';
 
// export default function SignUpPage() {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');            
//   const [role, setRole] = useState('BUYER');    // default value must match backend ENUM   
//   const [password, setPassword] = useState('');
//   const [phone, setPhone] = useState('');            
//   const [locationId, setLocationId] = useState('');  
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
 
//   const submit = async (e) => {
//     e.preventDefault();
//     const form = e.currentTarget;
 
//     if (!form.checkValidity()) {
//       form.reportValidity();
//       return;
//     }
 
//     setError(null);
 
//     try {
//       // FINAL — Matches backend DTO EXACTLY
//       const res = await api.post('/auth/signup', {
//         name: username, 
//         email,
//         password,
//         phone,
//         role,          // ADMIN, SELLER, BUYER
//         locationId,    // MUST match backend variable name
//       });
 
//       const { token, username: uname } = res.data || {};
 
//       if (token) localStorage.setItem('token', token);
//       if (uname) localStorage.setItem('username', uname);
 
//       navigate('/dashboard');
 
//     } catch (err) {
//       setError(err.response?.data?.error || 'Unable to register. Please try again.');
//     }
//   };
 
//   useEffect(() => {
//     if (!error) return;
//     const timer = setTimeout(() => setError(null), 3000);
//     return () => clearTimeout(timer);
//   }, [error]);
 
//   return (
//     <>
//       <div className="LoginSplit">
 
//         {/* LEFT IMAGE */}
//         <section className="LoginLeft" aria-hidden="true">
//           <div className="LoginHeroBg" style={{ backgroundImage: `url(${loginBg})` }} />
//         </section>
 
//         {/* RIGHT FORM */}
//         <section className="LoginRight">
//           <div className="LoginCard">
 
//             <h2 className="h1_label"><i>Please Enter Your Details</i></h2>
 
//             <form onSubmit={submit} className="LoginForm" noValidate>
 
//               {/* Username */}
//               <div className="FormRow">
//                 <label htmlFor="username"><b>&nbsp;&nbsp;&nbsp;&nbsp;Username</b></label>
//                 <input
//                   id="username"
//                   className="input1"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   autoComplete="username"
//                   required
//                 />
//               </div>
 
//               {/* Email */}
//               <div className="FormRow">
//                 <label htmlFor="email"><b>&nbsp;&nbsp;&nbsp;&nbsp;Email</b></label>
//                 <input
//                   id="email"
//                   className="input1"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   autoComplete="email"
//                   placeholder="you@example.com"
//                   required
//                 />
//               </div>
 
//               {/* Password */}
//               <div className="FormRow">
//                 <label htmlFor="password"><b>&nbsp;&nbsp;&nbsp;&nbsp;Password</b></label>
//                 <input
//                   id="password"
//                   className="input1"
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   autoComplete="new-password"
//                   required
//                 />
//               </div>
 
//               {/* Phone Number */}
//               <div className="FormRow">
//                 <label htmlFor="phone"><b>&nbsp;&nbsp;&nbsp;&nbsp;Phone Number</b></label>
//                 <input
//                   id="phone"
//                   className="input1"
//                   type="tel"
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                   autoComplete="tel"
//                   placeholder="+91 98765 43210"
//                   required
//                 />
//               </div>
 
//               {/* Role — Must match backend ENUM */}
//               <div className="FormRow">
//                 <label htmlFor="role"><b>&nbsp;&nbsp;&nbsp;&nbsp;Role</b></label>
//                 <select
//                   id="role"
//                   className="input1"
//                   value={role}
//                   onChange={(e) => setRole(e.target.value)}
//                   required
//                 >
//                   <option value="BUYER">User</option>
//                   <option value="SELLER">Merchant</option>
//                   {/* <option value="ADMIN">Admin</option> */}
//                 </select>
//               </div>
 
//               {/* Location */}
//               <div className="FormRow">
//                 <label htmlFor="locationId"><b>&nbsp;&nbsp;&nbsp;&nbsp;Location</b></label>
//                 <select
//                   id="locationId"
//                   className="input1"
//                   value={locationId}
//                   onChange={(e) => setLocationId(e.target.value)}
//                   required
//                 >
//                   <option value="">Select a Location</option>
//                   <option value="1">Chandigarh</option>
//                   <option value="2">Jaipur</option>
//                   <option value="3">Pune</option>
//                   <option value="4">Bangalore</option>
//                 </select>
//               </div>
 
//               <button className="submit1" type="submit">Register</button>
//             </form>
 
//             <h6 className="h1_label">
//               <i>
//                 Already a user?{' '}
//                 <Link to="/login" className="SignUpLink">Sign In</Link>
//               </i>
//             </h6>
 
//             {error && (
//               <div className="Toast Toast--error" role="alert" aria-live="assertive">
//                 {error}
//               </div>
//             )}
 
//           </div>
//         </section>
 
//       </div>
//     </>
//   );
// }
 

// src/pages/SignUpPage.jsx
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import './SignUpPage.css';
import loginBg from '../images/login_page_background.jpg';

export default function SignUpPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('BUYER');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [locationId, setLocationId] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post('/auth/signup', {
        name: username,
        email,
        password,
        phone,
        role,
        locationId,
      });

      const { token, userId, name } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('username', name);

      navigate('/dashboard');

    } catch (err) {
      setError(err.response?.data?.error || 'Could not register.');
    }
  };

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), 3000);
    return () => clearTimeout(timer);
  }, [error]);

  return (
    <div className="LoginSplit">

      {/* LEFT IMAGE */}
      <section className="LoginLeft">
        <div className="LoginHeroBg" style={{ backgroundImage: `url(${loginBg})` }} />
      </section>

      {/* RIGHT FORM */}
      <section className="LoginRight">
        <div className="LoginCard">

          <h2 className="h1_label"><i>Please Enter Your Details</i></h2>

          <form onSubmit={submit} className="LoginForm">

            <div className="FormRow">
              <label>Username</label>
              <input className="input1" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>

            <div className="FormRow">
              <label>Email</label>
              <input className="input1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="FormRow">
              <label>Password</label>
              <input className="input1" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div className="FormRow">
              <label>Phone</label>
              <input className="input1" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>

            <div className="FormRow">
              <label>Role</label>
              <select className="input1" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="BUYER">User</option>
                <option value="SELLER">Merchant</option>
              </select>
            </div>

            <div className="FormRow">
              <label>Location</label>
              <select className="input1" value={locationId} onChange={(e) => setLocationId(e.target.value)} required>
                <option value="">Select a Location</option>
                <option value="1">Chandigarh</option>
                <option value="2">Jaipur</option>
                <option value="3">Pune</option>
                <option value="4">Bangalore</option>
              </select>
            </div>

            <button className="submit1">Register</button>
          </form>

          <h6 className="h1_label">
            <i>Already a user? <Link to="/login" className="SignUpLink">Sign In</Link></i>
          </h6>

          {error && <div className="Toast Toast--error">{error}</div>}
        </div>
      </section>
    </div>
  );
}
