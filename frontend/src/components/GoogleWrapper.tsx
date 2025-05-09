import { GoogleOAuthProvider } from "@react-oauth/google";
import { Loader } from "lucide-react";
import { useGetClientIdQuery } from "../redux/api/userApiSlice";

interface Props {
  children: React.ReactNode;
}

const GoogleAuthWrapper: React.FC<Props> = ({ children }) => {
  // Using the Redux hook to get the clientId
  const { data, error, isLoading } = useGetClientIdQuery({});

  // Show loading spinner while clientId is being fetched
  if (isLoading) {
    return (
      <div>
        <Loader className="animate-spin h-8 w-10" />
      </div>
    );
  }

  // Handle error if the clientId fetch failed
  if (error) {
    console.error("Error fetching Google Client ID:", error);
    return <div>Error loading Google Client ID</div>;
  }

  // Render GoogleOAuthProvider once the clientId is available
  return (
    <GoogleOAuthProvider clientId={data?.clientId || ""}>
      {children}
    </GoogleOAuthProvider>
  );
};

export default GoogleAuthWrapper;
