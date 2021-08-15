import axios from "axios";
import { setAlert } from "./alert";
import { GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE } from "./types";

//Get current users profile!
export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/profile/me");
    dispatch({ type: GET_PROFILE, payload: res.data });
  } catch (e) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: e.response.statusText, status: e.response.status },
    });
  }
};

//create or update profile
export const createProfile =
  (formData, history, edit = false) =>
  async (dispatch) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios.post("/api/profile", formData, config);
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      });
      dispatch(
        setAlert(edit ? "Profile Updated" : "Profile Created", "success")
      );

      history.push("/dashboard");
    } catch (e) {
      const errors = e.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }

      dispatch(
        setAlert(
          "Skills and Status are required fields, be sure to fill them",
          "danger"
        )
      );

      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: e.response.statusText, error: e.response.status },
      });
    }
  };

// Add experience
export const addExperience = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.put("/api/profile/experience", formData, config);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });
    dispatch(setAlert("Experience Added!", "success"));
    history.push("/dashboard");
  } catch (e) {
    const errors = e.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch(
      setAlert(
        "Skills and Status are required fields, be sure to fill them",
        "danger"
      )
    );

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: e.response.statusText, error: e.response.status },
    });
  }
};

// Add Education
export const addEducation = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.put("/api/profile/education", formData, config);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });
    dispatch(setAlert("Education Added!", "success"));
    history.push("/dashboard");
  } catch (e) {
    const errors = e.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch(
      setAlert(
        "Skills and Status are required fields, be sure to fill them",
        "danger"
      )
    );

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: e.response.statusText, error: e.response.status },
    });
  }
};
