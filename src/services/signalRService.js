import * as signalR from "@microsoft/signalr";

const backendURL = 'http://146.190.89.3:9090';


class SignalRService {
    constructor() {
        this.connection = null; // Khởi tạo connection là null ban đầu
    }
    getConnection() {
        if (!this.connection) {
            this.connection = new signalR.HubConnectionBuilder()
                .withUrl(`${backendURL}/notificationHub`)
                .build();
            this.setupConnection();
        }
        return this.connection;
    }

    setupConnection() {
        this.connection.start().catch((error) => {
            console.error("SignalR connection failed:", error);
        });


    }
    addToGroup(userId) {
        this.connection.invoke('AddToGroup', userId)
            .then(() => {
                // console.log(`User ${userId} added to group.`);
            })
            .catch((error) => {
                console.error(`Failed to add user to group: ${error}`);
            });
    }
    removeFromGroup(userId) {
        this.connection.invoke('RemoveFromGroup', userId)
            .then(() => {
                console.log(`User ${userId} đã logout signalR.`);
            })
            .catch((error) => {
                console.error(`Failed to remove user from group: ${error}`);
            });
    }
}
const signalRService = new SignalRService();

export default signalRService;