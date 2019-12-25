import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha'

import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

class Login extends React.Component {
  constructor(prop) {
    super(prop);
    this.state = {
      email: '',
      password: '',
      token: null,
      error: null,
      disabled: false,
    }
    this.onLoginButton = this.onLoginButton.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onReCaptchaChange = this.onReCaptchaChange.bind(this);
  }

  onLoginButton(event) {
    this.setState({disabled: true});

    const user_id = this.state.email;

    const data = {
      user_id,
      password: this.state.password,
      token: this.state.token,
    };

    window.fetch('/api/login', {
      method: 'POST',
      mode: 'same-origin',
      cache: 'no-cache',
      credentials: 'omit',
      headers: {'Content-Type': 'application/json'},
      redirect: 'error',
      referrer: 'no-referrer',
      body: JSON.stringify(data),
    }).then(response => response.json())
    .then(response => {
      if (response.error) {
        this.setState({error: response.error, disabled: false});
      } else {
        this.props.onLogin(user_id, response.session_id);
        this.props.history.push('/');
      }
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
            sitekey='6LfFackUAAAAAJr0Rnq8Gw1Yicwcbxcd9PbubXVX'
            onChange={this.onReCaptchaChange}
          />
          <Button onClick={this.onLoginButton} variant='primary' disabled={this.disabled || this.state.token === null}>Login</Button>
        </Form>
      </Container>
    );
  }
}

export default Login;