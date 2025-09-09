import { useMutation } from "@tanstack/react-query";
import { getinviteLinkAPi } from "../api/canvas";
import toast from "react-hot-toast";

export const useGetInviteLink = () => {
  return useMutation({
    mutationFn: (_id: string) => getinviteLinkAPi(_id),

    onSuccess: (data) => {
      const { inviteLink } = data;
      toast.success("Invite Link Generated!");
      console.log("Invite Link Generated:", inviteLink);

      navigator.clipboard.writeText(inviteLink);
      
    },
    onError: (error) => {
      toast.error("Failed to get invite link.")
      console.error("Failed to get invite link:", error);
    },
  });
};
