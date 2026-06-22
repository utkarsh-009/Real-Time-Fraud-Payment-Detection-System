import SockJS from "sockjs-client";
import Stomp from "stompjs";

let stompClient = null;

export const connectWebSocket = (onMessage, onError) => {
    try {
        const socket = new SockJS("http://localhost:8083/ws-alerts");
        stompClient = Stomp.over(socket);
        
        // Disable debug logging
        stompClient.debug = () => {};

        stompClient.connect({}, () => {
            console.log("WebSocket Connected");

            stompClient.subscribe("/topic/fraud-alerts", (message) => {
                try {
                    const data = JSON.parse(message.body);
                    onMessage(data);
                } catch (err) {
                    console.error("Error parsing message:", err);
                    if (onError) onError(err);
                }
            });
        }, (error) => {
            console.error("WebSocket connection error:", error);
            if (onError) onError(error);
        });
    } catch (err) {
        console.error("Error initializing WebSocket:", err);
        if (onError) onError(err);
    }
};

export const disconnectWebSocket = () => {
    if (stompClient && stompClient.connected) {
        stompClient.disconnect(() => {
            console.log("WebSocket Disconnected");
            stompClient = null;
        });
    }
};