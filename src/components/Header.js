import React from 'react';
import { Link } from 'react-router-dom';
import {auth, signOut, db} from '../firebase';
import { storageKey, hidePresence } from '../firebase';
import './css/Header.css';
import createHistory from 'history/createBrowserHistory';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

// let  authenticated = true;

export default class Header extends React.Component {

    componentDidMount() {
      let  self = this;
      auth.onAuthStateChanged(user => {
        if (user) {
          window.localStorage.setItem(storageKey, user.uid);
          this.setState({uid: user.uid});
          let  usernameRef = db.ref('users/'+user.uid+'/publicFields/displayName');
          usernameRef.on('value', function(snapshot) {
            let  username = snapshot.val();
            self.setState({username: username});
          });

        } else {
          window.localStorage.removeItem(storageKey);
          this.setState({uid: null});
        }
      });
    }

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      uid: null,
      username: null
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  handleLogoutClick() {
      // authenticated = false;
      // hidePresence has to be called before auth.signOut()
      hidePresence();
      signOut();
      let history = createHistory();
      history.push(process.env.PUBLIC_URL, {});
  }

  handleSignUpClick() {
      // authenticated = true;
  }

  render(){
    return (
      <div className='header-inner-container'>
          {this.state.uid ?
                <div className='signup-logout'>
                    <Link className='app-title' to='/'><h4 style={{margin:'0'}}>GamePortal</h4></Link>
                    <h4 className='header-name-display'>Hello! {this.state.username}</h4>
                    <h4 className='signup-logout-link' onClick={this.handleLogoutClick.bind(this)}> Log Out</h4>
                </div> :
                <div className='signup-logout'>
                    <Link className='app-title' to='/'><h4 style={{margin:'0'}}>GamePortal</h4></Link>
                    <Link className='signup-logout-link' onClick={this.handleSignUpClick.bind(this)} to="Register">
                        <h4 style={{margin:'0'}}>Sign up</h4>
                    </Link>
                </div>
          }
          <ToastContainer
              position="top-right"
              type="default"
              autoClose={7000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              pauseOnHover
          />
      </div>
    );
  }
}
