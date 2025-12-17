"use client";

import { Provider } from "react-redux";
import store from "./store/store";
import { UserProvider } from "./Context/UserContext";

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <UserProvider>
        {children}
      </UserProvider>
    </Provider>
  );
}