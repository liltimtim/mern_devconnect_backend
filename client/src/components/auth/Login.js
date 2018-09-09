import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { loginUser } from "../../actions/authActions";
class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillReceiveProps(props) {
    if (props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
    if (props.errors) {
      this.setState({ errors: props.errors });
    }
  }

  /**
   * Event triggered whenever any form input value changes
   * @param {React.SyntheticEvent} e the form event
   */
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  /**
   * Called when the form is submitted
   * @param {React.SyntheticEvent} e the form
   */
  onSubmit(e) {
    e.preventDefault();
    const { history } = this.props;
    const login = {
      email: this.state.email,
      password: this.state.password
    };
    this.props.loginUser(login, history);
  }

  render() {
    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Login</h1>
              <p className="lead text-center">
                Login to your DevConnect Account
              </p>
              <form noValidate onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="email@address.com"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="Password"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChange}
                  />
                </div>
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    auth: state.auth,
    errors: state.errors
  };
};
export default connect(
  mapStateToProps,
  { loginUser }
)(withRouter(Login));
