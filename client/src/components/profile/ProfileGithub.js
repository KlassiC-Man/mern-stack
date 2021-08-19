import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getGithubRepos } from "../../actions/profile";
import progress from "../layout/ProgressBar";

const ProfileGithub = ({ getGithubRepos, username, repos }) => {
  useEffect(() => {
    getGithubRepos(username);
  }, []);

  useEffect(() => {
    if (repos === null) {
      progress.start();
      setTimeout(() => {
        progress.finish();
      }, 200);
    }
  }, [repos]);

  return (
    <div className="profile-github">
      <h2 className="text-primary">Github Repos</h2>
      {repos.map((repo) => (
        <div key={repo._id} className="repo bg-white p-1 my-1">
          <div>
            <h4>
              <a href={repo.html_url} target="_blank" rel="noopener noreferer">
                {repo.name}
              </a>
            </h4>
            <p>{repo.description}</p>
          </div>
          <div>
            <ul>
              <li className="badge badge-primary">
                Stars: {repo.stargazers_count}
              </li>
              <li className="badge badge-dark">
                Watchers: {repo.watchers_count}
              </li>
              <li className="badge badge-light">Forks: {repo.forks_count}</li>
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

ProfileGithub.propTypes = {
  getGithubRepos: PropTypes.func.isRequired,
  repos: PropTypes.array.isRequired,
  username: String,
};

const mapStateToProps = (state) => ({
  repos: state.profile.repos,
});

export default connect(mapStateToProps, { getGithubRepos })(ProfileGithub);
