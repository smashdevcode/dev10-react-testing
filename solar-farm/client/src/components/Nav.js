import { Link } from 'react-router-dom';

function Nav() {
  return (
    <nav>
      <Link to="/">Home</Link> <Link to="/list">View Panels</Link>{' '}
      <Link to="/add">Add a Panel</Link>
    </nav>
  );
}

export default Nav;
