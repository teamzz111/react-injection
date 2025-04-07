import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import { useEffect, useState } from "react";

const useLoginPresenter = () => {
  const { login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"client" | "admin" | null>(
    null
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = () => {
    if (!selectedRole) return;

    setLoading(true);

    setTimeout(() => {
      if (selectedRole === "client") {
        login({
          id: "client-123",
          name: "Usuario Cliente",
          role: "client",
          email: "cliente@example.com",
        });
      } else {
        login({
          id: "admin-456",
          name: "Usuario Administrador",
          role: "admin",
          email: "admin@example.com",
        });
      }

      navigate("/");
      setLoading(false);
    }, 800);
  };

  return { handleLogin, selectedRole, setSelectedRole, loading };
};

export default useLoginPresenter;
