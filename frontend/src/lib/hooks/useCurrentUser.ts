import { useQuery } from "@tanstack/react-query";
import { GetCurrentUser } from "../api/auth";

export default function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: GetCurrentUser,
    staleTime: 1000 * 60 * 60 * 4,
  });
}
