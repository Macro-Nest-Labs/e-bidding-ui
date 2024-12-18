import isEmpty from 'lodash/isEmpty';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);

export const getFormattedDate = (
  dateString: string,
  dateFormat = 'DD MMMM YYYY',
) => {
  if (isEmpty(dateString)) {
    return '';
  }

  return dayjs(dateString).format(dateFormat);
};

export const prefixWithZero = (theNumber: number) => {
  const formattedNumber = theNumber.toString();
  return formattedNumber.length === 1 ? `0${formattedNumber}` : formattedNumber;
};

export const getFormattedTime = (dateString: string) => {
  return dayjs(dateString).tz('Asia/Kolkata').format('DD-MM-YYYY hh:mm A');
};

export const calculateTimeLeft = (futureDateTime: string) => {
  let timeLeft = {};

  if (!futureDateTime) {
    return timeLeft;
  }

  const currentDate = dayjs().tz('Asia/Kolkata');
  const compareDate = dayjs(futureDateTime).tz('Asia/Kolkata');
  const difference = compareDate.diff(currentDate);

  if (difference <= 0) {
    return timeLeft;
  }

  timeLeft = {
    days: dayjs.duration(difference).days(),
    hours: dayjs.duration(difference).hours(),
    minutes: dayjs.duration(difference).minutes(),
  };

  return timeLeft;
};

export const isDateTimePassed = (dateTime: string) => {
  return (
    !dateTime ||
    dayjs().tz('Asia/Kolkata').isAfter(dayjs(dateTime).tz('Asia/Kolkata'))
  );
};

export const getFutureDateDiff = (dateTime: string) => {
  return dayjs(dateTime).tz('Asia/Kolkata').diff(dayjs().tz('Asia/Kolkata'));
};

export const getAuTime = (offset = +11) => {
  return dayjs().utc().add(offset, 'hour').format();
};

export const getAge = (dateString: string) => {
  const birthDate = dayjs(dateString).tz('Asia/Kolkata');
  const age = dayjs().tz('Asia/Kolkata').year() - birthDate.year();
  const monthDifference =
    dayjs().tz('Asia/Kolkata').month() - birthDate.month();

  return monthDifference < 0 ||
    (monthDifference === 0 &&
      dayjs().tz('Asia/Kolkata').date() < birthDate.date())
    ? age - 1
    : age;
};

export const calculateActiveLotEndTime = (
  startTime: string,
  duration: string,
): string => {
  const [hours, minutes] = duration.split(':').map(Number);
  return dayjs(startTime)
    .add(hours, 'hour')
    .add(minutes, 'minute')
    .toISOString();
};

export const getAuctionStartTimeWithStartDate = (
  startDate: string,
  startTime: string,
) => {
  const parsedStartDate = dayjs(startDate);
  const parsedStartTime = dayjs(startTime);

  return parsedStartDate
    .hour(parsedStartTime.hour())
    .minute(parsedStartTime.minute())
    .second(parsedStartTime.second());
};

export const getFormattedTimeInAMPM = (dateString: string) => {
  // Parse the given time string
  const timeObj = dayjs(dateString);

  // Convert to local time and format in AM/PM format
  // Adjust the format string as per your needs
  return timeObj.format('hh:mm A');
};
