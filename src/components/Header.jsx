import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container justify-content-between">
                <a className="navbar-brand" href="#">VerifyPair</a>
                <div className="d-flex" style={{ width: '20%', color: "white" }} id="navbarNav">
                    <Link className="nav-link" to="/" style={{ paddingRight: "10px" }}><p style={{ margin: 0 }}> Home </p></Link>
                    <Link className="nav-link" to="/answer"><p style={{ margin: 0 }}> Answers </p></Link>
                </div>
            </div>
        </nav>
    );
};

export default Header;