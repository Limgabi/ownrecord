import React, { useEffect, useState } from "react";
import { dbService } from "fbase";
import { collection, query, onSnapshot } from "firebase/firestore";
import Record from "components/Record";
import RecordFactory from "components/RecordFactory";
import { Button } from "react-bootstrap";

const Home = ({ userObj }) => {
    const [records, setRecords] = useState([]);
    const [recording, setRecording] = useState(false);

    const toggleRecording = () => {
        setRecording((prev) => !prev);
    }

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

   
    return (
        <div>
            <RecordFactory userObj={userObj}/>
            {/* <Button onClick={toggleRecording}>Recording</Button>
            {
                recording && <RecordFactory userObj={userObj}/>
            } */}
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