import SockJS from "sockjs-client";
import Stomp from "stompjs";

let stompClient = null;

export const connectWebSocket = (onMessage) => {
    const socket = new SockJS("http://localhost:8083/ws-alerts");
    stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
        console.log("WebSocket Connected");

        stompClient.subscribe("/topic/fraud-alerts", (message) => {
            const data = JSON.parse(message.body);
            onMessage(data);
        });
    });
};

export const disconnectWebSocket = () => {
    if (stompClient) {
        stompClient.disconnect();
    }
};