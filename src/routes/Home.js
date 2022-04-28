import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
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
    const [searchs, setSearchs] = useState([]);

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

    const toggleRecording = () => {
        setRecording((prev) => !prev);
    }

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

    return (
        <div>
            <input type="text" value={search} onChange={onChange} />
           <Button onClick={onClickSearch}>검색</Button>

            <RecordFactory userObj={userObj} />
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