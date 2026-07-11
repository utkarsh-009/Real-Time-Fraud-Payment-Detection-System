import SockJS from "sockjs-client";
import Stomp from "stompjs";

let stompClient = null;
let subscription = null;
const recentMessages = new Map();
const DUPLICATE_WINDOW_MS = 750;

export const connectWebSocket = (onMessage, onError, onConnect) => {
    try {
        disconnectWebSocket();

        const socket = new SockJS("http://localhost:8081/ws-alerts");
        stompClient = Stomp.over(socket);
        
        // Disable debug logging
        stompClient.debug = () => {};

        stompClient.connect({}, () => {
            console.log("WebSocket Connected");
            if (onConnect) onConnect();

            subscription = stompClient.subscribe("/topic/fraud-alerts", (message) => {
                try {
                    const now = Date.now();
                    const lastSeenAt = recentMessages.get(message.body);
                    if (lastSeenAt && now - lastSeenAt < DUPLICATE_WINDOW_MS) {
                        return;
                    }

                    recentMessages.set(message.body, now);
                    for (const [body, seenAt] of recentMessages) {
                        if (now - seenAt > DUPLICATE_WINDOW_MS) {
                            recentMessages.delete(body);
                        }
                    }

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
    if (subscription) {
        subscription.unsubscribe();
        subscription = null;
    }

    if (stompClient) {
        if (stompClient.connected) {
            stompClient.disconnect(() => {
                console.log("WebSocket Disconnected");
            });
        } else if (stompClient.ws) {
            stompClient.ws.close();
        }

        stompClient = null;
    }
};
