import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dbService } from "fbase";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import Record from "components/Record";
import RecordFactory from "components/RecordFactory";
import { Button } from "react-bootstrap";

const Home = ({ userObj }) => {
    const navigate = useNavigate();

    const [records, setRecords] = useState([]);
    const [recording, setRecording] = useState(false);
    const [search, setSearch] = useState("");

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
        setSearch(value);
    }

    const onClickSearch = () => {
        setSearch("");
        navigate(`/search/${search}`);
    }

    const onClickRecording = () => {
        navigate('/recording');
    }

    return (
        <div>
            <h1>Own Record</h1>
            <Button variant="secondary" onClick={onClickRecording}>Recording</Button>
            <div>
                <input type="text" value={search} onChange={onChange} />
                <Button onClick={onClickSearch}>검색</Button>
            </div>
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