onmessage = function (e) {
  const { targetTime, serverTime } = e.data;
  let interval = setInterval(() => {
    const now = new Date();
    const adjustedNow = new Date(now.getTime() + (now - serverTime));
    const duration = new Date(targetTime) - adjustedNow;

    if (duration <= 0) {
      clearInterval(interval);
      postMessage('00:00:00:00');
      return;
    }

    const days = Math.floor(duration / (1000 * 60 * 60 * 24))
      .toString()
      .padStart(2, '0');
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
      .toString()
      .padStart(2, '0');
    const minutes = Math.floor((duration / 1000 / 60) % 60)
      .toString()
      .padStart(2, '0');
    const seconds = Math.floor((duration / 1000) % 60)
      .toString()
      .padStart(2, '0');

    const formattedTime = `${days}:${hours}:${minutes}:${seconds}`;
    postMessage(formattedTime);
  }, 1000);
};
