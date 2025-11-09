import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import IncomingCallToast from "./IncomingCallToast";
import toast from "react-hot-toast";

const GlobalIncomingCallListener = () => {
  const dispatch = useDispatch();
  const { incomingCall, status } = useSelector(
    (state) => state.socketFromStore.videocall
  );

  const toastIdRef = useRef(null);

  useEffect(() => {
    console.log("🚀 ~ GlobalIncomingCallListener ~ incomingCall:", incomingCall)
    if (incomingCall) {
      // Dismiss any previous toasts
      toast.dismiss();

      toastIdRef.current = toast.custom(
        (t) => (
          <IncomingCallToast
            from={incomingCall.from}
            type={incomingCall.type}
            onAccept={() => {
              console.log("✅ Call accepted");
              dispatch(clearIncomingCall());
              toast.dismiss(toastIdRef.current);
            }}
            onReject={() => {
              console.log("❌ Call rejected");
              dispatch(clearIncomingCall());
              toast.dismiss(toastIdRef.current);
            }}
          />
        ),
        { duration: Infinity }
      );
    }

    if (!incomingCall || status === "ended") {
      toast.dismiss(toastIdRef.current);
    }


    console.log(
      "🚀 ~ GlobalIncomingCallListener ~ incomingCall:",
      incomingCall
    );
  }, [incomingCall, status, dispatch]);

  return null;
};

export default GlobalIncomingCallListener;
