import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addEducation } from "../../actions/profile";
import { Link, withRouter } from "react-router-dom";
import { on } from "events";

const AddEducation = ({ addEducation, history }) => {
  const [formData, setFormData] = useState({
    school: "",
    degree: "",
    fieldofstudy: "",
    from: "",
    to: "",
    current: false,
    description: "",
  });
  const [toDateDisabled, toggleDisabled] = useState(false);
  const { school, degree, fieldofstudy, from, to, current, description } =
    formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  return (
    <Fragment>
      <h1 class="large text-primary">Add Your Education</h1>
      <p class="lead">
        <i class="fas fa-code-branch"></i> Add any school or bootcamp that you
        have attended! positions that you have had in the past
      </p>
      <small>* = required field</small>
      <form
        class="form"
        onSubmit={(e) => {
          e.preventDefault();
          addEducation(formData, history);
        }}
      >
        <div class="form-group">
          <input
            type="text"
            placeholder="* School or Bootcamp"
            value={school}
            onChange={(e) => onChange(e)}
            name="school"
            required
          />
        </div>
        <div class="form-group">
          <input
            type="text"
            value={degree}
            onChange={(e) => onChange(e)}
            placeholder="* Degree or Certificate"
            name="degree"
            required
          />
        </div>
        <div class="form-group">
          <input
            type="text"
            value={fieldofstudy}
            onChange={(e) => onChange(e)}
            placeholder="field of study"
            name="fieldofstudy"
          />
        </div>
        <div class="form-group">
          <h4>From Date</h4>
          <input
            type="date"
            name="from"
            value={from}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div class="form-group">
          <p>
            <input
              type="checkbox"
              checked={current}
              value={current}
              onChange={(e) => {
                setFormData({ ...formData, current: !current });
                toggleDisabled(!toDateDisabled);
              }}
              name="current"
              value=""
            />{" "}
            Current Job
          </p>
        </div>
        <div class="form-group">
          <h4>To Date</h4>
          <input
            disabled={toDateDisabled ? "disabled" : ""}
            type="date"
            name="to"
            value={to}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div class="form-group">
          <textarea
            name="description"
            value={description}
            onChange={(e) => onChange(e)}
            cols="30"
            rows="5"
            placeholder="Program Description"
          ></textarea>
        </div>
        <input type="submit" class="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

AddEducation.propTypes = {
  addEducation: PropTypes.func.isRequired,
};

export default connect(null, { addEducation })(withRouter(AddEducation));
