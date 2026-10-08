import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from "lucide-react";

import { capitialize } from "../lib/utils";

import FriendCard, { getLanguageFlag } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import toast from "react-hot-toast";
import { GptChatbox } from "../components/GptChatbox";

const GptHomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
    onSuccess: (friends) => console.log(friends)
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending, error: sendRequestMutationError } = useMutation({
    mutationFn: sendFriendRequest,
    onError: (err) => {
      console.log(err.response?.data?.message)
      toast.error(err.response?.data?.message ?? "Some Error Occured")
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  useEffect(() => {
    const outgoingIds = new Set();
    console.log("outgoingFriendReqs: ", outgoingFriendReqs?.outgoingReqs)
    console.log("outgoingFriendReqs.length: ", outgoingFriendReqs?.length)
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      console.log("Inside")

      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient.id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Ask me anything! (Not working - Currently under development)</h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>

        <div>
          <GptChatbox/>
        </div>

      </div>
    </div>
  );
};

export default GptHomePage;
