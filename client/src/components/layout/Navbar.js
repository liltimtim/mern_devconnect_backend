import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { withRouter } from "react-router-dom";
class Navbar extends Component {
  /**
   *
   * @param {React.SyntheticEvent} e onClick synthentic event
   */
  onLogoutClick(e) {
    e.preventDefault();
    this.props.logoutUser(this.props.history);
  }

  renderAuthenticatedBar(user) {
    return (
      <div className="collapse navbar-collapse" id="mobile-nav">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/profiles">
              {" "}
              Developers
            </Link>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a
              className="nav-link"
              href="#logout"
              onClick={this.onLogoutClick.bind(this)}
            >
              <img
                className="rounded-circle"
                src={user.avatar}
                style={{ width: "25px", marginRight: "5px" }}
                alt=""
              />{" "}
              Logout
            </a>
          </li>
        </ul>
      </div>
    );
  }

  renderUnauthenticatedBar() {
    return (
      <div className="collapse navbar-collapse" id="mobile-nav">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/profiles">
              {" "}
              Developers
            </Link>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/register">
              Sign Up
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/login">
              Login
            </Link>
          </li>
        </ul>
      </div>
    );
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;
    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
        <div className="container">
          <Link className="navbar-brand" to="/">
            DevConnector
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#mobile-nav"
          >
            <span className="navbar-toggler-icon" />
          </button>
          {isAuthenticated
            ? this.renderAuthenticatedBar(user)
            : this.renderUnauthenticatedBar()}
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

export default connect(
  mapStateToProps,
  { logoutUser }
)(withRouter(Navbar));
