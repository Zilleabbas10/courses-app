import * as types from "../actions/actionTypes";
import initialState from "./initialState";

const { courses } = initialState;

const updateCourse = (courses, action) => {
  return courses.map(course =>
    course.id === action.course.id ? action.course : course
  );
};

const deleteCourse = (courses, action) => {
  return courses.filter(course => course.id !== action.course.id);
};

export default function courseReducer(state = courses, action) {
  switch (action.type) {
    case types.LOAD_COURSES_SUCCESS:
      return action.courses;
    case types.CREATE_COURSE_SUCCESS:
      return [...state, { ...action.course }];
    case types.UPDATE_COURSE_SUCCESS:
      return updateCourse(state, action);
    case types.DELETE_COURSE_OPTIMISTIC:
      return deleteCourse(state, action);
    case types.UPDATE_COURSE_OPTIMISTIC:
      return [...state, { ...action.course }];
    default:
      return state;
  }
}
