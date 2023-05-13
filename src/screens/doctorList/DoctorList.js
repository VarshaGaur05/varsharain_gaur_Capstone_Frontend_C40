import React from "react";
import "./Doctor.css";
import Modal from "react-modal";
import BookAppointment from "./BookAppointment";
import DoctorDetails from "./DoctorDetails";
import { withStyles } from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";
import { useAuthContext } from "../../hooks/useAuthContext";
import {
  Button,
  Paper,
  Select,
  Typography,
  Grid,
  MenuItem,
} from "@material-ui/core";

Modal.setAppElement(document.getElementById("modal"));

const customStyle = {
  content: {
    width: "40%",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    height: "auto",
    marginRight: "-50%",
    padding: "0px",
    transform: "translate(-50%, -50%)",
    border: "0.1px solid #D3D3D3",
  },
};

const customStyle2 = {
  content: {
    width: "25%",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    height: "auto",
    marginRight: "-50%",
    padding: "0px",
    transform: "translate(-50%, -50%)",
    border: "0.1px solid #D3D3D3",
  },
};

const styles = (theme) => ({
  Paper: {
    borderRadius: 5,
    padding: 5,
  },
});

const DoctorList = (props) => {
  const classes = props;

  const { userToken } = useAuthContext();

  const [selectedSpeciality, setSelectedSpeciality] = React.useState("");

  const [doctor, setDoctor] = React.useState({});

  const [doctorList, setDoctorList] = React.useState([]);

  const [doctorSpeciality, setDoctorSpeciality] = React.useState([]);

  const [doctorDetailsModalOpen, setdoctorDetailsModalOpen] =
    React.useState(false);
  const [bookAppointmentModalOpen, setBookAppointmentModalOpen] =
    React.useState(false);

  const doctorSpecialityURL = "http://localhost:8080/doctors/speciality";
  const doctorListURL = "http://localhost:8080/doctors?speciality";

  const handleClose = () => {
    setdoctorDetailsModalOpen(false);
    setBookAppointmentModalOpen(false);
  };

  const handleSpecialityChange = (event) => {
    let speciality = event.target.value;
    setSelectedSpeciality(speciality);
    fetch(doctorListURL + "=" + speciality)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then((result) => {
        setDoctorList(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const doctorSpecialityRendering = () => {
    fetch(doctorSpecialityURL)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then((result) => {
        setDoctorSpeciality(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const doctorListRenderding = () => {
    fetch(doctorListURL + selectedSpeciality)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then((result) => {
        setDoctorList(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  React.useEffect(() => {
    doctorListRenderding();
    doctorSpecialityRendering();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <Grid item xs={12} sm container alignItems="center" direction="column">
        <Typography component={"div"} id="select-header">
          Select Speciality:
        </Typography>
        <Select
          value={selectedSpeciality}
          id="select-speciality"
          label="Speciality"
          style={{ minWidth: "200px" }}
          onChange={handleSpecialityChange}
        >
          {doctorSpeciality.map((speciality, index) => (
            <MenuItem aria-label="None" value={speciality} key={index}>
              {speciality}
            </MenuItem>
          ))}
        </Select>

        {doctorList.map((doctor, index) => (
          <Paper
            className="paper-customize"
            square
            style={{ justifyContent: "center" }}
            key={index}
          >
            <Typography component={"div"}>
              <div className="doctor-customize">
                Doctor Name : {doctor.firstName} {doctor.lastName}
              </div>
              <br />
              <div className="speciality-customize">
                Speciality : {doctor.speciality}
              </div>
              <div className="rating-customize">
                Rating : &nbsp;
                <Rating name="read-only" value={doctor.rating} readOnly />
              </div>
              <div className="button-div-customize">
                <Button
                  id="booknow-button-customize"
                  variant="contained"
                  color="primary"
                  onClick={(_) => {
                    setBookAppointmentModalOpen(true);
                    setDoctor(doctor);
                  }}
                >
                  BOOK NOW
                </Button>
                <Button
                  id="viewdetails-button-customize"
                  type="submit"
                  variant="contained"
                  onClick={(_) => {
                    setdoctorDetailsModalOpen(true);
                    setDoctor(doctor);
                  }}
                >
                  VIEW DETAILS
                </Button>
              </div>
            </Typography>
          </Paper>
        ))}
        <Modal
          isOpen={bookAppointmentModalOpen || false}
          onRequestClose={handleClose}
          aria-labelledby="book-appointment"
          aria-describedby="booking"
          style={customStyle}
          className={classes.paper}
        >
          <BookAppointment doctorDetails={doctor} handleClose={handleClose} />
        </Modal>

        <Modal
          isOpen={doctorDetailsModalOpen || false}
          onRequestClose={handleClose}
          aria-labelledby="book-appointment"
          aria-describedby="booking"
          style={customStyle2}
          className={classes.paper}
        >
          <DoctorDetails doctorDetails={doctor} key={doctor.doctorId} />
        </Modal>
      </Grid>
    </div>
  );
};

export default withStyles(styles)(DoctorList);
