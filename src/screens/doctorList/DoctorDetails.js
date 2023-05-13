import React from "react";
import "../doctorList/Doctor.css";
import { Typography, CardContent, Paper } from "@material-ui/core";
import StarIcon from "@material-ui/icons/Star";

const DoctorDetails = ({ doctorDetails }) => {
  const ratings = () => {
    let stars = [];
    for (let i = 0; i < doctorDetails.rating; i++) {
      stars.push(<StarIcon style={{ color: "gold" }} />);
    }
    return stars;
  };

  return (
    <Paper>
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
        <Typography id="modal-header-doctor">Doctor Details</Typography>
      </div>
      <CardContent id="card-content-customize">
        <Typography id="doctor-name">
          Dr: {doctorDetails.firstName} {doctorDetails.lastName}
        </Typography>
        <Typography id="details-text">
          Total Experience: {doctorDetails.totalYearsOfExp} years
        </Typography>
        <Typography id="details-text">
          Speciality: {doctorDetails.speciality}
        </Typography>

        <Typography id="details-text">
          Date of Birth: {doctorDetails.dob}
        </Typography>

        <Typography id="details-text">
          City: {doctorDetails.address.city}
        </Typography>

        <Typography id="details-text">
          Email: {doctorDetails.emailId}
        </Typography>

        <Typography id="details-text">
          Mobile: {doctorDetails.mobile}
        </Typography>

        <Typography id="details-text">Rating: {ratings()}</Typography>
      </CardContent>
    </Paper>
  );
};

export default DoctorDetails;
