import CookieConsent from "react-cookie-consent";

export default function CookieBanner() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accetta"
      declineButtonText="Rifiuta"
      enableDeclineButton
      cookieName="feiverCookieConsent"
      style={{
        background: "#222",
        color: "#fff",
        fontSize: "14px",
      }}
      buttonStyle={{
        background: "#b6a6c9",
        color: "#fff",
        fontSize: "14px",
        borderRadius: "4px",
      }}
      declineButtonStyle={{
        background: "#555",
        color: "#fff",
        fontSize: "14px",
        borderRadius: "4px",
      }}
      expires={150}
    >
      Utilizziamo cookie per offrirti la migliore esperienza possibile sul sito.
    </CookieConsent>
  );
}