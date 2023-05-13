import React from "react";
import "./Doctor.css";
import TextField from "@material-ui/core/TextField";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { Typography } from "@material-ui/core";
import { useAuthContext } from "../../hooks/useAuthContext";

const BookAppointment = ({ doctorDetails, handleClose }) => {
  const date = new Date().toISOString().split("T")[0];
  const [selectedDate, handleDateChange] = React.useState(date);
  const [slots, setSlots] = React.useState([]);
  const [slotsAvailable, setSlotsAvailable] = React.useState("");
  const [symptoms, setSymptoms] = React.useState("");
  const [medicalHistory, setMedicalHistory] = React.useState("");
  const [slotError, setSlotError] = React.useState(false);

  const [userFirstName, setUserFirstName] = React.useState("");
  const [userLastName, setUserLastName] = React.useState("");

  const [appointmentSuccessFul, setAppointmentSuccessFul] =
    React.useState(false);

  const [isSlotEmpty, setIsSlotEmpty] = React.useState(false);

  const { userToken } = useAuthContext();

  const emailId = sessionStorage.getItem("emailId");

  let doctorName = doctorDetails.firstName + " " + doctorDetails.lastName;

  const usersAPI = "http://localhost:8080/users/";

  const appointmentBookingURL = "http://localhost:8080/appointments/";

  const appointmentSlots = `http://localhost:8080/doctors/${doctorDetails.id}/timeSlots?date=${selectedDate}`;


  const handleSlotChange = (e) => {
    if (isSlotEmpty) {
      alert("Either the slot is already booked or not available");
    } else {
      setSlotsAvailable(e.target.value);
    }
  };

  const userDetailsAPI = () => {
    if (userToken === null) {
      return;
    } else {
      fetch(usersAPI + emailId, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json;Charset=UTF-8",
          Authorization: `Bearer ${userToken}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Something went wrong");
          }
        })
        .then((details) => {
          setUserFirstName(details.firstName);
          setUserLastName(details.lastName);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const appointmentSlotAPI = () => {
    fetch(appointmentSlots)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then((slot) => {
        setSlots(slot.timeSlot);
        console.log(slot);
        if (slot.length <= 0) {
          setIsSlotEmpty(true);
        } else {
          setIsSlotEmpty(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  React.useEffect(() => {
    if (userToken !== null) {
      userDetailsAPI();
      appointmentSlotAPI();
    }
    // eslint-disable-next-line
  }, []);

  const appointmentBookingHandler = (e) => {
    if (e) e.preventDefault();

    if (userToken === null) {
      alert("Please login to book Appointment");
      return;
    }

    slotsAvailable === "" ? setSlotError(true) : setSlotError(false);

    if (slotsAvailable !== "") {
      fetch(appointmentBookingURL, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json;Charset=UTF-8",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          doctorId: doctorDetails.id,
          doctorName: doctorName,
          userId: emailId,
          userName: userFirstName + " " + userLastName,
          userEmailId: emailId,
          timeSlot: slotsAvailable,
          appointmentDate: selectedDate,
          symptoms: symptoms,
          priorMedicalHistory: medicalHistory,
        }),
      })
        .then((response) => {
          if (response.ok) {
            setAppointmentSuccessFul(true);
            setTimeout(() => {
              handleClose();
            }, 1500);
            return response.json();
          } else if (response.status === 400) {
            alert("Either the slot is already booked or not available");
          } else {
            throw new Error("Something went wrong");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div className="booking-holder">
      <div
        style={{
          background: "purple",
          color: "white",
          padding: "11px",
          height: "70px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography id="modal-header-appointment">
          Book an Appointment
        </Typography>
      </div>
      <div id="book-appointment-container">
        <form noValidate autoComplete="off">
          <div id="doctor-name-text">
            <TextField
              disabled
              required
              value={doctorName}
              id="standard-basic"
              label="Doctor Name"
            />
          </div>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="MM/dd/yyyy"
              margin="normal"
              id="date-picker-inline"
              label="Date picker inline"
              value={selectedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </MuiPickersUtilsProvider>
          <div>
            <FormControl>
              <InputLabel id="demo-simple-select-label">Timeslot </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={slotsAvailable}
                onChange={handleSlotChange}
              >
                <MenuItem>None</MenuItem>
                {slots.map((time, key) => {
                  return (
                    <MenuItem key={key} value={time}>
                      {time}
                    </MenuItem>
                  );
                })}
              </Select>
              <div>
                {slotsAvailable === "" && slotError === true && (
                  <FormHelperText id="invalid-error">
                    Select a time slot
                  </FormHelperText>
                )}
              </div>
            </FormControl>
          </div>
          <FormControl>
            <TextField
              onChange={(e) => {
                setMedicalHistory(e.target.value);
              }}
              id="standard-multiline-static"
              label="Medical History"
              multiline
              value={medicalHistory}
              rows={4}
            />
            <div>
              <TextField
                onChange={(e) => {
                  setSymptoms(e.target.value);
                }}
                id="standard-multiline-static"
                label="Symptoms"
                value={symptoms}
                multiline
                rows={4}
              />
            </div>

            <Button
              id="bookappointment-button-customize"
              variant="contained"
              color="primary"
              onClick={appointmentBookingHandler}
            >
              BOOK APPOINTMENT
            </Button>
          </FormControl>
        </form>
      </div>
      <div>
        {appointmentSuccessFul === true && (
          <FormHelperText id="booking-success-customize">
            Appointment Booking Successful
          </FormHelperText>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;
