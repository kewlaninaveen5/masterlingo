import { LANGUAGE_TO_FLAG } from "../constants";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createVideoCall } from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";
import { formatLastSeen } from "../Utils/userUtils";

const FriendCard = ({ friend }) => {
  const { authUser } = useAuthUser();
  // const { initiateCall } = useSocket();
  const {
    mutate: createVideoCallData,
    isPending,
    error,
  } = useMutation({
    mutationFn: createVideoCall,
    onSuccess: (data) => {
      console.log("video call created: ", data);
      initiateCall({
        callId: data.webURL,
        to: friend.id,
        from: authUser.id, // your current logged-in user
        type: "one_to_one",
      });
    },
    onError: (error) => console.log("failed because: ", error),
  });


  const initiateVideoCallHandler = async () => {
    toast(`Calling ${friend.fullName} `);
    

    createVideoCallData({
      callToUser: friend.id,
      type: "one_to_one",
    });
  };
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12">
            <img src={friend.profilePic} alt={friend.fullName} />
          </div>
          <div>

          <h3 className="font-semibold truncate">{friend.fullName}</h3>
          <span className="text-xs text-base-content/60">Last Seen : {formatLastSeen(friend.lastseen)} </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary text-xs">
            {getLanguageFlag(friend.nativeLanguage)}
            Native: {friend.nativeLanguage}
          </span>
          <span className="badge badge-outline text-xs">
            {getLanguageFlag(friend.learningLanguage)}
            Learning: {friend.learningLanguage}
          </span>
        </div>

        {/* <button
          onClick={initiateVideoCallHandler}
          className={`btn btn-outline w-full`}
        >
          Videocall
        </button> */}
      </div>
    </div>
  );
};
export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}
