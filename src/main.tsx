import ReactDOM from "react-dom/client";
import App from "./views/App.tsx";
import "./index.scss";
import APIErrorProvider from "./providers/errorProvider";
import APIAlertProvider from "./providers/alertProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <APIErrorProvider>
    <APIAlertProvider>
      <App />
    </APIAlertProvider>
  </APIErrorProvider>,
);
