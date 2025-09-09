import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Fab } from "@mui/material";
import { Zoom } from "@mui/material";
import axios from "axios";

axios.defaults.withCredentials = true;

function CreateArea(props) {
    const [isExpanded, setExpanded] = useState(false);

    const [note, setNote] = useState({
        id: 0,
        title: "",
        content: "",
    });

    function handleChange(event) {
        const { name, value } = event.target;

        setNote((prevNote) => {
            return {
                ...prevNote,
                [name]: value,
            };
        });
    }

    async function submitNote(event) {
    event.preventDefault();
    console.log(note);

    try {
        const response = await axios.post("http://localhost:3000/api/notes/add", {note}, {
        headers: { "Content-Type": "application/json" }
        });

        setNote({
        title: "",
        content: "",
        });

        console.log("New record: ", response.data);

        // Add on main page new Note if write in DB was successful
        props.onAdd(response.data);
    } catch (error) {
        console.error(error);
        console.log("Error");
    }
    }

    function expand() {
        setExpanded(true);
    }

    return (
        <div>
            <form className="create-note">
                {isExpanded && (
                    <input
                        name="title"
                        onChange={handleChange}
                        value={note.title}
                        placeholder="Title"
                    />
                )}

                <textarea
                    name="content"
                    onClick={expand}
                    onChange={handleChange}
                    value={note.content}
                    placeholder="Take a note..."
                    rows={isExpanded ? 3 : 1}
                />
                <Zoom in={isExpanded}>
                    <Fab onClick={submitNote}>
                        <AddIcon />
                    </Fab>
                </Zoom>
            </form>
        </div>
    );
}

export default CreateArea;
