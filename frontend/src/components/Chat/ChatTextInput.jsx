import React from 'react'

const ChatTextInput = () => {
  return (
    <div class="p-4 bg-base-200 border-t border-base-300 flex items-center gap-2 sticky bottom-0">
          <button class="btn btn-ghost btn-circle btn-sm">
            <svg xmlns="http://w3.org" class="h-6 w-6 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
          </button>

          <input type="text" placeholder="Type a message..." class="input input-bordered flex-1 focus:outline-none rounded-full" />

          <button class="btn btn-primary btn-circle btn-sm h-10 w-10">
            <svg xmlns="http://w3.org" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
  )
}

export default ChatTextInput