const INITIAL_STATE = {
    isSignedIn: null,
    userId: null,
    userName: null
};

const authReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "SIGN_IN":
            return {
                ...state,
                isSignedIn: true,
                userId: action.payload.userId,
                userName: action.payload.userName
            };
        case "SIGN_OUT":
            return {
                ...state,
                isSignedIn: false,
                userId: null,
                userName: null
            };
        default:
            return state;
    }
};

export default authReducer;
