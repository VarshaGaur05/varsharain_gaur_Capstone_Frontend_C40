import React from "react";
import logo from "../../assets/logo.jpeg";
import "./Header.css";
import "../Common.css";
import Login from "../../screens/login/Login";
import Register from "../../screens/register/Register";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CardContent from "@material-ui/core/CardContent";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Modal from "react-modal";
import { withStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useLogout } from "../../hooks/useLogout";

Modal.setAppElement(document.getElementById("root"));

const customStyle = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    height: "auto",
    padding: "0px",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    border: "0.1px solid #D3D3D3",
  },
};

const styles = (theme) => ({
  Paper: {
    borderRadius: 5,
    padding: 5,
    border: "0.1px solid #D3D3D3",
  },
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Header = (props) => {
  const classes = props;
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const { userToken, dispatch } = useAuthContext();

  const { logout } = useLogout();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const deleteToken = async () => {
    sessionStorage.removeItem("access-token");
    sessionStorage.removeItem("emailId");
    sessionStorage.removeItem("appointmentId");
    sessionStorage.removeItem("doctorId");
    await logout();
    dispatch({ type: "LOGOUT" });
  };

  return (
    <div>
      <header className="header">
        <img src={logo} className="logo" alt="BookMyConsultation App Logo" />
        &nbsp;&nbsp;
        <span id="header-title"> Doctor Finder </span>
        <div className="login-button">
          {!userToken || open ? (
            <div className="login-button">
              <Button variant="contained" color="primary" onClick={handleOpen}>
                Login
              </Button>
            </div>
          ) : (
            <div className="login-button">
              <Button
                variant="contained"
                color="secondary"
                onClick={deleteToken}
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>

      <Modal
        isOpen={open}
        onRequestClose={handleClose}
        aria-labelledby="login-register"
        aria-describedby="authentication"
        style={customStyle}
      >
        <Paper className={classes.paper}>
          <div className="typography">
            <p>Authentication</p>
          </div>
          <CardContent>
            <Tabs
              aria-label="Login and Register"
              onChange={handleChange}
              value={value}
              TabIndicatorProps={{ style: { background: "#F50057" } }}
              centered
            >
              <Tab label="Login" {...a11yProps(0)} />
              <Tab label="Register" {...a11yProps(1)} />
            </Tabs>

            <TabPanel value={value} index={0}>
              <Login handleModalClose={handleClose} />
            </TabPanel>

            <TabPanel value={value} index={1}>
              <Register handleModalClose={handleClose} />
            </TabPanel>
          </CardContent>
        </Paper>
      </Modal>
    </div>
  );
};

export default withStyles(styles)(Header);
