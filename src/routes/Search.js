import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { dbService } from "fbase";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import Record from "components/Record";

const Search = ({ userObj }) => {
    let { searchWord } = useParams();
    const [searchs, setSearchs] = useState([]);

    useEffect(() => {
        const q = query(
            collection(dbService, "records"),
            where("text", ">=", searchWord),
            where("text", "<=", searchWord),
        );
        onSnapshot(q, (snapshot) => {
            const searchArr = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            // console.log(searchArr)
            setSearchs(searchArr);
        });
    }, []);

    return (
        <div>
            {
                searchs.map((search) => (
                    <Record
                        key={search.id}
                        recordObj={search}
                        isOwner={search.creatorId === userObj.uid}
                    />
                ))
            }
        </div>
    )
}

export default Search