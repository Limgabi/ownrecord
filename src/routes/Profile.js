import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService, dbService } from "fbase";
import { signOut, updateProfile } from "firebase/auth";
import { onSnapshot, collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { Form, Row, Col, Container, Card, InputGroup, Button } from "react-bootstrap";
import MyRecord from "components/MyRecord";

const Profile = ({ userObj, refreshUser }) => {
    const navigate = useNavigate();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const [myRecords, setMyRecords] = useState([]);

    const getMyRecords = async () => {
        const q = query(
            collection(dbService, "records"),
            where("creatorId", "==", userObj.uid),
            orderBy("createdAt")
        );
        onSnapshot(q, (snapshot) => {
            const myRecordArr = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMyRecords(myRecordArr);
        });
    };

    useEffect(() => {
        getMyRecords();
    }, [])

    const onLogOut = () => {
        authService.signOut();
        navigate("/");
    }
    const onChange = (e) => {
        const {
            target: { value }
        } = e;
        setNewDisplayName(value);
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        if (userObj.displayName !== newDisplayName) {
            await updateProfile(authService.currentUser, { displayName: newDisplayName });
            refreshUser();
        }
    }
    return (
        <>
            <Container>
                <Form onSubmit={onSubmit}>
                    <Form.Group as={Row} className="mb-3" controlId="formBasicPassword">
                        <Col sm>
                            <InputGroup className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="Display name"
                                    value={newDisplayName}
                                    onChange={onChange}
                                    required
                                />
                                <Button variant="secondary" type="submit" >
                                    Update Profile
                                </Button>
                            </InputGroup>
                        </Col>
                    </Form.Group>
                </Form>
            </Container>
            {
                myRecords.map((record) => (
                    <MyRecord
                        key={record.id}
                        recordObj={record}
                    />
                ))
            }
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Button variant="light" onClick={() => navigate('/')}>
                    Home
                </Button>{' '}
                <Button variant="secondary" onClick={onLogOut}>
                    Log Out
                </Button>
            </div>
        </>
    )
}

export default Profile