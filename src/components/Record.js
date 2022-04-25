import React, { useState } from "react";
import { dbService } from "fbase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";

const Record = ({ recordObj, isOwner }) => {
    const RecordTextRef = doc(dbService, "records", `${recordObj.id}`);
    const [editing, setEditing] = useState(false);
    const [newRecord, setNewRecord] = useState(recordObj.text);

    const onDeleteClick = async () => {
        const ok = window.confirm("정말 이 기록을 삭제하시겠습니까?");
        if (ok) {
            await deleteDoc(RecordTextRef);
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
                    <h4>{recordObj.text}</h4>
                    {isOwner && (
                        <>
                            <button onClick={onDeleteClick}>Delete Record</button>
                            <button onClick={toggleEditing}>Edit Record</button>
                        </>
                    )}
                </>
            )}
        </div>
    )
}

export default Record