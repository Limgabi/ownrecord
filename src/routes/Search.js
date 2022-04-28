import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { dbService } from "fbase";
import { collection, query, onSnapshot, where } from "firebase/firestore";

const Search = () => {
    let {searchWord} = useParams();
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
            console.log(searchArr)
            setSearchs(searchArr);
        });
    }, []);

    return (
        <div>
            {
                searchs.map((search , idx) => (
                    <div key={idx}>
                        <h4>{search.text}</h4>
                        {search.attachmentUrl && <img src={search.attachmentUrl} width="50px" height="50px"/>}
                    </div>
                    
                ))
            }
            </div> 
    )
}

export default Search