import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import Shorts from "./Pages/Shorts/Shorts";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import CustomAlert, { showCustomAlert } from "./component/CustomAlert";
import getCurrentUser from "./customHooks/UsegetCurrentUser";
import UsegetChannel from "./customHooks/UsegetChannel";
import ForgetPassword from "./Pages/ForgetPassword";
import MobileProfile from "./component/MobileProfile";
import CreateChannel from "./Pages/Channel/CreateChannel";
import ViewChannel from "./Pages/Channel/ViewChannel";
import UpdateChannel from "./Pages/Channel/UpdateChannel";
import CreateVideo from "./Pages/Videos/createVideo";
import CreatePost from "./Pages/Post/createPost";
import CreateShorts from "./Pages/Shorts/createShorts";
import CreatePlaylist from "./Pages/Playlist/CreatePlaylist";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import GetAllContentData from "./customHooks/UsegetAllContentData";
import WatchShortPage from "./Pages/Shorts/WatchShortPage";
import ChannelPage from "./Pages/Channel/ChannelPage";
import LikedContentPage from "./Pages/LikedContentPage";
import SavedContentPage from "./Pages/SavedContentPage";
import SavedPlaylistPage from "./Pages/Playlist/SavedPlaylistPage";
import SubscribePage from "./Pages/SubscribePage";
import HistoryPage from "./Pages/HistoryPage";
import PTStudio from "./Pages/PTStudio";
import Dashboard from "./component/Dashboard";
import ContentPage from "./component/ContentPage";
import AnalyticsPage from "./component/AnalyticsPage";
import RevenuePage from "./component/RevenuePage";
import ManageVideo from "./Pages/Videos/ManageVideo";
import ManageShort from "./Pages/Shorts/ManageShort";
import ManagePlaylist from "./Pages/Playlist/ManagePlaylist";
import CreatePage from "./Pages/CreatePage";
import WatchVideoPage from "./Pages/Videos/WatchVideoPage";
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
  function ChannelPageWrapper() {
    const location = useLocation();
    return <ChannelPage key={location.pathname} />;
  }

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
            path="/createpage"
            element={
              <ProtectedRoute userData={userData}>
                <CreatePage />
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
          <Route
            path="/channelpage/:channelId"
            element={
              <ProtectedRoute userData={userData}>
                <ChannelPageWrapper />
              </ProtectedRoute>
            }
          />
          <Route
            path="/likedvideos"
            element={
              <ProtectedRoute userData={userData}>
                <LikedContentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/savevideos"
            element={
              <ProtectedRoute userData={userData}>
                <SavedContentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saveplaylist"
            element={
              <ProtectedRoute userData={userData}>
                <SavedPlaylistPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subscribepage"
            element={
              <ProtectedRoute userData={userData}>
                <SubscribePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute userData={userData}>
                <HistoryPage />
              </ProtectedRoute>
            }
          />

          <Route path="/mobilepro" element={<MobileProfile />} />
        </Route>
        {/* Routes outside Home */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/createchannel" element={<CreateChannel />} />
        <Route path='/watch-video/:videoId' element={<ProtectedRoute userData={userData}><WatchVideoPage /></ProtectedRoute>} />



        <Route path='/ptstudio' element={<ProtectedRoute userData={userData}><PTStudio /></ProtectedRoute>} >
          <Route path='/ptstudio/dashboard' element={<ProtectedRoute userData={userData}><Dashboard /></ProtectedRoute>} />
          <Route path='/ptstudio/content' element={<ProtectedRoute userData={userData}><ContentPage /></ProtectedRoute>} />
          <Route path='/ptstudio/analytics' element={<ProtectedRoute userData={userData}><AnalyticsPage /></ProtectedRoute>} />
          <Route path='/ptstudio/revenue' element={<ProtectedRoute userData={userData}><RevenuePage /></ProtectedRoute>} />
          <Route path='/ptstudio/managevideo/:videoId' element={<ProtectedRoute userData={userData}><ManageVideo /></ProtectedRoute>} />
          <Route path='/ptstudio/manageshort/:shortId' element={<ProtectedRoute userData={userData}><ManageShort /></ProtectedRoute>} />
          <Route path='/ptstudio/manageplaylist/:playlistId' element={<ProtectedRoute userData={userData}><ManagePlaylist /></ProtectedRoute>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
