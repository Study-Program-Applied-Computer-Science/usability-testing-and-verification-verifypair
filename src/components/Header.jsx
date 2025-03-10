import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container justify-content-between">
                <a className="navbar-brand" href="#">VerifyPair</a>
                <div className="d-flex" style={{ width: '50%', color: "white" }} id="navbarNav">
                    <Link className="nav-link mx-3" to="/">
                        <p style={{ margin: 0 }}> Home </p>
                    </Link>
                    <Link className="nav-link mx-3" to="/answer">
                        <p style={{ margin: 0 }}> Answers </p>
                    </Link>
                    <Link className="nav-link mx-3" to="/badges">
                        <p style={{ margin: 0 }}> Badges & Reputation </p>
                    </Link>
                    <Link className="nav-link mx-3" to="/favorites">
                        <p style={{ margin: 0 }}> Favorites </p>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Header;
