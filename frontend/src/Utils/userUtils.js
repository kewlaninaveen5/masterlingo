export const formatLastSeen = (ls) => {
    console.log("lastSeen : ", ls)
    const lastSeen = +ls

    const diff = Date.now() - lastSeen;
    console.log("diff : ", diff/1000)

  
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
  
    if (diff < minute) {
      return "online";
    }
  
    if (diff < hour) {
      const minutes = Math.floor(diff / minute);
      return `${minutes} min ago`;
    }
  
    if (diff < day) {
      const hours = Math.floor(diff / hour);
      return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    }
  
    if (diff < 30 * day) {
      const days = Math.floor(diff / day);
      return `${days} day${days === 1 ? "" : "s"} ago`;
    }
  
    return "long time ago or Data Unavailable";
  }