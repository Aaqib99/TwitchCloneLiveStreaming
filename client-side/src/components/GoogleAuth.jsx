import React, { useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { connect } from "react-redux";
import { signIn, signOut } from "../actions";

const GoogleAuth = ({ isSignedIn, userId, userName, signIn, signOut }) => {
    console.log("Redux State in GoogleAuth:", { isSignedIn, userId, userName });
    const googleButtonRef = useRef(null);

    // ✅ 1. Define handleCredentialResponse First
    const handleCredentialResponse = (response) => {
        try {
            const userObject = jwtDecode(response.credential);
            console.log("Google Sign-In Response:", userObject);

            const authData = { userId: userObject.sub, userName: userObject.name };

            // Store user session in localStorage
            localStorage.setItem("authUser", JSON.stringify(authData));

            // Dispatch Redux action
            signIn(authData);
            if (googleButtonRef.current) {
                googleButtonRef.current.innerHTML = "";
            }
        } catch (error) {
            console.error("JWT Decode Error:", error);
        }
    };

    // ✅ 2. Define initializeGoogleSignIn Next
    const initializeGoogleSignIn = () => {
        if (!window.google || !window.google.accounts) {
            console.error("Google API not available.");
            return;
        }

        window.google.accounts.id.initialize({
            client_id: "516542022333-djjspalg2te6lvk91920dp679l6516c9.apps.googleusercontent.com",
            callback: handleCredentialResponse
        });

        if (!isSignedIn && googleButtonRef.current) {
            console.log("Rendering Google Sign-In button...");
            window.google.accounts.id.renderButton(
                googleButtonRef.current,
                { theme: "outline", size: "large" }
            );
        }
    };

    // ✅ 3. Now use useEffect After Both Functions are Defined
    useEffect(() => {
        // Check for saved user session
        const savedUser = localStorage.getItem("authUser");
        if (savedUser) {
            const user = JSON.parse(savedUser);
            console.log("Restoring user session:", user);
            signIn(user); // Dispatch sign-in action
        }

        if (!window.google) {
            const script = document.createElement("script");
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.defer = true;
            script.onload = initializeGoogleSignIn;
            document.body.appendChild(script);
        } else {
            initializeGoogleSignIn();
        }
    }, []); // Empty dependency array ensures it runs only once

    const handleSignOut = () => {
        signOut(); // Dispatch Redux action
        localStorage.removeItem("authUser"); // Remove stored session
        window.google.accounts.id.disableAutoSelect();

        // Show Google sign-in button again
        if (googleButtonRef.current) {
            googleButtonRef.current.innerHTML = "";
            window.google.accounts.id.renderButton(
                googleButtonRef.current,
                { theme: "outline", size: "large" }
            );
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
            {!isSignedIn ? (
                <div ref={googleButtonRef}></div>
            ) : (
                <div>
                    <h2>Welcome</h2>
                    <button onClick={handleSignOut}>Sign Out</button>
                </div>
            )}
        </div>
    );
};

const mapStateToProps = (state) => ({
    isSignedIn: state.auth.isSignedIn,
    userId: state.auth.userId,
    userName: state.auth.userName // ✅ Extract correctly
});

// Connect Redux state and actions to the component
export default connect(mapStateToProps, { signIn, signOut })(GoogleAuth);
