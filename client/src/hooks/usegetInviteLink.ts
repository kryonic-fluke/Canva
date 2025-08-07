import { useMutation } from "@tanstack/react-query";
import { getinviteLinkAPi } from "../api/canvas";

export const useGetInviteLink = () => {
  return useMutation({
    mutationFn: (_id: string) => getinviteLinkAPi(_id),

    onSuccess: (data) => {
      const { inviteLink } = data;
      console.log("Invite Link Generated:", inviteLink);

      navigator.clipboard.writeText(inviteLink);
      alert("Invite link copied to clipboard!");
    },
    onError: (error) => {
      console.error("Failed to get invite link:", error);
      alert("Could not generate invite link. Please try again.");
    },
  });
};
