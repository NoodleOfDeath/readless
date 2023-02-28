import React from "react";
import ReactCookieConsent from "react-cookie-consent";

export default function CookieConsent() {
  return (
    <ReactCookieConsent
      location="bottom"
      buttonText="Accept"
      cookieName="cookieConsent"
      style={{ background: "#2B373B" }}
      buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
      expires={150}
    >
      We use cookies on our website to enhance your user experience and ensure
      the website&apos;s functionality. By using our website, you agree to the
      use of functional cookies, including the storage of cookies to save your
      cookie settings. Functional cookies are essential for the proper
      functioning of our website and help us to improve its performance. These
      cookies do not collect personal data and are necessary for the operation
      of the website. However, we also use cookies to collect data about your
      use of our website, such as your browsing behavior, preferences, and other
      non-personal information. We use this data to improve the user experience
      and for analytical purposes. If you do not wish to have cookies stored
      that collect user data, you can go to the cookie settings page and
      opt-out. Please note that disabling certain cookies may impact your user
      experience on our website. By continuing to use our website, you agree to
      our use of cookies as outlined in this disclaimer.
    </ReactCookieConsent>
  );
}
