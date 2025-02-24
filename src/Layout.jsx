import Grid from '@mui/material/Grid2';
import PropTypes from 'prop-types';


const Layout = ({ children }) => {
    return (
        <Grid container>
            <Grid item xs={12}>
                {children}
            </Grid>
        </Grid>
    )
}
Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;