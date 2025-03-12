import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const checkUserStatus = () => {
        const userId = localStorage.getItem('user');
        if (userId) {
            return true;
        } else {
            return false;
        }
    }
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container justify-content-between">
                <Link className="navbar-brand" to="/" >VerifyPair</Link>
                
                {/* Navbar Links */}
                <div className="d-flex" style={{ color: "white" }} id="navbarNav">
                    <Link className="nav-link mx-3" to="/">
                        <p style={{ margin: 0 }}>🏠 Home</p>
                    </Link>
                    <Link className="nav-link mx-3" to="/posts">
                        <p style={{ margin: 0 }}>❓ Questions</p>
                    </Link>
                    {checkUserStatus() &&
                        <Link className="nav-link mx-3" to="/posts" style={{ paddingRight: "10px" }}><p style={{ margin: 0 }}> Questions </p></Link>}
                    {checkUserStatus() &&
                        <Link className="nav-link" to="/answer">
                        <p style={{ margin: 0 }}>💬 Answers</p>
                    </Link>
                    <Link className="nav-link mx-3" to="/favorites">
                        <p style={{ margin: 0 }}>⭐ Favorites</p>
                    </Link>}
                    {checkUserStatus() ?
                        <button className="nav-link btn btn-link" onClick={handleLogout} style={{ background: 'none', border: 'none', padding: 0 }}><p style={{ margin: 0 }}> Logout </p></button> :
                        <Link className="nav-link mx-3" to="/badges">
                        <p style={{ margin: 0 }}>🏆 Reputation</p>
                    </Link>
                    }
                </div>
            </div>
        </nav>
    );
};

export default Header;
