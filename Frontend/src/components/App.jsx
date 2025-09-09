import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import NotesBoard from "./NotesBoard";
import Authentication from "./Authentication";
import { UserContext } from "./Contexts.jsx"
import LoadingScreen from "./LoadingScreen.jsx";

axios.defaults.withCredentials = true;

function App() {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:3000/auth/me")
            .then(res => setUser(res.data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <UserContext value={{ user, setUser }}>
                <Header />
                {loading ? <LoadingScreen /> 
                : user ? (<NotesBoard />) : <Authentication />}
                <Footer />
            </UserContext>
        </div>
    );
}

export default App;
