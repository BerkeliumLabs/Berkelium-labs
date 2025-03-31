import { Notification, NotificationConstructorOptions } from 'electron';

export class BerkeliumNotifications {
    /**
     * Shows a notification with the given options
     * @param args The options to use when creating the notification
     *              (see https://electronjs.org/docs/api/notification#new-notificationoptions)
     */
    show(args: NotificationConstructorOptions): void {
        args.icon = 'src/icon.png';
        const notify = new Notification(args);
        notify.show();
    }
}