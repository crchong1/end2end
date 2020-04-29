import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import HubLogo from '../static/images/hubs.svg';
import DatabaseLogo from '../static/images/database.svg';
import AidPlatLogo from '../static/images/aidplatform.svg';
import * as crypto from "crypto";
import socket from '../socket';
import { withAlert } from 'react-alert';
const io = require('socket.io-client')

interface State {
  user: string
  targetUsername: string,
  buttonState: string,
  client: any,
  chatrooms: string[]
}

declare global {
  interface Window {
      libsignal:any;
      SignalProtocolStore: any;
      util: any
  }
}

interface Props {
  alert: any
}

const ls = window.libsignal;
const KeyHelper = ls.KeyHelper;
const store = new window.SignalProtocolStore;
const enc = new TextEncoder(); // always utf-8
const dec = new TextDecoder(); // always utf-8

// const store = new window.SignalProtocolStore();

class Login extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      user: '',
      targetUsername: '',
      buttonState: '',
      client: socket(),
      chatrooms: []
    };
    this.generateIdentity = this.generateIdentity.bind(this);
    this.generatePreKeyBundle = this.generatePreKeyBundle.bind(this);
    this.execute = this.execute.bind(this);
    this.onEnterChatroom = this.onEnterChatroom.bind(this)
    this.onLeaveChatroom = this.onLeaveChatroom.bind(this)
    this.getChatrooms = this.getChatrooms.bind(this)
    // this.register = this.register.bind(this)
    // this.renderUserSelectionOrRedirect = this.renderUserSelectionOrRedirect.bind(this)
  }

  onEnterChatroom(chatroomName, onNoUserSelected, onEnterSuccess) {
    if (!this.state.user)
      return onNoUserSelected()

    return this.state.client.join(chatroomName, (err, chatHistory) => {
      if (err)
        return console.error(err)
      return onEnterSuccess(chatHistory)
    })
  }

  onLeaveChatroom(chatroomName, onLeaveSuccess) {
    this.state.client.leave(chatroomName, (err) => {
      if (err)
        return console.error(err)
      return onLeaveSuccess()
    })
  }

  getChatrooms() {
    this.state.client.getChatrooms((err, chatrooms) => {
      this.setState({ chatrooms })
    })
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

  execute() {
    var ALICE_ADDRESS = new window.libsignal.SignalProtocolAddress("someaddresshere", 1); // establish signal protocol address
    var BOB_ADDRESS   = new window.libsignal.SignalProtocolAddress("someaddresshere2", 1);
    var aliceStore = new window.SignalProtocolStore; // get store, or else create store
    var bobStore = new window.SignalProtocolStore;

    var bobPreKeyId = 1337; // get prekey, signedkey, etc. from public server
    var bobSignedKeyId = 1;
    var Curve = window.libsignal.Curve;
    Promise.all([
        this.generateIdentity(aliceStore), // at the beginning of the chat, get alices identity
        this.generateIdentity(bobStore), // at the beginning of the chat, get bobs identity
    ]).then(() => {
        console.log("generated bobs prekey bundle")
        return this.generatePreKeyBundle(bobStore, bobPreKeyId, bobSignedKeyId); // generate bobs keys here
    }).then((preKeyBundle) => {
        // this example is sending alices message to bob 
        console.log("used alices store to process bobs prekey bundle")

        // create a session builder for each message from alice to Bob
        var builder = new window.libsignal.SessionBuilder(aliceStore, BOB_ADDRESS);
        return builder.processPreKey(preKeyBundle).then(() => {
          var originalMessage = window.util.toArrayBuffer("my message ......");
          var aliceSessionCipher = new window.libsignal.SessionCipher(aliceStore, BOB_ADDRESS);
          var bobSessionCipher = new window.libsignal.SessionCipher(bobStore, ALICE_ADDRESS);

          aliceSessionCipher.encrypt(originalMessage).then((ciphertext) => {
              // check for ciphertext.type to be 3 which includes the PREKEY_BUNDLE
              console.log(ciphertext.body)
              return bobSessionCipher.decryptPreKeyWhisperMessage(ciphertext.body, 'binary');
          }).then((plaintext) => {
              console.log("plaintext here:")
              console.log(dec.decode(plaintext))
              // alert(plaintext);
          }).then(() => {
            bobSessionCipher.encrypt(originalMessage).then((ciphertext) => {
                return aliceSessionCipher.decryptWhisperMessage(ciphertext.body, 'binary');
            }).then((plaintext) => {
                console.log("plaintext here2:")
                console.log(dec.decode(plaintext))
            });
          });
          
        });
    });
  } 
  render() {
    const socket2 = io.connect('http://localhost:3001')

    this.execute()
    return (
      <div className="container">
        <Helmet>
          <title>Login</title>
          <meta name="description" content="Keep.id" />
        </Helmet>
        <div className="row mt-5">
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-12" />
            </div>
            <div className="row">
              <div className="col">
                <div className="background ml-5 p-4 rounded mb-3 pb-5">
                  <div className="page-header">
                    <span className="brand-text">
                      End2End: The Encrypted Chat App
                    </span>
                  </div>                 
                  <h2 className="mt-4">
                    <span>Create an Account Here</span>
                  </h2>
                  <p>
                    <span>Start chatting securely with End2End.</span>
                  </p>
                  <a href="/client-signup" role="button" className="btn btn-lg btn-primary loginButtonBackground w-50">
                    Sign Up Here
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withAlert()(Login);
