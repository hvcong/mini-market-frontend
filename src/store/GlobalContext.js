import { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import connectSocketIo from "../socket";
import { useRef } from "react";
import { setRefreshBills } from "./slices/billSlice";
import { message } from "antd";

const GlobalContext = createContext();

function GlobalContextProvider({ children }) {
  let socket = useRef(null);
  const { isLogged, account, isAdmin } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket.current || !socket.current.connected) {
      socket.current = connectSocketIo();
    }
    socket.current.emit("join_room_employee");

    return () => {};
  }, [isLogged]);

  function addListenIO() {
    socket.current.on("have_new_order", () => {
      dispatch(setRefreshBills());
    });
  }

  function removeListenIO() {
    if (socket.current) {
      socket.current.removeAllListeners();
    }
  }
  useEffect(() => {
    if (socket.current && socket.current.connected && isLogged) {
      addListenIO();
    }

    return () => {
      removeListenIO();
    };
  }, [socket.current, isLogged]);

  async function emitUpdateOrder() {
    if (socket.current) {
      console.log("emit to server");
      socket.current.emit("have_new_order");
    }
  }

  const GlobalContextData = {
    socket: socket.current,
    emitUpdateOrder,
  };

  return (
    <GlobalContext.Provider value={GlobalContextData}>
      {children}
    </GlobalContext.Provider>
  );
}

export default GlobalContextProvider;
export function useGlobalContext() {
  return useContext(GlobalContext);
}
