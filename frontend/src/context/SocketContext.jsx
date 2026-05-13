import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";
import { addNotification } from "../features/notifications/notificationSlice";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      // Connect to the backend
      const socketInstance = io(import.meta.env.VITE_API_BASE_URL || "https://medicare-healthcare-app.onrender.com", {
        query: {
          userId: user._id || user.id, // Fallback if user uses 'id' over '_id'
          userName: user.name || user.fullname || "there",
        },
      });

      setSocket(socketInstance);

      socketInstance.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      socketInstance.on("notification", (data) => {
        // Prevent welcome spam on page refresh
        if (data.type === "welcome") {
           const hasSeen = sessionStorage.getItem(`hasSeenWelcome_${user._id || user.id}`);
           if (hasSeen) return;
           sessionStorage.setItem(`hasSeenWelcome_${user._id || user.id}`, "true");
        }

        // Send Notification to Global Redux State (Bell Icon) instead of generic toaster popups
        dispatch(addNotification(data));
      });

      return () => {
        socketInstance.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  return useContext(SocketContext);
};
