import React, { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fbase";
import { collection, addDoc, getDocs, query, onSnapshot, orderBy } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import Record from "components/Record";

const Home = ({ userObj }) => {
    const [record, setRecord] = useState("");
    const [records, setRecords] = useState([]);
    const [attachment, setAttachment] = useState("");
    const fileInput = useRef();

    useEffect(() => {
        // const q = query(collection(dbService, "records"), orderBy("createdAt", "desc"));
        const q = query(collection(dbService, "records"));
        onSnapshot(q, (snapshot) => {
            const recordArr = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setRecords(recordArr);
        });
    }, []);

    const onChange = (e) => {
        const {
            target: { value }
        } = e;
        setRecord(value);
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        let attachmentUrl;

        if (attachmentUrl !== "") {
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
            attachmentUrl
        };

        await addDoc(collection(dbService, "records"), recordObj);
        setRecord("");
        setAttachment("");
        
    };

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
        <div>
            <form onSubmit={onSubmit}>
                <input
                    value={record}
                    onChange={onChange}
                    type="text"
                    placeholder="What's on your mind?"
                    maxLength={120}
                />
                <input type="file" accept="image/*" onChange={onFileChange} ref={fileInput}/>
                <input type="submit" value="Record" />
                {attachment && (
                    <div>
                        <img src={attachment} width="50px" height="50px"/>
                        <button onClick={onClearAttachment}>Clear</button>
                    </div>
                )}
            </form>
            <div>
                {
                    records.map((record) => (
                        <Record 
                            key={record.id} 
                            recordObj={record} 
                            isOwner={record.creatorId === userObj.uid}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default Home