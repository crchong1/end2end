import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import UploadSVG from '../static/images/uploading-files-to-the-cloud.svg';
import RequestSVG from '../static/images/request.svg';
import AppSVG from '../static/images/calendar.svg';
import EmailSVG from '../static/images/email.svg';
import AssistSVG from '../static/images/assistance.svg';
import FileSVG from '../static/images/file.svg';

interface State {
  show: boolean
}

class ClientLanding extends Component<{}, State, {}> {
  constructor(props: Readonly<{}>) {
    super(props);
  }

  render() {
    return (
      <div id="Buttons" className="container">
        <Helmet>
          <title>Home</title>
          <meta name="description" content="Keep.id" />
        </Helmet>
        <div className="row m-auto">
          <div className="col d-flex" id="Upload container">
            <Link to="/messages">
              <div className="rectangle mt-5 pt-4">
                <img className="uploadImg pb-2" src={UploadSVG} alt="See" />
                <p className="textLanding">
                  Your Messages
                </p>
              </div>
            </Link>
          </div>
          <div className="col d-flex" id="Print container">
            <Link to="/create-group-chat">
              <div className="rectangle mt-5 pt-2">
                <img className="normalImage" src={FileSVG} alt="Print" />
                <p className="textLanding mt-4 pt-3">Private Chat</p>
              </div>
            </Link>
          </div>
        </div>
        <div className="col d-flex" id="Print container">
          <Link to="/create-group-chat">
            <div className="rectangle mt-5 pt-2">
              <img className="normalImage" src={FileSVG} alt="Print" />
              <p className="textLanding mt-4 pt-3">Group Chat</p>
            </div>
          </Link>
        </div>
      </div>
    );
  }
}

export default ClientLanding;
