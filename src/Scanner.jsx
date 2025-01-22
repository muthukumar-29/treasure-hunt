import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export default function Scanner() {

    // const [scanResult, setScanResult] = useState("");

    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') == "true");

    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }

        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = "";
        }

        const preventBackNavigation = () => {
            window.history.pushState(null, null, window.location.href);
        }

        window.addEventListener("beforeunload", handleBeforeUnload);
        window.history.pushState(null, null, window.location.href);
        window.addEventListener("popstate", preventBackNavigation);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("popstate", preventBackNavigation);
        };

    }, [])

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure to Quit the Event?");

        if (confirmLogout) {
            navigate("/login");
            localStorage.clear();
            setIsLoggedIn(false);
        }
    }

    // const handleScan = (result, error) => {
    //     if (result) {
    //         setScanResult(result.text);
    //     }

    //     if (error) {
    //         console.error("QR Scan Error:", error);
    //     }
    // };

    return (
        <>
            <div>
                <h1>QR Reader</h1>

                {/* {scanResult && (
                    <div style={{ marginTop: "20px" }}>
                        <h2>Scanned Result:</h2>
                        <p>{scanResult}</p>
                    </div>
                )} */}

                <button onClick={handleLogout} className="btn btn-danger">
                    Quit Event
                </button>
            </div>
        </>
    )
}
