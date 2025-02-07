import { Link } from 'react-router-dom'
import { AppBar, Toolbar, Button } from '@mui/material'

const Header = ({ user, logout }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          blogs
        </Button>
        <Button color="inherit" component={Link} to="/users">
          users
        </Button>
        {user
          ? <div>
            <b>{user.name} logged in</b>
            <Button color="inherit" onClick={logout}>
                logout
            </Button>
          </div>
          : <Button color="inherit" component={Link} to="/login">
              login
          </Button>
        }
      </Toolbar>
    </AppBar>
  )
}

export default Header