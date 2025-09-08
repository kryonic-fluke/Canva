import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast"; // Example for showing error notifications
import { firebaseSwitchAccount } from "../services/firebase";

export const useSwitchAccount = () => {
  const queryClient = useQueryClient();

  const { mutate: switchAccount, isPending: isSwitching } = useMutation({
    mutationFn: firebaseSwitchAccount,

    onSuccess: () => {
      queryClient.clear();
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { switchAccount, isSwitching };
};