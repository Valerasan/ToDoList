import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

function App() {
    const [notes, setNotes] = useState([]);

    const [message, setMessage] = useState({})



    useEffect(() => {
        fetch("http://localhost:3000/api/notes")
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setNotes(data)
            })
            .catch(err => console.log(err));
    }, []);


    function addNote(newNote) {
        setNotes(prevNotes => {
            return [...prevNotes, newNote];
        });
    }

    async function deleteNote(id) {
        try {
            const response = await fetch("http://localhost:3000/api/notes/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();

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



    return (
        <div>
            <Header />

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
            <Footer />
        </div>
    );
}

export default App;
