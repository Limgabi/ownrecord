import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fbase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { Form } from "react-bootstrap";

const RecordFactory = ({ userObj }) => {
    const navigate = useNavigate();
    const [record, setRecord] = useState("");
    const [attachment, setAttachment] = useState("");
    const fileInput = useRef();

    const onSubmit = async (e) => {
        e.preventDefault();
        let attachmentUrl = "";

        if (attachment !== "") {
            const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
            const uploadFile = await uploadString(fileRef, attachment, "data_url");
            console.log(uploadFile);
            attachmentUrl = await getDownloadURL(uploadFile.ref);
            console.log(attachmentUrl);
        }

        const recordObj = {
            text: record,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
            creatorName: userObj.displayName
        };

        await addDoc(collection(dbService, "records"), recordObj);
        setRecord("");
        setAttachment("");

        alert("글이 정상적으로 등록되었습니다.");
        navigate('/');

    };

    const onChange = (e) => {
        const {
            target: { value }
        } = e;
        setRecord(value);
    }

    const onFileChange = (e) => {
        const {
            target: { files }
        } = e;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: { result }
            } = finishedEvent;
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }

    const onClearAttachment = () => {
        setAttachment("");
        fileInput.current.value = "";
    }

    return (
        <Form onSubmit={onSubmit}>
            <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>당신의 하루를 기록하세요!</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    value={record}
                    onChange={onChange}
                />
                <Form.Control type="file" onChange={onFileChange} ref={fileInput} />
                <br />
                {attachment && (
                    <>
                        <div>
                            <img src={attachment} width="300px" height="200px" />
                        </div>
                        <button onClick={onClearAttachment}>Clear</button>
                    </>
                )}
                <input type="submit" value="Record" />
            </Form.Group>
        </Form>
    )
}

export default RecordFactory