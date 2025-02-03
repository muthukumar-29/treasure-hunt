import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { QrReader } from "react-qr-reader";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import db from "./firebase/firebase-config";
// import Swal from "sweetalert2";

export default function Scanner() {

    const [scanResult, setScanResult] = useState("");
    const [eventData, setEventStatus] = useState([]);

    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') == "true");

    const navigate = useNavigate();

    const fetchEventStatus = async () => {
        try {
            const eventRef = collection(db, "event");

            const eventQuery = query(eventRef, orderBy("currentDateAndTime"))

            const querySnapshot = await getDocs(eventQuery);

            const queryList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))

            console.log(queryList);

            setEventStatus(queryList);

            const lotNumber = localStorage.getItem('lotNumber');
            const userCompletedLevels = queryList.filter(event => event.lotNumber === lotNumber).length;

            console.log(`User ${lotNumber} has completed ${userCompletedLevels} levels.`);

            if (userCompletedLevels >= 5) {
                navigate('/qr-scanner');
            }

        } catch (error) {
            console.error("error to fetch Event status", error);
        }
    }


    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        } else {
            enableFullScreen();
            fetchEventStatus();
        }

        // Prevent Back Navigation
        const preventBackNavigation = () => {
            window.history.pushState(null, null, window.location.href);
        };

        window.history.pushState(null, null, window.location.href);
        window.addEventListener("popstate", preventBackNavigation);

        // Ask Confirmation Before Logout on Browser Close or Refresh
        const handleExitEvent = (e) => {
            e.preventDefault();
            e.returnValue = "Are you sure you want to leave the event?";
        };

        window.addEventListener("beforeunload", handleExitEvent);

        // Ask Confirmation Before Logout on Tab Switch or App Minimize
        const handleVisibilityChange = () => {
            if (document.hidden) {
                const confirmExit = window.confirm("You are about to exit the event. Do you want to continue?");
                if (confirmExit) {
                    handleLogout();
                }
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            window.removeEventListener("beforeunload", handleExitEvent);
            window.removeEventListener("popstate", preventBackNavigation);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };

    }, [isLoggedIn, navigate]);

    const enableFullScreen = () => {
        const element = document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen(); // Firefox
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen(); // Chrome, Safari, Opera
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen(); // IE/Edge
        }
    };

    const handleLogout = () => {
        alert("You have exited the event. Logging out...");
        navigate("/login");
        localStorage.clear();
        setIsLoggedIn(false);
    };

    const handleScan = async (result, error) => {
        if (result) {
            const encryptedClue = result.text;
            setScanResult(encryptedClue);

            try {

                let scannedQrList = JSON.parse(localStorage.getItem("scannedQrList")) || [];

                if (scannedQrList.includes(encryptedClue)) {
                    alert("You have already scanned this QR code!");
                    return;
                }

                const clueRef = collection(db, "clue");
                const q = query(clueRef, where("encryptedClue", "==", encryptedClue));

                const querySnapShot = await getDocs(q);

                if (querySnapShot.empty) {
                    console.log("No Matching Found !!!");
                } else {
                    querySnapShot.forEach((doc) => {
                        // const data = doc.data();
                        console.log("Found clue:", doc.id, "=>", doc.data())

                        localStorage.setItem("encryptedClue", encryptedClue);
                    })

                    scannedQrList.push(encryptedClue);
                    fetchEventStatus();
                    localStorage.setItem("scannedQrList", JSON.stringify(scannedQrList));

                    navigate('/question');
                }
            } catch (error) {
                console.error("Error query firebase", error);
            }

        }

        if (error) {
            console.error("QR Scan Error:", error);
        }
    };

    return (
        <>
            <div className="container vh-100">
                <br /><br />
                <h3 className="text-center">Scan Here</h3>

                {scanResult && (
                    <div style={{ marginTop: "20px" }}>
                        {/* <p>{scanResult}</p> */}
                    </div>
                )}

                <QrReader
                    onResult={handleScan}
                    constraints={{ facingMode: "environment" }}
                    style={{ width: "100%" }}
                />

                {/* <div className="text-center">
                    <button onClick={handleLogout} className="btn btn-danger mt-3">
                        Quit Event
                    </button>
                </div> */}
            </div>
        </>
    )
}
