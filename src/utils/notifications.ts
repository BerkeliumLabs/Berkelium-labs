import { Notification, NotificationConstructorOptions } from 'electron';
import path from 'node:path';
export class BerkeliumNotifications {
  /**
   * Shows a notification with the given options
   * @param args The options to use when creating the notification
   *              (see https://electronjs.org/docs/api/notification#new-notificationoptions)
   */
  show(args: NotificationConstructorOptions): void {
    args.icon = path.join(__dirname, 'icon.png');
    const notify = new Notification(args);
    notify.show();
  }
}
