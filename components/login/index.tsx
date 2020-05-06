import React from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import { getSession } from '../../lib/solid-auth-fetcher/dist';


interface IProps {
}

interface IState {
  loggedIn: boolean | null;
}


export default class Login extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      loggedIn: null,
    };
  }

  checkSession = (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault();

    // This is just a demo - it only checks the current session, rather than
    // firing the auth flow. That's for next sprint, when this code will be
    // refactored and moved to use react hooks (something like useSession())
    getSession().then((session: any) => {
      if (!session || !session.loggedIn) {
        this.setState({ loggedIn: false });
      } else {
        this.setState({ loggedIn: true });
      }
    });
  }

  render() {
    const { loggedIn } = this.state;

    return (
      <Container maxWidth="sm">
        <Box my={4}>
          <h1>Log In</h1>

          <Typography>
            {loggedIn === true ? 'User logged in' : null}
            {loggedIn === false ? 'User not logged in' : null}
          </Typography>

          <Button
            color="primary"
            variant="contained"
            onClick={this.checkSession}
          >
            Check for existing session
          </Button>
        </Box>
      </Container>
    );
  }
}
