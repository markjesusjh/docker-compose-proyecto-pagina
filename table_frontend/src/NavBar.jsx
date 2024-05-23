import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemText, Divider, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    justifyContent: 'space-between', 
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const NavBar = () => {
  const classes = useStyles();
  const [openDrawer, setOpenDrawer] = useState(false);
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleViewAll = () => {
    window.location.reload(); 
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Sistema de Delivery
          </Typography>
        </Toolbar>
        <div>
          <Button color="inherit" onClick={handleGoHome}>Página Principal</Button>
          <Button color="inherit" onClick={handleViewAll}>Ver Todos</Button>
        </div>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="temporary"
        classes={{
          paper: classes.drawerPaper,
        }}
        open={openDrawer}
        onClose={handleDrawerClose}
      >
        <div className={classes.drawerContainer}>
          <List>
            <ListItem button component={Link} to="/users" onClick={handleDrawerClose}>
              <ListItemText primary="Usuarios" />
            </ListItem>
            <ListItem button component={Link} to="/products" onClick={handleDrawerClose}>
              <ListItemText primary="Productos" />
            </ListItem>
            <ListItem button component={Link} to="/orders" onClick={handleDrawerClose}>
              <ListItemText primary="Pedidos" />
            </ListItem>
          </List>
          <Divider />
        </div>
      </Drawer>
    </div>
  );
};

export default NavBar;
