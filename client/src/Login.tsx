import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { auth } from "../firebase/config";  // Import initialized Firebase
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import ForgotPassword from './components/ForgotPassword';
import AppTheme from './theme/AppTheme';
import ColorModeSelect from './theme/ColorModeSelect';
import { GitHubIcon, SitemarkIcon } from './components/CustomIcons';


const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
      maxWidth: '450px',
    },
    boxShadow:
      'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
      boxShadow:
        'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
  }));

  const SignInContainer = styled(Stack)(({ theme }) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(4),
    },
    '&::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      zIndex: -1,
      inset: 0,
      backgroundImage:
        'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
      backgroundRepeat: 'no-repeat',
      ...theme.applyStyles('dark', {
        backgroundImage:
          'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
      }),
    },
  }));


const Login: React.FC = (props: { disableCustomTheme?: boolean }) => {
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [open, setOpen] = React.useState(false);

    const navigate = useNavigate();
    const provider = new GithubAuthProvider();

    provider.addScope("read:user");
    provider.addScope("user:email");
    provider.addScope("public_repo");
    provider.addScope("read:org");

    // Force GitHub to show account selection
    provider.setCustomParameters({
        prompt: "select_account" 
      });


      useEffect(() => {
        if (localStorage.getItem('github_token')) navigate('/dashboard');
      }, [navigate]); // Added dependency array
      

    const handleGitHubLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const credential = GithubAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;
            const user = result.user;

            console.log("User signed in:", user);
            console.log("GitHub Access Token:", token);

            const isNewUser = (result as any)?._tokenResponse?.isNewUser;

            if (isNewUser) {
                console.log("New user detected! Redirecting to profile setup...");
                navigate('/profile-setup');
            } else {
                console.log("User already exists. Redirecting to dashboard...");
                navigate('/dashboard');
            }

            if (token) {
                localStorage.setItem("github_token", token);
            }

        } catch (error) {
            console.error("Error during sign-in:", error);
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validateInputs()) return; // Prevent form submission if invalid

        const data = new FormData(event.currentTarget);
        console.log({
        email: data.get('email'),
        password: data.get('password'),
        });
    };

      const validateInputs = () => {
        const email = document.getElementById('email') as HTMLInputElement;
        const password = document.getElementById('password') as HTMLInputElement;
    
        let isValid = true;
    
        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
          setEmailError(true);
          setEmailErrorMessage('Please enter a valid email address.');
          isValid = false;
        } else {
          setEmailError(false);
          setEmailErrorMessage('');
        }
    
        if (!password.value || password.value.length < 6) {
          setPasswordError(true);
          setPasswordErrorMessage('Password must be at least 6 characters long.');
          isValid = false;
        } else {
          setPasswordError(false);
          setPasswordErrorMessage('');
        }
    
        return isValid;
      };

    return (
        <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        <SignInContainer direction="column" justifyContent="space-between" >
            <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
            <Card variant="outlined">
            <SitemarkIcon />
            <Typography
                component="h1"
                variant="h4"
                sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
            >
                Sign in
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                gap: 2,
                }}
            >
                <FormControl>
                <FormLabel 
                    htmlFor="email" 
                    sx={{ textAlign: 'left', display: 'block', mb: 0.5 }}
                >Email</FormLabel>
                <TextField
                    error={emailError}
                    helperText={emailErrorMessage}
                    id="email"
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    autoComplete="email"
                    autoFocus
                    required
                    fullWidth
                    variant="outlined"
                    color={emailError ? 'error' : 'primary'}
                />
                </FormControl>
                <FormControl>
                <FormLabel
                    htmlFor="email" 
                    sx={{ textAlign: 'left', display: 'block', mb: 0.5 }}
                >Password</FormLabel>
                <TextField
                    error={passwordError}
                    helperText={passwordErrorMessage}
                    name="password"
                    placeholder="••••••"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    autoFocus
                    required
                    fullWidth
                    variant="outlined"
                    color={passwordError ? 'error' : 'primary'}
                />
                </FormControl>
                <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
                />
                <ForgotPassword open={open} handleClose={handleClose} />
                <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={validateInputs}
                >
                Sign in
                </Button>
                <Link
                component="button"
                type="button"
                onClick={handleClickOpen}
                variant="body2"
                sx={{ alignSelf: 'center' }}
                >
                Forgot your password?
                </Link>
            </Box>
            <Divider>or</Divider>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
            fullWidth
            variant="outlined"
            onClick={handleGitHubLogin}
            startIcon={<GitHubIcon />}
            >
            Sign in with GitHub
            </Button>

                <Typography sx={{ textAlign: 'center' }}>
                Don&apos;t have an account?{' '}
                <Link
                    href="/register"
                    variant="body2"
                    sx={{ alignSelf: 'center' }}
                >
                    Sign up
                </Link>
                </Typography>
            </Box>
            </Card>
        </SignInContainer>
        </AppTheme>
        );
};

export default Login;
