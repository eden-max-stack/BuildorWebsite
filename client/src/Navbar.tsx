import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function NavBar() {
    return (
      <Navbar expand="lg" bg="dark" variant="dark" fixed="top" className="shadow">
        <Container>
          <Navbar.Brand as={Link} to="/home">Buildor</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/register">Sign Up</Nav.Link>
              <Nav.Link as={Link} to="/login">Sign In</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
}

export default NavBar;
