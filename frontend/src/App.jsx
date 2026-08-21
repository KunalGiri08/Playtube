import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Shorts from "./pages/Shorts/Shorts";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import CustomAlert from "./component/CustomAlert";
import getCurrentUser from "./customHooks/UsegetCurrentUser";
import UsegetChannel from "./customHooks/GetChannelData";
import ForgetPassword from "./Pages/ForgetPassword";
import MobileProfile from "./component/MobileProfile";
import CreateChannel from "./Pages/Channel/CreateChannel";
import ViewChannel from "./Pages/Channel/ViewChannel";
import UpdateChannel from "./Pages/Channel/UpdateChannel";
import CreateVideo from "./Pages/Videos/createVideo";
import CreatePost from "./Pages/Post/createPost";
import CreateShorts from "./Pages/Shorts/createShorts";
import CreatePlaylist from "./Pages/Playlist/createPlaylist";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import GetAllContentData from "./customHooks/UsegetAllContentData";
import WatchShortPage from "./Pages/Shorts/WatchShortPage";
export const serverUrl = "http://localhost:8000";

const ProtectedRoute = ({ userData, children }) => {
  if (!userData) {
    showCustomAlert("Please sign up first to use this feature!");
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  getCurrentUser();
  UsegetChannel();
  GetAllContentData();
  const { userData } = useSelector((state) => state.user);
  return (
    <>
      <CustomAlert />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route
            path="/shorts"
            element={
              <ProtectedRoute userData={userData}>
                <Shorts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/viewchannel"
            element={
              <ProtectedRoute userData={userData}>
                <ViewChannel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/updatechannel"
            element={
              <ProtectedRoute userData={userData}>
                <UpdateChannel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-video"
            element={
              <ProtectedRoute userData={userData}>
                <CreateVideo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-post"
            element={
              <ProtectedRoute userData={userData}>
                <CreatePost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-short"
            element={
              <ProtectedRoute userData={userData}>
                <CreateShorts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watch-short/:shortId"
            element={
              <ProtectedRoute userData={userData}>
                <WatchShortPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-playlist"
            element={
              <ProtectedRoute userData={userData}>
                <CreatePlaylist />
              </ProtectedRoute>
            }
          />
          <Route path="/mobilepro" element={<MobileProfile />} />
        </Route>

        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/createchannel" element={<CreateChannel />} />
      </Routes>
    </>
  );
}

export default App;
