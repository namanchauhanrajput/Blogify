import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from './store/auth';
import { ToastContainer, Zoom  } from 'react-toastify';


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <ToastContainer
position="top-center"
autoClose={3000}
limit={1}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="colored"
transition={Zoom}
      />
    </AuthProvider>
  </React.StrictMode>
);
