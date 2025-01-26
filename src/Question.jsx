import CryptoJS from "crypto-js"
import { useState, useEffect } from "react";
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import db from "./firebase/firebase-config";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function Question() {

    const navigate = useNavigate();

    const [question, setQuestion] = useState(null); // State to hold the fetched question
    const [loading, setLoading] = useState(true);
    const [answer, setAnswer] = useState("");

    const encrypted = localStorage.getItem("encryptedClue") || "";
    const secretKey = "my-secret-key"

    // const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
    // const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    // console.log("Decrypted:" + decrypted);


    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const queriesRef = collection(db, "queries");
                const unansweredQuery = query(queriesRef, where("answered", "==", 0));
                const querySnapShot = await getDocs(unansweredQuery);

                const questions = [];
                querySnapShot.forEach((doc) => {
                    questions.push({ id: doc.id, ...doc.data() })
                })


                if (questions.length == 0) {
                    console.log("No unanswered questions found!");
                    setQuestion(null);
                } else {
                    const randomIndex = Math.floor(Math.random() * questions.length);
                    const randomQuestion = questions[randomIndex];
                    console.log("Random Question:", randomQuestion);
                    setQuestion(randomQuestion)
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

                const userId = localStorage.getItem("userId") || "anonymous";

                const questionDoc = doc(db, "queries", question.id);
                await updateDoc(questionDoc, { answered: 1, answeredBy: userId });

                const decryptedClue = CryptoJS.AES.decrypt(encrypted, secretKey).toString(CryptoJS.enc.Utf8);

                Swal.fire({
                    icon: 'success',
                    title: 'Congratulations!',
                    text: `You have successfully answered the question! Here is your clue: ${decryptedClue}`,
                });

                setQuestion(null);

                navigate("/")
                
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
                    <h4>{question.question || "No question text available"}</h4>

                    <div>
                        <form onSubmit={handleSubmit}>
                            <input type="text" className="form-control" placeholder="Answer" onChange={(e) => setAnswer(e.target.value)} required />

                            <button type="submit" className="btn btn-primary text-white mt-3">Submit</button>
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
