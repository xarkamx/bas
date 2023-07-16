import * as admin from 'firebase-admin';
const serviceAccount = JSON.parse(process.env.FB_JSON!);
    const app = admin.initializeApp( {
      credential: admin.credential.cert(serviceAccount),
    });
export class NotificationService {
  private readonly app: any;
  constructor(){
    this.app = app;
  }

  async sendNotification(notification: Notification){
    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
        icon: notification.icon,
      },
      token: notification.token,
      topic: notification.topic,
    };
    const response = await this.app.messaging().send(message);
    return response;
  }
}

type Notification = {
  title: string;
  body: string;
  token: string;
  topic: string;
  icon: string;
}