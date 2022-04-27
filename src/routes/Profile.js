import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService, dbService } from "fbase";
import { signOut, updateProfile } from "firebase/auth";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { Form, Row, Col, Container, Card, InputGroup, Button } from "react-bootstrap";

const Profile = ({ userObj, refreshUser }) => {
    const navigate = useNavigate();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

    const getMyRecords = async () => {
        const q = query(
            collection(dbService, "records"),
            where("creatorId", "==", userObj.uid),
            orderBy("createdAt")
        );
        const querySnapshot = await getDocs(q);
        // querySnapshot.forEach((doc) => {
        //     console.log(doc.id, "=>", doc.data());
        // });
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
                <div style={{display: "flex", justifyContent: "center"}}>
                    <Button variant="light" onClick={()=>navigate('/')}>
                        Home
                    </Button>{' '}
                    <Button variant="secondary" onClick={onLogOut}>
                        Log Out
                    </Button>
                </div>
            </Container>
        </>
    )
}

export default Profile