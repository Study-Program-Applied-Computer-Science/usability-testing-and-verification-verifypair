import { Link, useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    
    const checkUserStatus = () => {
        return localStorage.getItem("user") ? true : false;
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container justify-content-between">
                <Link className="navbar-brand" to="/">VerifyPair</Link>
                
                
                <div className="d-flex" style={{ color: "white" }} id="navbarNav">
                    <Link className="nav-link mx-3" to="/badges">
                        <p style={{ margin: 0 }}>Home</p> 
                    </Link>
                    <Link className="nav-link mx-3" to="/posts">
                        <p style={{ margin: 0 }}>Questions</p>
                    </Link>

                    {/* When user is logged in */}
                    {checkUserStatus() ? (
                        <>
                        
                            <Link className="nav-link mx-3" to="/favorites">
                                <p style={{ margin: 0 }}>Favorites</p>
                            </Link>
                            <button 
                                className="nav-link btn btn-link" 
                                onClick={handleLogout} 
                                style={{ background: "none", border: "none", padding: 0 }}
                            >
                                <p style={{ margin: 0 }}>Logout</p>
                            </button>
                        </>
                    ) : (
                        <>
                            {/* When user is logged out */}
                            <Link className="nav-link mx-3" to="/login">
                                <p style={{ margin: 0 }}>Login</p>
                            </Link>
                            <Link className="nav-link mx-3" to="/register">
                                <p style={{ margin: 0 }}>Register</p>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Header;
