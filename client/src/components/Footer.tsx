import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../static/images/logo.svg';
import GithubLogo from '../static/images/github-logo.svg';

class Footer extends Component<{}, {}> {
  render() {
    return (
      <footer className="footer custom-footer-color">
        <div className="container">
          <div className="d-flex flex-row bd-highlight py-8 py-md-11 flex-wrap">
            <div className="p-2 bd-highlight col-12 col-md-4 col-lg-4 mb-4">
              <div className="row">
                <img alt="Keep.id Logo" className="footer-brand img-fluid mb-2 ml-3" src={Logo} />
                <div className="mb-2 ml-3 footer-brand-logo">End2End</div>
              </div>
              <p className="text-gray-700 mb-2">Secure End-to-end Encrypted Chat App</p>
              <ul className="list-unstyled list-inline list-social">
              <li className="list-inline-item list-social-item mr-3">
                <Link to="" className="text-decoration-none">
                  <img alt="Github Link" src={GithubLogo} className="list-social-icon" />
                </Link>
              </li>
              </ul>
              <ul className="list-unstyled list-inline list-social">
                <Link to="/bug-report" className="text-decoration-none">
                  <span className="footer-link pb-1">Report a Bug</span>
                </Link>
              </ul>
              <span className="text-muted pb-2">&copy;	2020 Connor Chong</span>
            </div>
            <div className="p-2 bd-highlight col-12 col-md-4 col-lg-3 mb-4">
              <h6 className="font-weight-bold text-uppercase footer-text-header mb-3">About The Application</h6>
              <ul className="list-unstyled text-muted mb-6 mb-md-8 mb-lg-0">
                <li className="mb-3">
                  <Link to="/" className="footer-link">The Signal Protocol</Link>
                </li>
                <li className="mb-3">
                  <Link to="/" className="footer-link">OpenPGP</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;
