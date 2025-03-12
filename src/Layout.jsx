import PropTypes from 'prop-types';
import Header from './components/Header';
import Footer from './components/Footer';

const Layout = ({ children }) => {
    return (
        <div className="d-flex flex-column min-vh-100 justify-content-between" style={{ overflowY: "auto" }}>
            <Header />
            <div className="container my-4 mx-auto ">
                {children}
            </div>
            <Footer />
        </div>
    );
}
Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;