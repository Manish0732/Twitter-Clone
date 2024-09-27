
import { Notification } from "../models/notification.model.js";

// get all notification for user
export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await Notification.find({ to: userId })
            .populate({
                path: 'from',
                select: 'username profileImg'
            });
        await Notification.updateMany({ to: userId }, { read: true });
        res.status(200).json(notifications);

    } catch (error) {
        console.log("Error in getNotifications controller ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// delete particular notification
export const deleteNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        await Notification.deleteMany({ to: userId });
        res.status(200).json({ message: "Notifications deleted successfully" });
    } catch (error) {
        console.log("Error in deleteNotifications controller ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}