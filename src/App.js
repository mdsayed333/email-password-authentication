import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, updatePhoneNumber, updateProfile } from "firebase/auth";
import app from "./firebase.init";
import { Button } from "react-bootstrap";
import { useState } from "react";

const auth = getAuth(app);

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');
  const [registered, setRegister] = useState(false);
  const [name, setName] = useState('');

  const handleNameBlur = event =>{
    setName(event.target.value);
  }
  

  const handleEmailBlur = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordBlur = (event) => {
    setPassword(event.target.value);
  };

  const handleRegisteredChange = (event) =>{
    setRegister(event.target.checked);
  }

  const setUserName = () => {
    updateProfile(auth.currentUser, {
      displayName: name
    })
    .then(()=>{
      console.log('updating name');
    })
    .catch(error=>{
      setError(error.message);
    })
  }

  const handleFormSubmit = (event) => {

    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }
    
    if(!/(?=.*[!#$%&? "])/.test(password)){
      setError('Password should contain at least one special character');
      return;
    }
    setValidated(true);
    setError('');

    if(registered){
      signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        console.log(user);
      })
      .catch(error =>{
        console.error(error);
        setError(error.message);
      })
    }else{
      createUserWithEmailAndPassword(auth, email, password)
      .then(result =>{
      const user = result.user;
      console.log(user);
      setEmail('');
      setPassword('');
      verifyEmail()
      setUserName()
    })
      .catch(error =>{
      console.error(error)
      setError(error.message);
    })
    }
    event.preventDefault();
  };

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
    .then(()=>{
      console.log("Email verification Sent");
    })
  }

  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email)
  .then(() => {
    // Password reset email sent!
    console.log("send password reset email...")
  })
  .catch((error) => {
    
    // ..
  });
  }


  return (
    <div>
      <div className="registration w-50 mx-auto mt-3">
        <h2 className="text-primary">Please {registered ? "Login" : "Register"}</h2>

        <Form validated={validated}  onSubmit={handleFormSubmit}>
          {
          !registered && <Form.Group className="mb-3" controlId="formBasicText">
            <Form.Label>Your Name</Form.Label>
            <Form.Control onBlur={handleNameBlur} required type="text" placeholder="Enter Name" />
            <Form.Control.Feedback type="invalid">
            Please provide a valid Name.
            </Form.Control.Feedback>
          </Form.Group>
          } 
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control onBlur={handleEmailBlur} required type="email" placeholder="Enter email" />
            <Form.Control.Feedback type="invalid">
            Please provide a valid email.
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control onBlur={handlePasswordBlur} required type="password" placeholder="Password" />
            <Form.Control.Feedback type="invalid">
            Please provide a valid Password.
            </Form.Control.Feedback>
          </Form.Group>
          <p className="text-danger">{error} </p>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check onChange={handleRegisteredChange} type="checkbox" label="Already Register?" />
          </Form.Group>
          <Button onClick={handlePasswordReset} variant="link">Forget Password?</Button> <br></br>
          <Button variant="primary" type="submit">
            {registered ? "Login" : "Register"}
          </Button>
        </Form>

      </div>
    </div>
  );
}

export default App;
