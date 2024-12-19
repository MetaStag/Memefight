import { useEffect } from "react";

export default function GoogleButton(props: any) {
  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <div
        id="g_id_onload"
        data-client_id={process.env.NEXT_PUBLIC_GOOGLE_OAUTH_KEY}
        data-context={props.action}
        data-ux_mode="popup"
        data-callback="handleCallback"
        data-auto_prompt="false"
        data-use_fedcm_for_prompt="true"
      ></div>
      <div
        className="g_id_signin"
        data-type="standard"
        data-shape="rectangular"
        data-theme="filled_blue"
        data-text="continue_with"
        data-size="medium"
        data-logo_alignment="left"
      ></div>
    </>
  );
}
