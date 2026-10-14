import React, { useCallback } from 'react'

const SentMessageBubble = ({content}) => {

    return (
        <div class="chat chat-end">
            <div class="chat-header text-xs opacity-50 mb-1">
              You
            </div>
            <div class="chat-bubble chat-bubble-primary" dangerouslySetInnerHTML={{ __html: content?.content }} /> 
            <div class="chat-footer opacity-50 text-xs mt-1">
              12:47 PM ·   STILL BUILDING<span class="text-primary">Delivered  STILL BUILDING</span>
            </div>
          </div>
    )
}

export default SentMessageBubble