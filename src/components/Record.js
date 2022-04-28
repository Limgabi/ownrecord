import React, { useState } from "react";
import { dbService, storageService } from "fbase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import Card from "react-bootstrap/Card";

const Record = ({ recordObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newRecord, setNewRecord] = useState(recordObj.text);
    const RecordTextRef = doc(dbService, "records", `${recordObj.id}`);
    const urlRef = ref(storageService, recordObj.attachmentUrl);

    const onDeleteClick = async () => {
        const ok = window.confirm("정말 이 기록을 삭제하시겠습니까?");
        if (ok) {
            await deleteDoc(RecordTextRef);
            await deleteObject(urlRef);
        }
    }
    const toggleEditing = () => {
        setEditing((prev) => !prev);
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        await updateDoc(RecordTextRef, {
            text: newRecord,
        });
        setEditing(false);
    }
    const onChange = (e) => {
        const {
            target: { value }
        } = e;
        setNewRecord(value);
    }
    return (
        <div>
            {editing ? (
                <>
                    {isOwner && (
                        <>
                            <form onSubmit={onSubmit}>
                                <input
                                    type="text"
                                    placeholder="Edit your record"
                                    value={newRecord}
                                    required
                                    onChange={onChange}
                                />
                                <input type="submit" value="Update Record" />
                            </form>
                            <button onClick={toggleEditing}>Cancel</button>
                        </>
                    )}
                </>
            ) : (
                <>
                    <Card border="secondary" style={{ width: "500px"}}>
                        <Card.Header>{recordObj.creatorName}</Card.Header>
                        <Card.Body>
                        <Card.Title>{recordObj.text}</Card.Title>
                        {recordObj.attachmentUrl && (
                            <img src={recordObj.attachmentUrl} width="50px" height="50px" />
                        )}
                        <Card.Text>{recordObj.text}</Card.Text>   
                        {isOwner && (
                            <>
                                <button onClick={onDeleteClick}>Delete Record</button>
                                <button onClick={toggleEditing}>Edit Record</button>
                            </>
                        )}
                    </Card.Body>
                    </Card>
                    

                </>
            )}
        </div>
    )
}

export default Record