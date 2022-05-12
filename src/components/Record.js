import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { dbService, storageService } from "fbase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { ListGroup, Button, Form, FormControl, InputGroup } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BiEdit } from "react-icons/bi";

const Record = ({ recordObj, isOwner }) => {
    const navigate = useNavigate();

    const [editing, setEditing] = useState(false);
    const [newRecord, setNewRecord] = useState(recordObj.text);
    const RecordTextRef = doc(dbService, "records", `${recordObj.id}`);
    const urlRef = ref(storageService, recordObj.attachmentUrl);

    const onDeleteClick = async () => {
        const ok = window.confirm("정말 이 기록을 삭제하시겠습니까?");
        if (ok) {
            await deleteDoc(RecordTextRef);
            if (recordObj.attachmentUrl !== "") {
                await deleteObject(urlRef);
            }
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
    const onClickUser = () => {
        navigate(`/user/${recordObj.creatorId}`);
    }
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            width: "80%",
            margin: "16px auto"
            // textAlign: "center",
            // alignItems: "center",
            // justifyContent: "center",
        }}>
            {editing ? (
                <>
                    {isOwner && (
                        <>
                            <Form onSubmit={onSubmit}>
                                <InputGroup className="mb-3">
                                    <FormControl
                                        type="text"
                                        placeholder="Edit your record"
                                        value={newRecord}
                                        required
                                        onChange={onChange}
                                    />
                                    <Button type="submit" variant="outline-secondary" id="button-addon2">
                                        Update Record
                                    </Button>
                                </InputGroup>
                            </Form>
                            <Button onClick={toggleEditing} variant="secondary">Cancel</Button>
                        </>
                    )}
                </>
            ) : (
                <>
                    <ListGroup>
                        <ListGroup.Item
                            className="d-flex justify-content-between align-items-start"
                        >
                            <FaUserCircle size="30" />
                            <div className="ms-3 me-auto d-inline-block p1">
                                <div className="fw-bold" onClick={onClickUser}>{recordObj.creatorName}</div>
                                {/* <p>@{recordObj.creatorName}</p> */}
                                <p>{recordObj.text}</p>
                                {recordObj.attachmentUrl && (
                                    <img src={recordObj.attachmentUrl} width="100px" height="100px" />
                                )}
                            </div>

                            {isOwner && (
                                <>
                                    <Button onClick={onDeleteClick} variant="light" size="sm"><MdDelete /></Button>
                                    <Button onClick={toggleEditing} variant="light" size="sm"><BiEdit /></Button>
                                </>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </>
            )}
        </div>
    )
}

export default Record