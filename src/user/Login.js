import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha'

import { withCookies } from 'react-cookie';

import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import { login } from '../utils/api';

class Login extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      email: '',
      password: '',
      token: null,
      error: null,
      processing: false,
    }
    this.rechaptchaRef = React.createRef();
    this.onLoginButton = this.onLoginButton.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onReCaptchaChange = this.onReCaptchaChange.bind(this);
  }

  onLoginButton(event) {
    this.setState({processing: true});

    const user_id = this.state.email;

    login(user_id, this.state.password, this.state.token).then(response => {
      if (response.error) {
        return Promise.reject(response.error);
      }

      const session_id = response.session_id;

      this.props.cookies.set('user_id', user_id, { maxAge: 2*60*60, path: '/' });
      this.props.cookies.set('session_id', session_id, { maxAge: 2*60*60, path: '/' });

      // move to home page
      this.props.history.push('/');
    }).catch(err => {
      this.setState({error: err, processing: false});
      this.rechaptchaRef.current.reset();
    });

    event.preventDefault();
  }

  onEmailChange(event) {
    this.setState({ email: event.target.value });
  }
  onPasswordChange(event) {
    this.setState({ password: event.target.value });
  }
  onReCaptchaChange(val) {
    this.setState({ token: val });
  }

  getAlert() {
    if (this.state.error) {
      return (
        <div className='alert alert-danger mt-2' role='alert'>
          {this.state.error}
        </div>
      )
    }
  }

  render() {
    return (
      <Container className='Login'>
        <h1>Login</h1>
        <Form>
          <Form.Group controlId='formUserId'>
            <Form.Label>Email address</Form.Label>
            <Form.Control onChange={this.onEmailChange}
            type='email'
            placeholder='Enter email'
            disabled={this.state.processing} />
            <Form.Text className='text-muted'></Form.Text>
          </Form.Group>
      
          <Form.Group controlId='formPassword'>
            <Form.Label>Password (has to be more than 4 in length)</Form.Label>
            <Form.Control onChange={this.onPasswordChange}
            type='password'
            placeholder='Password'
            disabled={this.state.processing} />
          </Form.Group>

          <ReCAPTCHA
            ref={this.rechaptchaRef}
            sitekey='6LfFackUAAAAAJr0Rnq8Gw1Yicwcbxcd9PbubXVX'
            onChange={this.onReCaptchaChange}
          />
          <Button onClick={this.onLoginButton} variant='primary' disabled={this.processing || this.state.token === null}>Login</Button>
        </Form>
        {this.getAlert()}
      </Container>
    );
  }
}

export default withCookies(Login);