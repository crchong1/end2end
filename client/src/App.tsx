import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import './static/styles/App.scss';
import { Helmet } from 'react-helmet';
import ClientSignup from './components/ClientSignup';
import Header from './components/Header';
import ClientLanding from './components/ClientLanding';
import Login from './components/Login';
import Error from './components/Error';
import Role from './static/Role';
import MyAccount from './components/MyAccount';
import Footer from './components/Footer';
import getServerURL from './serverOverride';
import BugReport from './components/BugReport';
import LoginPage from './components/LoginPage';
import ForgotPassword from './components/ForgotPassword';
import Messages from './components/Messages';
import CreateChat from './components/CreateChat';


interface State {
  role: Role,
  username: string,
}

class App extends React.Component<{}, State, {}> {
  constructor(props: {}) {
    super(props);
    this.state = {
      role: Role.LoggedOut, // Change this to access pages
      username: 'Test',
    };
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  logIn(role: Role, username: string) {
    this.setState({
      role,
      username,
    });
  }

  logOut() {
    fetch(`${getServerURL()}/logout`, {
      method: 'GET',
      credentials: 'include',
    }).then((response) => {
      this.setState({ role: Role.LoggedOut });
    });
  }

  render() {
    const {
      role,
      username,
    } = this.state;
    return (
      <Router>
        <div className="App">
          <div className="app">
            <Helmet>
              <title>End2End</title>
              <meta name="description" content="Secure Chat App" />
              <script src="libsignal-protocol.js"></script>
              <script type="text/javascript" src="util.js"></script>
              <script type="text/javascript" src="store.js"></script>
            </Helmet>
            <Header isLoggedIn={role !== Role.LoggedOut} logIn={this.logIn} logOut={this.logOut} role={role} />
            <Switch>
              // Home/Login Components
              <Route
                exact
                path="/"
                render={() => (
                  role !== Role.LoggedOut
                    ? <Redirect to="/home" />
                    : <Redirect to="/login" />
                )}
              />
              <Route
                path="/home"
                render={() => {
                  return (<ClientLanding />);
                }}
              />
              <Route
                path="/login"
                render={() => (
                  role !== Role.LoggedOut
                    ? <Redirect to="/home" />
                    : <Login />
                )}
              />
              <Route
                path="/login-page"
                render={() => (
                  role !== Role.LoggedOut
                    ? <Redirect to="/home" />
                    : <LoginPage isLoggedIn={role !== Role.LoggedOut} logIn={this.logIn} logOut={this.logOut} role={role} />
                )}
              />
              <Route
                path="/create-chat"
                render={() => {
                  if (role === Role.Client) {
                    return <CreateChat />;
                  }
                  return <Redirect to="/error" />;
                }}
              />
              {/* <Route
                path="/create-group-chat"
                render={() => {
                  if (role === Role.Client) {
                    return <CreateGroupChat />;
                  }
                  return <Redirect to="/error" />;
                }}
              /> */}
              <Route
                path="/messages"
                render={() => {
                  if (role === Role.Client) {
                    return <Messages />;
                  }
                  return <Redirect to="/error" />;
                }}
              />
              <Route path="/client-signup">
                <ClientSignup />
              </Route>
              <Route path="/bug-report">
                <BugReport />
              </Route>
              <Route path="/forgot-password">
                <ForgotPassword />
              </Route>
              <Route
                path="/settings"
                render={() => {
                  if (role !== Role.LoggedOut) {
                    return <MyAccount />;
                  }
                  return <Redirect to="/error" />;
                }}
              />
              <Route path="/error">
                <Error />
              </Route>
              <Route>
                <Redirect to="/error" />
              </Route>
            </Switch>
          </div>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
