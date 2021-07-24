import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import CreateIcon from '@material-ui/icons/Create';
import { Link } from 'react-router-dom';
import { RouteDrawerProps } from './route-drawer-interfaces';

const useStyles = makeStyles((theme) => ({
  list: {
    width: 250,
  },
}));

export default function RouteDrawer(props: RouteDrawerProps) {
  const classes = useStyles();
  const { showDrawer, toggleDrawer } = props;
  return (
    <Drawer
      anchor="left"
      open={showDrawer}
      onClose={toggleDrawer}
      role="presentation"
    >
      <List className={classes.list}>
        <ListItem button onClick={toggleDrawer} component={Link} to="/input">
          <ListItemIcon>
            <CreateIcon />
          </ListItemIcon>
          <ListItemText primary="Input" />
        </ListItem>
        <ListItem button onClick={toggleDrawer} component={Link} to="/about">
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText primary="About" />
        </ListItem>
      </List>
    </Drawer>
  );
}
