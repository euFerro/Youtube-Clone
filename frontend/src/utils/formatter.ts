
export function getTimeDiffFromNow(date: Date): string {
    const date_now = new Date();

    const timeDiffSeconds = (date_now.getTime() - date.getTime()) / 1000;
    // less then a minute
    if (timeDiffSeconds < 60) {
      return `${timeDiffSeconds} seconds ago`;

    } else if (timeDiffSeconds >= 60 && timeDiffSeconds < 3600) { // les than 1 hour
      return `${Math.round(timeDiffSeconds/60)} minutes ago`;

    } else if (timeDiffSeconds >= 3600 && timeDiffSeconds < 24*3600) {
      return `${Math.round(timeDiffSeconds/3600)} hours ago`;

    } else if (timeDiffSeconds >= 24*3600 && timeDiffSeconds < 30*24*3600) {
      return `${Math.round(timeDiffSeconds/(24*3600))} days ago`;

    } else if (timeDiffSeconds >= 30*24*3600 && timeDiffSeconds < 12*30*24*3600) {
      return `${Math.round(timeDiffSeconds/(30*24*3600))} months ago`;

    } else {
      return `${Math.round(timeDiffSeconds/(12*30*24*3600))} years ago`;
    }
  }

export function getFormattedNumber(views: number): string {
  if (views < 0) {
    return '(!) invalid number - the number must be positive';
  }
  if (views < 1000) {
    return `${views}`;

  } else  if (views >= 1000 && views < 1000*1000) {
    return `${(views/(1000)).toFixed(1)}K`;
  
  } else if (views >= 1000*1000 && views < 1000*1000*1000) {
    return `${(views/(1000*1000)).toFixed(0)}M`;

  } else {
    return `${(views/(1000*1000*1000)).toFixed(0)}Bi`;
  }
}