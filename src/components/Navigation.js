import React from "react";
import { Link } from "react-router-dom";
import { Nav } from "react-bootstrap";

const Navigation = ({ userObj }) => {
    return (
        <Nav className="justify-content-end" defaultActiveKey="/">
            <Nav.Item>
                <Nav.Link href="/">Home</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="/profile">{userObj.displayName}'s Profile</Nav.Link>
            </Nav.Item>
        </Nav>
    )
}

export default Navigation