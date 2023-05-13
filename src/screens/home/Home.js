import React from "react";
import Header from "../../common/header/Header";
import DoctorList from "../doctorList/DoctorList";
import Appointment from "../appointment/Appointment";
import PropTypes from "prop-types";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  tabs: {
    "& .MuiTab-wrapper": {
      fontWeight: 400,
    },
    "& .MuiTabs-indicator": {
      backgroundColor: "#3F51B5",
    },
    "& .MuiTab-root.Mui-selected": {
      color: "#3F51B5",
    },
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
        <Box>
          <Typography component={"div"}>{children}</Typography>
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

const Home = (props) => {

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Header {...props} />
      <div>
        <Box sx={{ minWidth: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              variant="fullWidth"
              TabIndicatorProps={{ style: { background: "#3F51B5" } }}
              className={classes.tabs}
            >
              <Tab label="DOCTORS" {...a11yProps(0)} />
              <Tab label="APPOINTMENT" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0} style={{ textAlign: "center" }}>
            <DoctorList />
          </TabPanel>
          <TabPanel value={value} index={1} style={{ textAlign: "center" }}>
            <Appointment />
          </TabPanel>
        </Box>
      </div>
    </div>
  );
};

export default Home;
