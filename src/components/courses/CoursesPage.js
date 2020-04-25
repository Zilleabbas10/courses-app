import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { Redirect } from "react-router-dom";

import * as courseActions from "../../redux/actions/courseActions";
import * as authorActions from "../../redux/actions/authorActions";
import CourseList from "./CourseList";
import Spinner from "../common/Spinner";
import { toast } from "react-toastify";

class CoursesPage extends React.Component {
  state = {
    redirectToAddCoursePage: false
  };

  componentDidMount() {
    const { courses, authors, actions } = this.props;

    if (courses.length === 0) {
      actions.loadCourses().catch(error => {
        //alert("Loading courses failed ===>> ", error);
        toast.error("Loading courses failed. " + error.message);
      });
    }

    if (authors.length === 0) {
      actions.loadAuthors().catch(error => {
        toast.error("Loading authors failed. " + error.message);
        //alert("Loading authors failed ===>> ", error);
      });
    }
  }

  handleDeleteCourse = async course => {
    const { actions } = this.props;
    toast.success("Course deleted successfully!!");
    try {
      await actions.deleteCourse(course);
    } catch (error) {
      toast.error("Deleting course failed. " + error.message, {
        autoClose: false
      });
      actions.updateCourse(course);
    }
  };

  render() {
    const { courses, authors, loading } = this.props;
    return (
      <>
        {this.state.redirectToAddCoursePage && <Redirect to="/course/" />}
        <h2>Courses</h2>
        {loading ? (
          <Spinner />
        ) : (
          <>
            <button
              style={{ marginBottom: 20 }}
              className="btn btn-primary add-course"
              onClick={() => this.setState({ redirectToAddCoursePage: true })}
            >
              Add Course
            </button>
            <CourseList
              onDeleteClick={this.handleDeleteCourse}
              courses={courses}
              authors={authors}
            />
          </>
        )}
      </>
    );
  }
}

CoursesPage.propTypes = {
  actions: PropTypes.object.isRequired,
  courses: PropTypes.array.isRequired,
  authors: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired
};

const formatCourses = (courses, authors) => {
  const formattedCourses = courses.map(course => {
    return {
      ...course,
      authorName: authors.find(author => author.id === course.authorId).name
    };
  });
  return formattedCourses;
};

const mapStateToProps = ({ courses, authors, apiCallsInProgress }) => {
  return {
    courses: authors.length === 0 ? [] : formatCourses(courses, authors),
    authors,
    loading: apiCallsInProgress > 0
  };
};

const mapDispatchToProps = dispatch => {
  return {
    actions: {
      loadCourses: bindActionCreators(courseActions.loadCourses, dispatch),
      loadAuthors: bindActionCreators(authorActions.loadAuthors, dispatch),
      deleteCourse: bindActionCreators(courseActions.deleteCourse, dispatch),
      updateCourse: bindActionCreators(courseActions.updateCourse, dispatch)
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CoursesPage);
