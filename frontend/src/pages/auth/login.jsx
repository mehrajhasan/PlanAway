import React, { useState } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        if(e){
            e.preventDefault();
        }
        try {
            await signInWithEmailAndPassword(auth,email,password);
            console.log("Logged in successfully!");
            navigate('/trip');
            setError('');
        }
        catch(err){
            console.log(err.message);
            if(err.message === "Firebase: Error (auth/invalid-credential)."){
                setError("Incorrect email or password")
            }
            else if(err.message === "Firebase: Error (auth/invalid-email)."){
                setError("Please enter a valid email address")
            }
            else if(err.message === "Firebase: Error (auth/missing-password)."){
                setError("Please enter your password")
            }
            else{
                setError("Something went wrong. Please try again")
            }
        }
    }
    return (
        <div className="authPage">
            <section className="authText">
                <h1>Welcome back, explorer!</h1>
            </section>

            <form onSubmit={handleLogin} className="loginField">
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

            <button onClick={handleLogin} className="loginBtn">
                    Log in
            </button>

            <div className="signup">
                <h5>Don't have an account? <a href='./register'>Sign Up</a></h5>
            </div>
        </div>
        

    )
}

export default Login;