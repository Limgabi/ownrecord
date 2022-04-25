import React, { useEffect, useState } from "react";
import { dbService } from "fbase";
import { collection, addDoc, getDocs, query, onSnapshot, orderBy } from "firebase/firestore";
import Record from "components/Record";

const Home = ({ userObj }) => {
    const [record, setRecord] = useState("");
    const [records, setRecords] = useState([]);

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
        try {
            const docRef = await addDoc(collection(dbService, "records"), {
                text: record,
                createdAt: Date.now(),
                creatorId: userObj.uid,
            });
            console.log("Document written with ID : ", docRef.id);
        } catch (error) {
            console.log("Error adding document : ", error);
        }
        setRecord("");
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
                <input type="submit" value="Record" />
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