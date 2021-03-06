import React, { Component, PropTypes, Children, cloneElement } from 'react';
import Navbar from '../Navbar/navIndex';
import Header from '../Layout/headerPresenter';
import Footer from '../Layout/footerPresenter';
import HeaderBlock from '../Layout/headerBlockPresenter';
import MainBlock from '../Layout/mainBlockPresenter';
import {
  container,
  headerBlock,
  mainBlock,
  stickyActive,
  footerActive,
  copyright,
  aboutUs,
  landing,
  loginContainer,
  fitbitLogin,
  jawboneLogin,
} from '../../css/main.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.isSticky = '';
    this.isFooter = '';
    this.onFooter = false;
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    const { scrollTop } = document.body;
    const aRender = 150; // re-render trigger area
    const fScroll = 3350; // footer y-coordinate
    const hScroll = 750; // header y-coordinate
    const reRender = (
      (scrollTop > hScroll && scrollTop < hScroll + aRender) || (scrollTop < hScroll && scrollTop > hScroll - aRender) ||
      (scrollTop > fScroll && scrollTop < fScroll + aRender) || (scrollTop < fScroll && scrollTop > fScroll - aRender)
    );
    this.isSticky = scrollTop > hScroll ? stickyActive : '';
    this.isFooter = scrollTop > fScroll ? footerActive : '';
    this.onFooter = scrollTop > fScroll;
    if (reRender) this.setState({}); // trigger component re-rendering
  }

  render() {
    const { isAuth, children, history, user } = this.props;
    const { isSticky, isFooter, onFooter } = this;
    // const authCheck = (isAuth === 'false'); // disable auth for development purpose; comment this out in production
    const authCheck = (isAuth === 'true' || localStorage.getItem('auth') === 'true' && user.length !== 0); // uncomment this in production
    const childrenWithProps = Children.map(children, (child) => cloneElement(child, { isSticky })); // passing props to child components
    const classnames = `${container} ${isSticky}`; // add multiple class names
    return (
      <div>
        {authCheck &&
          <div className={classnames}>
            {isSticky &&
              <HeaderBlock headerBlock={headerBlock} />
            }
            {!isFooter &&
              <Header isSticky={isSticky} />
            }
            <MainBlock mainBlock={mainBlock} />
            <main className={isSticky}>{childrenWithProps}</main>
            <Navbar
              hist={history}
              isSticky={isSticky}
              isFooter={isFooter}
              onFooter={onFooter}
              handleScroll={this.handleScroll}
            />
            <MainBlock mainBlock={mainBlock} />
            <Footer copyright={copyright} isSticky={isSticky} aboutUs={aboutUs} />
          </div>
        }
        {!authCheck &&
          <div className={landing}>
            <h1>Welcome to Fitomo</h1>
            <div className={loginContainer}>
              <div className={fitbitLogin}>
                <a href="/auth/fitbit"><div>Sign in with Fitbit</div></a>
              </div>
              <div className={jawboneLogin}>
                <a href="/auth/jawbone"><div>Sign in with Jawbone</div></a>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default App;

App.propTypes = {
  isAuth: PropTypes.string.isRequired,
  user: PropTypes.array.isRequired,
  children: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};
