import { useNavigate } from "@solidjs/router";
import { onMount } from "solid-js";
import { authStore } from "~/lib/auth";

export default function DashboardRoot() {
  const navigate = useNavigate();

  onMount(() => {
    const user = authStore.user();
    if (!user) {
      navigate("/login");
      return;
    }

    switch (user.peran) {
      case "ADMIN":
        navigate("/dashboard/admin");
        break;
      case "DRIVER":
        navigate("/dashboard/driver");
        break;
      case "INDUSTRI":
        navigate("/dashboard/industri");
        break;
      default:
        navigate("/dashboard/user");
    }
  });

  return null;
}
