import React from "react";
import { AppBar, Typography, Toolbar, Avatar, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "../../types/actionTypes";
import { styles } from "./styles";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import type { RootState } from "../../reducers";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  const { user, authData } = useSelector((state: RootState) => state.auth);

  const logout = () => {
    dispatch({ type: ActionType.LOGOUT });
    navigate("/auth");
  };

  return (
    <AppBar sx={styles.appBar} position="static" color="inherit">
      <div style={styles.brandContainer}>
        <Typography
          component={Link}
          to="/"
          sx={styles.heading}
          variant="h5"
          align="center"
        >
          Lucky 7
        </Typography>
      </div>
      <Toolbar sx={styles.toolbar}>
        {authData && user ? (
          <div style={styles.profile}>
            <Avatar
              alt={user.name}
              sx={{ mr: 2 }}
            />
            <Typography sx={styles.userName} variant="h6">
              {user.name}
            </Typography>
            <Typography sx={{ mr: 2 }} variant="h6">
              Tokens: {user.tokens || 0}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                navigate("/game");
              }}
              sx={{ mr: 2 }}
            >
              Play Game
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                navigate("/password");
              }}
              sx={{ mr: 2 }}
            >
              Set Password
            </Button>
            <Button
              variant="contained"
              sx={styles.logout}
              color="secondary"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        ) : (
          <Button
            component={Link}
            to="/auth"
            variant="contained"
            color="primary"
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;