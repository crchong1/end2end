import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withAlert } from 'react-alert';
import Logo from '../static/images/logo.svg';
import UsernameSVG from '../static/images/username.svg';
import PasswordSVG from '../static/images/password.svg';
import getServerURL from '../serverOverride';
import Role from '../static/Role';

const logoSize = 40;
interface Props {
  logIn: (role: Role, username: string, organization: string, name: string) => void,
  logOut: () => void,
  isLoggedIn: boolean,
  role: Role,
  alert: any
}

interface State {
  username: string,
  password: string,
  buttonState: string
}

class Header extends Component<Props, State, {}> {
  constructor(props: Props) {
    super(props);
    this.state = {
      buttonState: '',
      username: '',
      password: '',
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);

    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
  }

  handleLogout(event: any) {
    this.setState({ buttonState: '' });
    const {
      logOut,
    } = this.props;
    this.setState({
      username: '',
      password: '',
    });
    logOut();
  }

  handleLogin(event: any) {
    this.setState({ buttonState: 'running' });
    event.preventDefault();
    const {
      logIn,
    } = this.props;
    const {
      username,
      password,
    } = this.state;
    if (username.trim() === '' || password.trim() === '') {
      this.props.alert.show('Please enter a valid username or password');
      this.setState({ buttonState: '' });
    } else {
      fetch(`${getServerURL()}/login`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
          username,
          password,
        }),
      }).then((response) => response.json())
        .then((responseJSON) => {
          responseJSON = JSON.parse(responseJSON);
          const {
            loginStatus,
            userRole,
            organization,
            firstName,
            lastName,
          } = responseJSON;
          if (loginStatus === 'AUTH_SUCCESS') {
            const role = () => {
              switch (userRole) {
                case 'Client': return Role.Client;
                default: return Role.LoggedOut;
              }
            };
            logIn(role(), username, organization, `${firstName} ${lastName}`); // Change
          } else if (loginStatus === 'AUTH_FAILURE') {
            this.props.alert.show('Incorrect Password');
            this.setState({ buttonState: '' });
          } else if (loginStatus === 'USER_NOT_FOUND') {
            this.props.alert.show('Incorrect Username');
            this.setState({ buttonState: '' });
          } else {
            this.props.alert.show('Server Failure: Please Try Again');
            this.setState({ buttonState: '' });
          }
        }).catch((error) => {
          this.props.alert.show('Network Failure: Check Server Connection');
          this.setState({ buttonState: '' });
        });
    }
  }

  handleChangePassword(event: any) {
    this.setState({ password: event.target.value });
  }

  handleChangeUsername(event: any) {
    this.setState({ username: event.target.value });
  }

  render() {
    const {
      isLoggedIn,
      role,
    } = this.props;
    const {
      username,
      password,
    } = this.state;

    if (isLoggedIn) {
      return (
          <nav className="navbar navbar-expand-lg navbar-dark sticky-top navbar-custom">
            <div className="container">
              <Link className="pr-3" to="/home">
                <img
                  alt="Logo"
                  src={Logo}
                  width={logoSize}
                  height={logoSize}
                  className="d-inline-block"
                />
              </Link>
              <Link className="navbar-brand" to="/home">
                End2End
              </Link>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggleLoggedIn" aria-controls="navbarToggleLoggedIn" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
              </button>
              <div className="navbar-collapse collapse w-100 order-3 dual-collapse2" id="navbarToggleLoggedIn">
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item col-med-2 my-1 flex-fill mr-2">
                    <Link className="nav-link" to="/settings">My Account Settings</Link>
                  </li>
                  <div className="col-auto my-1 flex-fill">
                    <Link to="/login">
                      <button type="button" onClick={this.handleLogout} className="btn btn-primary">Log Out</button>
                    </Link>
                  </div>
                </ul>
              </div>
            </div>
          </nav>
      );
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-dark sticky-top navbar-custom">
          <div className="container">
            <Link className="pr-3" to="/home">
              <img
                alt="Logo"
                src={Logo}
                width={logoSize}
                height={logoSize}
                className="d-inline-block"
              />
            </Link>
            <Link className="navbar-brand" to="/home">
              End2End
            </Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggle" aria-controls="navbarToggle" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon" />
            </button>

            <div className="collapse navbar-collapse" id="navbarToggle">
              <ul className="navbar-nav mr-auto mt-2 mt-lg-0 ">
                {/* <li className="nav-item my-1 mr-2 ml-2">
                  <Link className="nav-link" to="/">For Organizations</Link>
                </li> */}
              </ul>
              <div className="col-auto my-1">
                <Link to="/login-page">
                  <button type="submit" className='btn btn-dark-custom'>
                    Sign In
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </nav>
      );
  }
}

export default withAlert()(Header);