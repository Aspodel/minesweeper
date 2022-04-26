export const formatTime = (time: any) => {
  var ms = time % 1000;
  time = (time - ms) / 1000;
  var secs = time % 60;
  time = (time - secs) / 60;
  var mins = time % 60;
  var hrs = (time - mins) / 60;

  if (hrs > 0) return "0:0";

  return `${mins}:${secs}`;
};
