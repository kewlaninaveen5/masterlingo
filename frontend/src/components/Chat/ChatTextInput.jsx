import React, { useState } from 'react'
import { formatTextToHtml } from '../../Utils/MessageUtils.js'
import { sendMessageAPI } from '../../lib/ChatApi.js'
import { useChatRoomContext } from '../../ReactContext/ChatroomContext/ChatRoomProvider.jsx'
import useSendMessage from '../../hooks/ChatHooks/useSendMessage.js'
import { useUser } from '../../ReactContext/UserContext/UserProvider.jsx'
import { useSocket } from '../../ReactContext/socket/SocketProvider.jsx'

const ChatTextInput = () => {
  const [chatTextInput, setChatTextInput] = useState('')

  const { isPending, error, sendMessageMutation } = useSendMessage();
  const user = useUser()
  const socket = useSocket()


  const {chatroom} = useChatRoomContext()

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    console.log(e.target)
    if (e?.target?.value?.trim() == '')
      return
    console.log(chatTextInput)
    const formattedToHTMLText = formatTextToHtml(chatTextInput)
    console.log(formattedToHTMLText)
    console.log(chatroom)

      // sendMessageMutation(
      //   {
      //     content : formattedToHTMLText,
      //     chatroomId : chatroom.id
      //   })

        socket.emit("message:send", {
          chatroomId : chatroom.id,
          content: formattedToHTMLText,
      });
        
        setChatTextInput('')

  }




  return (
    <div class = "sticky bottom-0 z-20" >
      <form class="inline-form w-full" onSubmit={(e) => onSubmitHandler(e)}>
        <div class="p-4 bg-base-200 border-t border-base-300 flex items-center gap-2 sticky bottom-0">

          <button class="btn btn-ghost btn-circle btn-sm" type="button">
            <svg xmlns="http://w3.org" class="h-6 w-6 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
          </button>

          <textarea
          id="chat-message"
          name="chatMessage" 
          placeholder="Type a message..." 
          onChange={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = `${Math.min(e.target.scrollHeight, 144)}px`;
            setChatTextInput(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.form.requestSubmit();
            }
          }}
          style={{
            scrollbarWidth: "none",
          }}
          class=" hide-scrollbar leading-tight textarea textarea-bordered flex-1 focus:outline-none rounded-2xl max-h-1/3 resize-none overflow-y-auto"
          // class="input input-bordered flex-1 focus:outline-none rounded-full" 
          value={chatTextInput} />

          <button class="btn btn-primary btn-circle btn-sm h-10 w-10" type='submit'>
            <svg xmlns="http://w3.org" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatTextInput