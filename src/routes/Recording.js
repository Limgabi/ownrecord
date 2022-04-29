import React from "react";
import RecordFactory from "components/RecordFactory";

const Recording = ({ userObj }) => {
    return (
        <>
            <RecordFactory userObj={userObj} />
        </>
    )
}

export default Recording