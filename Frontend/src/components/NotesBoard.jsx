import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Note from "./Note";
import CreateArea from "./CreateArea";
import { UserContext } from "./Contexts";


function NotesBoard() {

    const user = useContext(UserContext)
    const [notes, setNotes] = useState([]);


    useEffect(() => {
        axios.get("http://localhost:3000/api/notes")
            .then(res => setNotes(res.data))
            .catch(err => console.log(err));

    }, []);



    function addNote(newNote) {
        setNotes(prevNotes => {
            return [...prevNotes, newNote];
        });
    }

    async function deleteNote(id) {
        try {
            const response = await axios.delete("http://localhost:3000/api/notes/delete", {
                data: { id }, 
                headers: { "Content-Type": "application/json" },
            });


            const data = response.data;

            setNotes(prevNotes => {
                return prevNotes.filter((noteItem) => {
                    return noteItem.id !== id;
                });
            });

        } catch (error) {
            console.error(error);
            console.log("Error");
        }

    }

    return (<div>
        <CreateArea onAdd={addNote} />
        {notes.map((noteItem, index) => {
            return (
                <Note

                    key={index}
                    id={noteItem.id}
                    title={noteItem.title}
                    content={noteItem.content}
                    onDelete={deleteNote}
                />
            );
        })}

    </div>)
}


export default NotesBoard;