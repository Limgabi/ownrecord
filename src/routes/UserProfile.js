import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { dbService } from "fbase";
import { collection, onSnapshot, orderBy, query, where } from "@firebase/firestore";
import Record from "components/Record";

const UserProfile = ({ userObj }) => {
    let { userid } = useParams();
    const [userRecords, setUserRecords] = useState([]);

    useEffect(() => {
        const q = query(
            collection(dbService, "records"),
            where("creatorId", "==", userid),
            orderBy("createdAt")
        );
        onSnapshot(q, (snapshot) => {
            const userRecordArr = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setUserRecords(userRecordArr);
        });
    }, [])

    return (
        <div>
            {
                userRecords.map((record) => (
                    <Record
                        key={record.id}
                        recordObj={record}
                        isOwner={false}
                    />
                ))
            }
        </div>
    )
}

export default UserProfile