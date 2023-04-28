import React, { useState } from "react";
import Header from "../../common/common.css";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";

const Login = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [reqEmail, setReqEmail] = useState('dispNone')
    const [reqPassword, setReqPassword] = useState('dispNone')


    const onEmailChanged = (e) => {
        setEmail(e.target.value.split(","));
    }

    const onPasswordChange = (e) => {
        setPassword(e.target.value.split(","));
    }

    const onLoginButtonClick = async () => {
        if (validateUserInput()) {
            const param = window.btoa(`${email[0]}:${password[0]}`)
            try {
                const rawResponse = await fetch('http://localhost:8085/api/v1/auth/login', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json;charset=UTF-8",
                        "Accept": "application/json;charset=UTF-8",
                        authorization: `Basic ${param}`
                    },
                })

                const response = await rawResponse.json()

                if (rawResponse.ok) {
                    window.sessionStorage.setItem('user-details', JSON.stringify(response));
                    window.sessionStorage.setItem('access-token', rawResponse.headers.get('access-token'));
                    if(sessionStorage.getItem('access-token')) {
                        props.setIsLoggedIn(true);
                        props.handleClose()
                    }
                } else {
                    throw (new Error(response.message || 'Something went wrong!'))
                }
            } catch (e) {
                alert(`Error: ${e.message}`);
            }
        }
        return;
    }

    const validateUserInput = () => {
        email === '' ? setReqEmail('dispBlock') : setReqEmail("dispNone");
        password === '' ? setReqPassword('dispBlock') : setReqPassword("dispNone");

        if (email === "" || password === "") {
            return false;
        }

        return true;
    }


    return (
        <div className="container">
            <div>
                <FormControl required className="formControl">
                    <InputLabel htmlFor="username">Email</InputLabel>
                    <Input id="username" value={email} onChange={onEmailChanged} />
                    <FormHelperText className={reqEmail}>
                        <span className="red">Required</span>
                    </FormHelperText>
                </FormControl>


                <br /> <br />
                <FormControl required className="formControl">
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Input id="password" value={password} onChange={onPasswordChange} />
                    <FormHelperText className={reqPassword}>
                        <span className="red">Required</span>
                    </FormHelperText>
                </FormControl>
            </div>

            <br /> <br />

            <div className="btn-holder">
                <Button variant="contained" color='primary' onClick={onLoginButtonClick}>Login</Button>
            </div>
        </div>
    )
}

export default Login;