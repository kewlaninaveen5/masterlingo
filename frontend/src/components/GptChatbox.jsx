

export const GptChatbox = () => {

    return <div class="w-full max-w-3xl mx-auto p-4">
    {/* <!-- Input Container --> */}
    <div class="relative flex flex-col w-full bg-[#2f2f2f] rounded-3xl border border-[#424242] p-3 shadow-md focus-within:border-[#676767] transition-all">
      
      {/* <!-- Text Area Input --> */}
      <textarea 
        rows="1"
        placeholder="Message LingoGPT..." 
        class="w-full min-h-[44px] max-h-[200px] bg-transparent resize-none text-white placeholder-gray-400 text-base outline-none pr-12 pl-2 pt-2 scrollbar-thin overflow-y-auto"
      ></textarea>
  
      {/* <!-- Bottom Actions Toolbar --> */}
      <div class="flex items-center justify-between mt-2 px-1">
        {/* <!-- Left Controls (Attachment / Tools) --> */}
        <div class="flex items-center gap-2">

        </div>
  
        {/* <!-- Right Controls (Send Button) --> */}
        <div>
          <button type="submit" class="p-2 bg-white text-black hover:bg-gray-200 disabled:opacity-40 rounded-full transition shadow-sm" title="Send message">
            {/* <!-- Up Arrow SVG Icon --> */}
            <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
            </svg>
          </button>
        </div>
      </div>
  
    </div>
  </div>
  
}