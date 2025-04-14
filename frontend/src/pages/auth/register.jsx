import React, { useState } from 'react';
import { auth } from '../../firebase';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';


export const Register = () => {
    const navigate = useNavigate();    

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignUp = async (e) => {
        if(e){
            e.preventDefault();
        }
        try {
            await createUserWithEmailAndPassword(auth,email,password);
            console.log("User signed up successfully!");
            navigate('/login');
            setError('');
        }
        catch(err){
            console.log(err.message);
            if(err.message == "Firebase: Error (auth/email-already-in-use)."){
                setError("Email already in use")
            }
            else if(err.message == "Firebase: Error (auth/invalid-email)."){
                setError("Please enter a valid email address")
            }
            else if(err.message == "Firebase: Password should be at least 6 characters (auth/weak-password)."){
                setError("Password should be at least 6 characters")
            }
            else{
                setError("Something went wrong. Please try again")
            }
        }
    }
    return (
        <div className="authPage">
            <section className="authText">
                <h1>Start your adventure today!</h1>
            </section>

            <form onSubmit={handleSignUp} className="signupField">
                <div className="formField">
                    <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>

                <div className="formField">
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>

                <button type="submit" style={{ display: 'none' }}></button>
            </form>

            {error && (
                <div className="errorMessage" style={{ color: 'red', marginBottom: '10px' }}>
                    {error}
                </div>
            )}
        
            <button onClick={handleSignUp} className="loginBtn">
                    Sign up
            </button>

            <div className="login">
                <h5>Already have an account? <a href='./login'>Log in</a></h5>
            </div>
        </div>
    )
}

export default Register;