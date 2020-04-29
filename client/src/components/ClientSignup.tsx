import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import ReCAPTCHA from 'react-google-recaptcha';
import { withAlert } from 'react-alert';
import Role from '../static/Role';
import getServerURL from '../serverOverride';
import { reCaptchaKey } from '../configVars';

interface Props {
  alert: any
}

declare global {
  interface Window {
      libsignal:any;
      SignalProtocolStore: any;
      util: any
  }
}

const ls = window.libsignal;
const KeyHelper = ls.KeyHelper;
const store = new window.SignalProtocolStore;

interface State {
  personUsername: string,
  personPassword: string,
  confirmPassword: string,
  personSubmitted: boolean,
  submitSuccessful: boolean,
  isCaptchaFilled: boolean,
  buttonState: string
}

class OrganizationSignup extends Component<Props, State, {}> {
  constructor(props: Props) {
    super(props);
    this.state = {
      personUsername: '',
      personPassword: '',
      confirmPassword: '',
      personSubmitted: false,
      isCaptchaFilled: false,
      submitSuccessful: false,
      buttonState: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.generateIdentity = this.generateIdentity.bind(this);
    this.generatePreKeyBundle = this.generatePreKeyBundle.bind(this);
    this.handleConfirmPassword = this.handleConfirmPassword.bind(this);
    this.captchaVerify = this.captchaVerify.bind(this);
  }

  captchaVerify(value) {
    this.setState({ isCaptchaFilled: true });
  }

  handleChangeUsername(event: any) {
    this.setState({ personUsername: event.target.value });
  }

  handleChangePassword(event: any) {
    this.setState({ personPassword: event.target.value });
  }

  handleConfirmPassword(event: any) {
    this.setState({ confirmPassword: event.target.value });
  }

  generateIdentity(store) {
    return Promise.all([
        KeyHelper.generateIdentityKeyPair(),
        KeyHelper.generateRegistrationId(),
    ]).then((result) => {
        console.log("keyhelper generation", result)
        store.put('identityKey', result[0]);
        store.put('registrationId', result[1]);
    });
  }

  generatePreKeyBundle(store, preKeyId, signedPreKeyId) {
    return Promise.all([
        store.getIdentityKeyPair(),
        store.getLocalRegistrationId()
    ]).then(function(result) {
        var identity = result[0];
        var registrationId = result[1];

        return Promise.all([
            KeyHelper.generatePreKey(preKeyId),
            KeyHelper.generateSignedPreKey(identity, signedPreKeyId),
        ]).then(function(keys) {
            var preKey = keys[0]
            var signedPreKey = keys[1];

            store.storePreKey(preKeyId, preKey.keyPair);
            store.storeSignedPreKey(signedPreKeyId, signedPreKey.keyPair);

            return {
                identityKey: identity.pubKey,
                registrationId : registrationId,
                preKey:  {
                    keyId     : preKeyId,
                    publicKey : preKey.keyPair.pubKey
                },
                signedPreKey: {
                    keyId     : signedPreKeyId,
                    publicKey : signedPreKey.keyPair.pubKey,
                    signature : signedPreKey.signature
                }
            };
        });
    });
  }
  handleSubmit(event: any) {
    this.setState({ buttonState: 'running' });
    const {
      personUsername,
      personPassword,
      confirmPassword
    } = this.state;
    if (process.env.NODE_ENV === 'production' && !this.state.isCaptchaFilled) {
      this.props.alert.show('Please click the Recaptcha');
      this.setState({ buttonState: '' });
    } 
    else if (personPassword !== confirmPassword) {
      this.props.alert.show('Your passwords are not identical');
    }
    else {
      let userAddress = new window.libsignal.SignalProtocolAddress(personUsername, 1); // establish signal protocol address
      let userStore = new window.SignalProtocolStore; // get store, or else create store
      let userPreKeyId = 1337; 
      let userSignedKeyId = 1;
      Promise.all([
          this.generateIdentity(userStore), // at the beginning of the chat, get bobs identity
      ]).then(() => {
          console.log("generated users prekey bundle")
          return this.generatePreKeyBundle(userStore, userPreKeyId, userSignedKeyId); // generate bobs keys here
      }).then((preKeyBundle) => {
        fetch('localhost:3002/registerClient', {
          method: 'POST',
          body: JSON.stringify({          
            "personUsername": personUsername,
            "userAddress": userAddress,
            "preKeyBundle": preKeyBundle
          }),
        }).then((response) => response.json())
          .then((responseJSON) => {
            const {
              status,
              message,
            } = JSON.parse(responseJSON);
            console.log(responseJSON);
            if (status === 'SUCCESSFUL_ENROLLMENT') {
              this.setState({ buttonState: '' });
              this.setState({ submitSuccessful: true });
              this.props.alert.show(message);
            } else {
              console.log(status);
              this.props.alert.show(message);
              this.setState({ buttonState: '' });
            }
          }).catch((error) => {
            this.props.alert.show(`Server Failure: ${error}`);
            this.setState({ buttonState: '' });
          });
      })
      
    }
  }

  render() {
    const {
      personUsername,
      personPassword,
      confirmPassword,
      submitSuccessful,
    } = this.state;

    const organizationFormHeader = 'Client Signup';
    const organizationFormBody = 'Thank you for using End2End, an encrypted chat application that follows the Signal Protocol'
    if(submitSuccessful){
      return (<Redirect to="/" />);
    }
    return (
      <div className="container">
        <Helmet>
          <title>Organization Signup</title>
          <meta name="description" content="Keep.id" />
        </Helmet>
        <div className="row">
          <div className="col-md-12">
            <div className="jumbotron jumbotron-fluid bg-white pb-2 mb-2">
              <div className="container">
                <h1 className="display-5 text-center font-weight-bold mb-3">{organizationFormHeader}</h1>
                <p className="lead">{organizationFormBody}</p>
              </div>
            </div>
            <form onSubmit={this.handleSubmit}>
              <div className="col-md-12">
                <div className="form-row">
                  <div className="col-md-4 form-group">
                    <label htmlFor="inputUsername" className="w-100 pr-3">
                      Select Username
                      <span className="red-star">*</span>
                      <input type="text" className="form-control form-purple" id="inputUsername" placeholder="Username here" value={personUsername} onChange={this.handleChangeUsername} required />
                    </label>
                  </div>
                  <div className="col-md-4 form-group">
                    <label htmlFor="inputPassword" className="w-100 pr-3">
                      Select Password
                      <text className="red-star">*</text>
                      <input type="password" className="form-control form-purple" id="inputPassword" placeholder="******" value={personPassword} onChange={this.handleChangePassword} />
                    </label>
                  </div>
                  <div className="col-md-4 form-group">
                    <label htmlFor="confirmPassword" className="w-100 pr-3">
                      Confirm Password
                      <span className="red-star">*</span>
                      <input type="text" className="form-control form-purple" id="confirmPassword" placeholder="******" value={confirmPassword} onChange={this.handleConfirmPassword} required />
                    </label>
                  </div>
                </div>
                <div className="row mt-5">
                  <div className="col-md-6">
                    <ReCAPTCHA
                      sitekey={reCaptchaKey}
                      onChange={this.captchaVerify}
                    />
                  </div>
                  <div className="col-md-6">
                    <button type="submit" onClick={this.handleSubmit} className={`btn btn-success ld-ext-right ${this.state.buttonState}`}>
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

export default withAlert()(OrganizationSignup);
