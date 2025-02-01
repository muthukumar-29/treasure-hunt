import CryptoJS from "crypto-js"
import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc, arrayUnion, addDoc } from "firebase/firestore";
import db from "./firebase/firebase-config";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";


export default function Question() {

    const navigate = useNavigate();

    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [answer, setAnswer] = useState("");

    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') == "true");

    const encrypted = localStorage.getItem("encryptedClue") || "";
    const secretKey = "my-secret-key"

    // const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
    // const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    // console.log("Decrypted:" + decrypted);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        } else {
            enableFullScreen();
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


    useEffect(() => {

        const fetchQuestion = async () => {
            try {
                const lotNumber = localStorage.getItem('lotNumber') || 'ananymous';
                const queriesRef = collection(db, "queries");

                const querySnapShot = await getDocs(queriesRef);

                const questions = [];
                querySnapShot.forEach((doc) => {
                    const questionData = doc.data();
                    console.log(questionData.answeredBy);
                    questions.push({ id: doc.id, ...questionData });
                });

                const unansweredQuestions = questions.filter((question) => {
                    return !question.answeredBy.includes(lotNumber);
                });

                if (unansweredQuestions.length === 0) {
                    console.log("No unanswered questions found!");
                    setQuestion(null);
                } else {
                    const randomIndex = Math.floor(Math.random() * unansweredQuestions.length);
                    const randomQuestion = unansweredQuestions[randomIndex];

                    setQuestion(randomQuestion);
                }

            } catch (error) {
                console.error("Error fetching question" + error)
            } finally {
                setLoading(false);
            }
        }
        fetchQuestion()
    }, [])



    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!question) return;

        if (answer.trim().toLowerCase() === question.answer.trim().toLowerCase()) {
            try {

                const lotNumber = localStorage.getItem("lotNumber") || "anonymous";

                const questionDoc = doc(db, "queries", question.id);
                // await updateDoc(questionDoc, { answered: 1, answeredBy: lotNumber });
                // await updateDoc(questionDoc, { answeredBy: lotNumber });
                await updateDoc(questionDoc, {
                    answeredBy: arrayUnion(lotNumber)
                });

                let i = 1;
                if (i==1) {
                    const eventRef = collection(db, "event");
                    const currentDateAndTime = new Date();
                    const qID = question.id;
                    await addDoc(eventRef, { lotNumber, qID, currentDateAndTime })
                    i++;
                }

                const decryptedClue = CryptoJS.AES.decrypt(encrypted, secretKey).toString(CryptoJS.enc.Utf8);

                Swal.fire({
                    icon: 'success',
                    title: 'Congratulations!',
                    text: `Here is your clue: ${decryptedClue}`,
                });

                navigate("/qr-scanner")

            } catch (error) {
                console.error("Error updating Firestore:", error);
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Incorrect Answer',
                text: 'Please try again.',
            });
        }
    };

    return (
        <div>
            <h4 className="text-center">Welcome to Treasure Hunt !!!</h4>

            {loading && <p>Loading question...</p>}

            {!loading && question && (
                <div className="container">
                    {question ? (
                        <>
                            {question.question && <h4>{question.question}</h4>}
                            {question.filePath && <img src={`https://treasure-hunt-uploads.onrender.com${question.filePath}`} alt="Question Image" className="img-fluid" />}
                        </>
                    ) : (
                        <p>No questions to view</p>
                    )}
                    <div>
                        <form onSubmit={handleSubmit}>
                            <input type="text" className="form-control" placeholder="Answer" onChange={(e) => setAnswer(e.target.value)} required />

                            <button type="submit" className="btn btn-primary text-white mt-3 w-100">Submit</button>
                        </form>
                    </div>

                </div>

            )}

            {!loading && !question && (
                <p>No unanswered questions found. Please check back later.</p>
            )}

        </div>
    )
}
