import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const auth = getAuth();

    signOut(auth)
      .then(() => {
        console.log("User signed out successfully");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  return handleLogout;
};

export default useLogout;