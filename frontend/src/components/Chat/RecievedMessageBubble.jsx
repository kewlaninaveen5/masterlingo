import React from 'react'

const RecievedMessageBubble = ({chatPartner, content}) => {
    return (
        <div class="chat chat-start">
            <div class="chat-image avatar">
                <div class="w-8 rounded-full">
                    <img src={chatPartner.profilePic} alt="User Avatar" />
                </div>
            </div>
            <div class="chat-header text-xs opacity-50 mb-1">
            {chatPartner.fullName}
            </div>
            <div class="chat-bubble chat-bubble-secondary" dangerouslySetInnerHTML={{ __html: content?.content }} /> 
            <div class="chat-footer opacity-50 text-xs mt-1">

            </div>
        </div>
    )
}

export default RecievedMessageBubble