import React, { useCallback } from 'react'

const SentMessageBubble = ({content}) => {

    return (
        <div class="chat chat-end">
            <div class="chat-header text-xs opacity-50 mb-1">
              You
            </div>
            <div class="chat-bubble chat-bubble-primary" dangerouslySetInnerHTML={{ __html: content?.content }} /> 
            <div class="chat-footer opacity-50 text-xs mt-1">
            </div>
          </div>
    )
}

export default SentMessageBubble