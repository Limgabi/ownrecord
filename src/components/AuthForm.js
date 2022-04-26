import React, { useState } from "react";
import { authService } from "fbase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

const AuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");

    const onChange = (e) => {
        const {
            target: { name, value }
        } = e;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    }
    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            let data;
            if (newAccount) {
                data = await createUserWithEmailAndPassword(authService, email, password);
            } else {
                data = await signInWithEmailAndPassword(authService, email, password);
            }
            console.log(data);
        } catch (error) {
            setError(error.message);
        }
    }
    const toggleAccount = () => {
        setNewAccount(prev => !prev);
    }
    return (
        <>
            <Container>
                <Form onSubmit={onSubmit}>
                    <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                        <Col sm>
                            <Form.Control
                                name="email"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={onChange}
                                required />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="formBasicPassword">
                        <Col sm>
                            <Form.Control
                                name="password"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={onChange}
                                required />
                        </Col>
                    </Form.Group>
                    {/* <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={onChange}
                        required
                    /> */}
                    {/* <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={onChange}
                        required
                    /> */}
                    <div className="d-grid gap-1">
                        <Button variant="secondary" type="submit" >
                            {newAccount ? "Create Account" : "Sign In"}
                        </Button>
                    </div>
                    {/* <input type="submit" value={newAccount ? "Create Account" : "Sign In"} /> */}
                    {error}
                </Form>
                <br/>
                <div className="d-grid gap-1">
                    <Card onClick={toggleAccount}>
                        <Card.Body>{newAccount ? "Sign In" : "Create Account"}</Card.Body>
                    </Card>
                </div>
                <br/>
            </Container>

            {/* <span onClick={toggleAccount}>{newAccount ? "Sign In" : "Create Account"}</span> */}
        </>
    )
}

export default AuthForm