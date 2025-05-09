import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGoogleLoginMutation } from "../../redux/api/userApiSlice";
import { setCredentials } from "../../redux/features/authSlice";


const GoogleLoginButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [googleLogin] = useGoogleLoginMutation();

  const handleSuccess = async (credentialResponse:any ) => {
    try {
      const { credential } = credentialResponse;

      const res = await googleLogin({ idToken: credential }).unwrap();

      dispatch(setCredentials(res.user));
      navigate("/");
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  const handleError = () => {
    console.error("Google Login Failed");
  };

  return (
    <div className="flex items-center justify-center mt-4">
        
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
        theme="filled_black"
        size="large"
        width="300"
      />
    </div>
  );
};

export default GoogleLoginButton;
