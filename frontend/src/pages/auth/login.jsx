import React from 'react';

export const Login = () => {
    return (
        <div className="loginPage">
            <section className="loginText">
                <h1>Welcome back, explorer!</h1>
            </section>

            <section className="loginField">
                <div className="formField">
                    <input type="text" placeholder="Email"/>
                </div>

                <div className="formField">
                    <input type="password" placeholder="Password"/>
                </div>
            </section>

            <button className="loginBtn">
                    Log in
            </button>
        </div>

    )
}

export default Login;