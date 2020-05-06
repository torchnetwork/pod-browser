import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

export default function HelloWorld() {
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Hello World
        </Typography>
        <Typography gutterBottom>
          Check out my button, using Prism themes with Material UI components.
        </Typography>
        <Button variant="contained" color="primary">
          Primary
        </Button>
      </Box>
    </Container>
  );
}
