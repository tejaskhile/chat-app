import io from 'socket.io-client';

let socket = null;

export const initializeSocket = (projectId) => {
    if (!projectId) {
        console.error('ProjectId is required for socket connection');
        return null;
    }
    
    if (!socket) {
        // Get the token from localStorage or wherever you store it
        const token = localStorage.getItem('token');
        
        socket = io('http://localhost:3000', {
            query: { projectId },
            auth: { token },
            withCredentials: true,
            transports: ['websocket', 'polling']
        });
        
        socket.on('connect', () => {
            console.log('Socket connected');
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error.message);
        });
    }
    return socket;
};

export const sendMessage = (event, data) => {
    if (socket) {
        socket.emit(event, data);
    }
};

export const receiveMessage = (event, callback) => {
    if (socket) {
        socket.on(event, callback);
    }
};