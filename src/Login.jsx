import { useEffect, useState } from "react";
import Logo from '../public/images/Mystery Hunt (1).png'
import db from "./firebase/firebase-config";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function Login() {

    const [email, setEmail] = useState(localStorage.getItem("email") || "");
    const [lotNumber, setLotNumber] = useState(localStorage.getItem("lotNumber") || "");
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") == "true");
    // const [timer, setTimer] = useState(parseInt(localStorage.getItem("timer"), 10) || 0);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        } else {
            navigate("/qr-scanner");
        }

    }, [isLoggedIn, navigate]);

    // useEffect(() => {
    //     let interval;

    //     if (isLoggedIn) {
    //         interval = setInterval(() => {
    //             setTimer((prev) => {
    //                 const updatedTime = prev + 1;
    //                 localStorage.setItem("timer", updatedTime);
    //                 return updatedTime;
    //             })
    //         }, 1000);
    //     } else {
    //         clearInterval(interval);
    //     }

    //     return () => clearInterval(interval);
    // }, [isLoggedIn]);

    // const formatTime = (seconds) => {
    //     const hours = Math.floor(seconds / 3600).toString().padStart(2, "0");
    //     const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    //     const secs = (seconds % 60).toString().padStart(2, "0");
    //     return `${hours}:${minutes}:${secs}`;
    // };

    const validateUserLogin = async (email, lotnumber) => {
        try {
            const userRef = collection(db, "users");
            const q = query(userRef, where("email", "==", email), where("lotno", "==", lotnumber), where("status", "==", 0));
            const querySnapShot = await getDocs(q);

            if (!querySnapShot.empty) {
                querySnapShot.forEach(async (docSnapShot) => {
                    console.log("User Data:", docSnapShot.data());

                    const userDocRef = doc(db, "users", docSnapShot.id);
                    await updateDoc(userDocRef, { status: 1 });
                    console.log("User status updated");
                });

                return true;
            } else {
                console.log("Invalid email or lot number or Already Logged In");
                return false;
            }
        } catch (error) {
            console.error("Error validating user login:", error.message);
            return false;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !lotNumber) {
            Swal.fire({
                icon: "warning",
                title: "Warning",
                text: "Please Fill Out All Fields!",
            });
            return;
        }

        const isValidUser = await validateUserLogin(email, lotNumber);

        if (isValidUser) {

            Swal.fire({
                icon: "success",
                title: "Login!",
                text: "Login Successfully!",
            });

            setIsLoggedIn(true);

            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("lotNumber", lotNumber);
            localStorage.setItem("email", email);

            setEmail("");
            setLotNumber("");

            navigate("/qr-scanner");
        } else {
            Swal.fire({
                icon: "error",
                title: "Invalid!",
                text: "Invalid email or lot number. Please try again.",
            });
        }
    }

    return (
        <>
            {/* <div>
                <img src="../public/images/qs.png" alt="" className="img-fluid" />
            </div> */}
            
            <div className="container mt-5 vh-100">
                <div className="text-center d-flex justify-content-around">
                    {/* <img src={qr_logo} width={100} alt="code_logo" />
                    <img src={code_logo} width={100} alt="code_logo" /> */}
                    <img src={Logo} alt="" className="img-fluid" width={200}/>
                </div>
                <h3 className="text-center">Start Track Your Treasure</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label><span className="text-danger">*</span>
                        <input type="email" className="form-control" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Lot Number</label><span className="text-danger">*</span>
                        <input type="number" className="form-control" placeholder="Lot Number" onChange={(e) => setLotNumber(e.target.value)} />
                    </div><br/>
                    <div className="text-center">
                        <input type="submit" value="Start" className="btn btn-outline-success btn-block" />
                    </div>
                </form>
            </div>
        </>
    )
}
