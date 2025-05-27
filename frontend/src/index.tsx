import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose, Store } from "redux";
import { thunk, ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import App from "./App";
import "./index.css";
import reducers from "./reducers";
import type { RootState } from "./reducers";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./themes/Default";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(thunk))
) as unknown as Store<RootState> & {
  dispatch: ThunkDispatch<RootState, undefined, AnyAction>;
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>
);