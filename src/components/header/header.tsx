import React, { useState } from 'react';
import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  makeStyles,
  Hidden,
  IconButton,
  Box,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import RouteDrawer from 'components/route-drawer/route-drawer';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  button: {
    padding: theme.spacing(2),
  },
  list: {
    width: 250,
  },
}));

export default function Header(props: Record<string, unknown>) {
  const classes = useStyles();
  const [showDrawer, setShowDrawer] = useState(false);

  const toggleDrawer = () => setShowDrawer(!showDrawer);

  return (
    <AppBar position="static">
      <Toolbar>
        <Hidden mdUp>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <RouteDrawer showDrawer={showDrawer} toggleDrawer={toggleDrawer} />
        </Hidden>
        <Typography variant="h6" className={classes.title}>
          MTG Token Buddy
        </Typography>
        <Hidden smDown>
          <Box marginX={1}>
            <Button
              component={Link}
              to="/input"
              color="inherit"
              className={classes.button}
            >
              Input
            </Button>
          </Box>
          <Box marginX={1}>
            <Button
              component={Link}
              to="/about"
              color="inherit"
              className={classes.button}
            >
              About
            </Button>
          </Box>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}
