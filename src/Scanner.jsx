import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { QrReader } from "react-qr-reader";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import db from "./firebase/firebase-config";
import Swal from "sweetalert2";

export default function Scanner() {

    const [scanResult, setScanResult] = useState("");
    const [eventstatus, setEventStatus] = useState([]);

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

            if (userCompletedLevels >= 6) {
                setTimeout(() => {
                    Swal.fire({
                        title: "Congratulations !!!",
                        text: "You have successfully completed all 6 levels.",
                        icon: "success"
                    });
                    handleLogout();
                }, 1000);
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

        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = "Do you want to exit from the event?";
            handleLogout();
        };

        const preventBackNavigation = () => {
            window.history.pushState(null, null, window.location.href);
        }

        const handleNavigationAttempt = (e) => {
            e.preventDefault();
            const confirmExit = window.confirm("Do you want to exit from the event?");
            if (!confirmExit) {
                window.history.pushState(null, null, window.location.href);
            } else {
                handleLogout();
            }
        };

        window.history.pushState(null, null, window.location.href);
        window.addEventListener("popstate", preventBackNavigation);
        window.addEventListener("popstate", handleNavigationAttempt);
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("popstate", handleNavigationAttempt);
        };

    }, [isLoggedIn, navigate])

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
        const confirmLogout = window.confirm("Are you sure to Quit the Event?");

        if (confirmLogout) {
            navigate("/login");
            localStorage.clear();
            setIsLoggedIn(false);
        }
    }

    const handleScan = async (result, error) => {
        if (result) {
            const encryptedClue = result.text;
            setScanResult(encryptedClue);

            try {
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
                        // localStorage.setItem("clueData", JSON.stringify(data));
                    })

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

                <div className="text-center">
                    <button onClick={handleLogout} className="btn btn-danger mt-3">
                        Quit Event
                    </button>
                </div>
            </div>
        </>
    )
}
