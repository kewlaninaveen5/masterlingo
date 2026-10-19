import React from 'react'

const ChatHeader = ({chatPartner}) => {
  return (
    <div class="sticky top-0 z-20 navbar bg-base-200 border-b border-base-300 px-4 flex justify-between items-center sticky top-0 z-10">
          <div class="flex items-center gap-3">
            <div class="avatar online">
              <div class="w-10 rounded-full">
                <img src={chatPartner.profilePic}alt="User Avatar" />
              </div>
            </div>
            <div>
              <h2 class="font-bold text-sm">{chatPartner.fullName}</h2>
              <p class="text-xs text-success">Still Building</p>
            </div>
          </div>

          <div class="flex gap-1">
            <button class="btn btn-ghost btn-circle btn-sm">
              <svg xmlns="http://w3.org" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            </button>
            <button class="btn btn-ghost btn-circle btn-sm">
              <svg xmlns="http://w3.org" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l5.48 2.2a1 1 0 01.556.975V17.2c0 .447-.354.814-.8.814h-1.5c-4.418 0-8-3.582-8-8v-3z" /></svg>
            </button>
          </div>
        </div>
  )
}

export default ChatHeader