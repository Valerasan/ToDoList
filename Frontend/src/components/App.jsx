import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import NotesBoard from "./NotesBoard";

axios.defaults.withCredentials = true;

function App() {
    
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({ email: "", password: "" });


    return (
        <div>
            <Header />
                <NotesBoard />
            <Footer />
        </div>
    );
}

export default App;
