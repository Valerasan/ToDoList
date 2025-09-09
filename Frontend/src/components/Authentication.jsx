import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "./Contexts";

axios.defaults.withCredentials = true;

function Authentication() {


    const [form, setForm] = useState({ email: "", password: "" });

    const {user, setUser} = useContext(UserContext)

    const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
    };

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((prevForm) => {
            return {
                ...prevForm,
                [name]: value,
            };
        });
    }

    const handleLogin = async (event) => {
        console.log("Login start");

        await axios.post("http://localhost:3000/auth/login", form);
        const res = await axios.get("http://localhost:3000/auth/me");
        setUser(res.data);
        
    };

    const handleRegister = async (event) => {
        //TODO: Perhaps this should be changed because it looks unsafe.
        if(isValidEmail(form.email))
        {
            console.log("Registr");
            await axios.post("http://localhost:3000/auth/register", form);
            await handleLogin();
        }
    };

    return (<div>
        <form className="auth">
            <input
                name = "email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                required
            />
            <input
                name = "password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                required
            />
            <div className="buttons">
                <button onClick={handleRegister} className="left"  type="button">Register</button>
                <button onClick={handleLogin} className="right" type="button">Login</button>
            </div>
        </form>

    </div>)
}

export default Authentication;