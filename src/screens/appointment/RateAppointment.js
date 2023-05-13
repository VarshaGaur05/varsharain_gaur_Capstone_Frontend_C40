import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Rating from "@material-ui/lab/Rating";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Paper from "@material-ui/core/Paper";
import "./Appointment.css";
import { useAuthContext } from "../../hooks/useAuthContext";

const RateAppointment = ({ appointmentDetails, handleClose }) => {
  const [comment, setComment] = React.useState("");
  const [rating, setRating] = React.useState(0);
  const [ratingError, setRatingError] = React.useState(false);
  const [ratingSuccess, setRatingSuccess] = React.useState(false);
  const { userToken } = useAuthContext();

  const ratingURL = "http://localhost:8080/ratings";

  const handleRating = (e) => {
    if (e) e.preventDefault();

    if (rating === 0) {
      setRatingError(true);
      return;
    }

    if (setRatingError !== true) {
      fetch(ratingURL, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json;Charset=UTF-8",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          appointmentId: appointmentDetails.appointmentId,
          doctorId: appointmentDetails.doctorId,
          rating: rating,
          comments: comment,
        }),
      })
        .then((response) => {
          if (response.ok) {
            setRatingSuccess(true);
            setTimeout(() => {
              handleClose();
            }, 1500);
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
    <div>
      <Paper>
        <div
          style={{
            background: "purple",
            color: "white",
            padding: "11px",
            height: "70px",
            display: "flex",
            alignItems: "center",
            fontSize: "1.2em",
          }}
        >
          <span id="rating-header">Rate an Appointment</span>
        </div>
        <div id="rating-body">
          <div className="rate-input">
            <TextField
              label="Comments"
              onChange={(e) => setComment(e.target.value)}
              id="standard-multiline-static"
              multiline
              rows={3}
            />
          </div>
          <div className="rating-input-star">
            <FormControl>
              Rating:
              <Rating
                value={rating}
                onChange={(e, newValue) => {
                  if (newValue) {
                    setRating(newValue);
                  }
                }}
                name="read-only"
              />
              <div className="rating-error">
                {rating === 0 && ratingError && (
                  <FormHelperText id="invalid-error">
                    Select a rating
                  </FormHelperText>
                )}
              </div>
            </FormControl>
          </div>
          <Button
            onClick={handleRating}
            id="rate-button-customize"
            variant="contained"
            color="primary"
          >
            RATE APPOINTMENT
          </Button>
        </div>
        <div>
          {ratingSuccess === true && (
            <FormHelperText id="rating-success">Rating Success</FormHelperText>
          )}
        </div>
      </Paper>
    </div>
  );
};

export default RateAppointment;
