import moment from "moment";

const Moment = ({ date }) => {
    if (!date) return null;

    const now = moment();
    const notificationDate = moment(date);
    const diffDays = now.diff(notificationDate, 'days');

    // For notifications from today, show relative time
    if (diffDays === 0) {
        return notificationDate.fromNow(); // e.g., "2 hours ago"
    }
    
    // For notifications from this week, show day and time
    if (diffDays < 7) {
        return notificationDate.format('ddd, h:mm A'); // e.g., "Mon, 2:30 PM"
    }
    
    // For older notifications, show full date
    return notificationDate.format('DD MMM, YYYY'); // e.g., "15 May, 2024"
};

export default Moment;
