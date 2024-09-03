"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { createStore, persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";

export default function StoreProvider({ children }) {
  const storeRef = useRef();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = createStore;
  }

  return (
    <Provider store={storeRef.current}>
      <PersistGate persistor={persistor}>
        {children}
      </PersistGate>{" "}
    </Provider>
  );
}
