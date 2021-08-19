import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPosts } from "../../actions/post";
import progress from "../layout/ProgressBar";
import PostItem from "./PostItem";
import PostForm from "./PostForm";

const Post = ({ getPosts, post: { posts, loading } }) => {
  useEffect(() => {
    getPosts();
  }, []);
  useEffect(() => {
    if (loading) {
      progress.start();
      setTimeout(() => {
        progress.finish();
      }, 150);
    }
  }, [loading]);
  return (
    <Fragment>
      <h1 className="large text-primary">Posts</h1>
      <p className="lead">
        <i className="fas fa-user"></i>Welcome to the Community
      </p>
      <PostForm />
      {posts.map((post) => (
        <PostItem key={post._id} post={post} />
      ))}
    </Fragment>
  );
};

Post.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(mapStateToProps, { getPosts })(Post);
