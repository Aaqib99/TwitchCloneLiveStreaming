import streams from "../apis/streams";
import history from "../history";

import {
    SIGN_IN, SIGN_OUT, CREATE_STREAM,
    FETCH_STREAMS,
    DELETE_STREAM,
    FETCH_STREAM,
    EDIT_STREAM
} from "./types";

export const signIn = (userId, userName) => {
    return {
        type: SIGN_IN,
        payload: { userId, userName }  // ✅ Store as an object
    };
};

export const signOut = () => {
    return {
        type: SIGN_OUT
    };
};

export const createStream = (formValues) => async (dispatch, getState) => {
    const { userId } = getState().auth;  // Get current user ID
    const response = await streams.post("/streams", { ...formValues, userId }); // Attach user ID
    dispatch({ type: CREATE_STREAM, payload: response.data });
    history.push("/");
};

export const fetchStreams = () => async (dispatch) => {
    const response = await streams.get("/streams");
    const uniqueStreams = Object.values(response.data).reduce((acc, stream) => {
        acc[stream.id] = stream; // Store unique records by ID
        return acc;
    }, {});
    dispatch({ type: FETCH_STREAMS, payload: uniqueStreams });
};

export const fetchStream = (id) => async dispatch => {
    const response = await streams.get(`/streams/${id}`);
    dispatch({ type: FETCH_STREAM, payload: response.data })
}

export const editStream = (id, formValues) => async dispatch => {
    const response = await streams.patch(`/streams/${id}`, formValues);
    dispatch({ type: EDIT_STREAM, payload: response.data })
    history.push("/");
}

export const deleteStream = (id) => async dispatch => {
    await streams.delete(`/streams/${id}`);
    dispatch({ type: DELETE_STREAM, payload: id })
    history.push("/");
} 