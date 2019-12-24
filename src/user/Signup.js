import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ReCAPTCHA from 'react-google-recaptcha';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      repeat: '',
      token: null,
      error: null,
      warning: 'Please enter a email address and password',
      disabled: false,
    };
    this.onSignupButton = this.onSignupButton.bind(this);
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onRepeatChange = this.onRepeatChange.bind(this);
    this.onReCaptchaChange = this.onReCaptchaChange.bind(this);
  }

  onSignupButton(event) {
    this.setState({disabled: true});

    const data = {
      user_id: this.state.email,
      password: this.state.password,
      token: this.state.token,
    };

    window.fetch('/api/signup', {
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
        alert('User is created. Press OK to move to login page.');
        this.props.history.push('/login');
      }
    });

    event.preventDefault();
  }

  getWarningMsg(email, password, repeat) {
    if (!EMAIL_REGEX.test(email)) {
      return 'Please enter a valid email address';
    } else if (password.length < 5) {
      return 'Password must be longer than 4';
    } else if (password !== repeat) {
      return 'Password did not match';
    } else {
      return null;
    }
  }
  onEmailChange(event) {
    let new_email = event.target.value;
    this.setState({
      email: new_email,
      warning: this.getWarningMsg(new_email, this.state.password, this.state.repeat),
    })
  }
  onPasswordChange(event) {
    let new_password = event.target.value;
    this.setState({
      password: new_password,
      warning: this.getWarningMsg(this.state.email, new_password, this.state.repeat),
    })
  }
  onRepeatChange(event) {
    let new_repeat = event.target.value;
    this.setState({repeat: event.target.value,
      warning: this.getWarningMsg(this.state.email, this.state.password, new_repeat),
    })
  }
  onReCaptchaChange(val) {
    this.setState({ token: val });
  }

  getWarning() {
    if (this.state.warning) {
      return (
        <div className='alert alert-warning mt-2' role='alert'>
          {this.state.warning}
        </div>
      )
    }
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
      <div className='Signup'>
        <h1>Create a New Account</h1>
        <Form>
          <Form.Group controlId='formUserId'>
            <Form.Label>Email address (must be a valid email address to get a support)</Form.Label>
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

          <Form.Group controlId='formRepeat'>
            <Form.Label>Confirm</Form.Label>
            <Form.Control onChange={this.onRepeatChange}
            type='password'
            placeholder='Please repeat your password'
            disabled={this.state.processing} />
          </Form.Group>
          <ReCAPTCHA
            sitekey='6LfFackUAAAAAJr0Rnq8Gw1Yicwcbxcd9PbubXVX'
            onChange={this.onReCaptchaChange}
          />
          <Button onClick={this.onSignupButton} variant='primary' disabled={this.state.disabled || this.state.token === null || this.state.processing || this.state.warning}>Sign-up</Button>
        </Form>
        {this.getWarning()}
        {this.getAlert()}
      </div>
    )
  }
}

export default Signup;