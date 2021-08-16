import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../../actions/auth";
import PropTypes from "prop-types";
import CodeIcon from "@material-ui/icons/Code";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
    const authLinks = (
        <ul>
            <li style={{ marginTop: 8 }}>
                <Link to="/dashboard">Dashboard</Link>
            </li>
            <li style={{ marginTop: 8 }}>
                <Link to="/profiles">Profiles</Link>
            </li>
            <li>
                <a
                    href="#!"
                    onClick={logout}
                    style={{ display: "flex", flexDirection: "row" }}
                >
                    <ExitToAppIcon /> <p style={{ marginLeft: 5 }}>Logout</p>
                </a>
            </li>
        </ul>
    );

    const guestLinks = (
        <ul>
            <li>
                <Link to="/">Developers</Link>
            </li>
            <li>
                <Link to="/register">Register</Link>
            </li>
            <li>
                <Link to="/login">Login</Link>
            </li>
            <li>
                <Link to="/profiles">Profiles</Link>
            </li>
        </ul>
    );

    return (
        <nav className="navbar bg-dark">
            <h1>
                <Link to="/">
                    <i className="fa-solid fa-code"></i> Developers Hub
                </Link>
            </h1>
            {!loading && (
                <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
            )}
        </nav>
    );
};

Navbar.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
