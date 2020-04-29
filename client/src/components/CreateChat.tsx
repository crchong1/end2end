import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { withAlert } from 'react-alert';
import getServerURL from '../serverOverride';

interface Props {
  alert: any
}

interface State {
  buttonState: string,
  targetUsername: string,
}

class CreateChat extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      targetUsername: '',
      buttonState: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeTargetUsername = this.handleChangeTargetUsername.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  handleSubmit(event: any) {
    this.setState({ buttonState: 'running' });
    const {
      targetUsername,
    } = this.state;
    
    fetch(`${getServerURL()}/create-chat`, {
    method: 'POST',
    body: JSON.stringify({
      targetUsername,
    }),
    }).then((response) => response.json())
    .then((responseJSON) => {
      const submitStatus = responseJSON;
      if (submitStatus === 'SUBMIT_SUCCESS') {
        this.setState({ buttonState: '' });
        this.props.alert.show('Chat Successfully Created');
      } else {
        this.props.alert.show('Error: Chat Creation Failure');
        this.setState({ buttonState: '' });
      }
    }).catch((error) => {
      this.props.alert.show(`Server Failure: ${error}`);
      this.setState({ buttonState: '' });
    });
  }

  handleChangeTargetUsername(event: any) {
    this.setState({ targetUsername: event.target.value });
  }


  render() {
    const {
      targetUsername,
    } = this.state;
    return (
      <div className="container">
        <Helmet>
          <title>Create Chat</title>
          <meta name="description" content="End2End" />
        </Helmet>
        <div className="row">
          <div className="col-md-12">
            <div className="jumbotron jumbotron-fluid bg-white pb-2 mb-2">
              <div className="container">
                <h1 className="display-5 text-center font-weight-bold mb-3">Start a Chat</h1>
                <p className="lead">Search all users to find one to chat</p>
              </div>
            </div>
            <form onSubmit={this.handleSubmit}>
              <div className="col-md-12">
                <div className="form-row">
                  <div className="col-md-12 form-group">
                    <label htmlFor="targetUsername" className="w-100 pr-3 font-weight-bold">
                      User You Would Like to Chat With
                      <input
                        type="text"
                        className="form-control form-purple"
                        id="targetUsername"
                        placeholder="Username Here"
                        value={targetUsername}
                        onChange={this.handleChangeTargetUsername}
                        required
                      />
                    </label>
                  </div>
                </div>
                <div className="form-row mt-2">
                  <div className="col-md-8">
                  </div>
                  <div className="col-md-4 text-right pr-4">
                    <button type="submit" onClick={this.handleSubmit} className={`ml-5 w-50 btn btn-success ld-ext-right ${this.state.buttonState}`}>
                      Submit
                      <div className="ld ld-ring ld-spin" />
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withAlert()(CreateChat);
