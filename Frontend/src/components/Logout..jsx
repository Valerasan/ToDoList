import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';
import {useContext} from "react"
import { UserContext } from './Contexts';

function Logout()
{

    const {user, setUser} = useContext(UserContext)

    const handleLogout = async () => {
        await axios.post("http://localhost:3000/auth/logout");
        setUser(null);
    };

    return(<div >
        <button className="logout-button" type="button" onClick={handleLogout}>
            <LogoutIcon style={{ fontSize: "40px" }}/> 
        </button>
    </div>)
}


export default Logout;