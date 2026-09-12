import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import Shorts from "./Pages/Shorts/Shorts";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import CustomAlert, { showCustomAlert } from "./component/CustomAlert";
import useGetCurrentUser from "./customHooks/UsegetCurrentUser";
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
import UsegetAllContent from "./customHooks/UsegetAllContentData";
import UsegetChannelContent from "./customHooks/UsegetChannelContent";
import UseGetSubscribedContent from "./customHooks/UseGetSubscribedContent";
import UseGetHistory from "./customHooks/UseGetHistory";
import UseGetRecommendation from "./customHooks/UseGetRecommendation";
import ScrollToTop from "./component/ScrollToTop";
import YoutubeSignin from "./Pages/SignIn";
import CreateAccount from "./Pages/SignUp";
import CreateChannelFlow from "./Pages/Channel/CreateChannel";
import SearchResults from "./Pages/SearchResults";
export const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000"

const ProtectedRoute = ({ userData, children }) => {
  if (!userData) {
    showCustomAlert("Please sign up first to use this feature!");
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  useGetCurrentUser()
  UsegetChannel()
  UsegetChannelContent()
  UsegetAllContent()
  UseGetSubscribedContent()
  UseGetHistory()
  UseGetRecommendation()

  const { userData } = useSelector(state => state.user)



  function ChannelPageWrapper() {
    const location = useLocation();
    return <ChannelPage key={location.pathname} />;
  }

  return (
    <>
      <CustomAlert />
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<Home />}>
          <Route path='/shorts' element={<ProtectedRoute userData={userData}><Shorts /></ProtectedRoute>} />
          <Route path='/viewchannel' element={<ProtectedRoute userData={userData}><ViewChannel /></ProtectedRoute>} />
          <Route path='/updatechannel' element={<ProtectedRoute userData={userData}><UpdateChannel /></ProtectedRoute>} />
          <Route path='/mobileprofile' element={<MobileProfile />} />
          <Route path='/createpage' element={<ProtectedRoute userData={userData}><CreatePage /></ProtectedRoute>} />
          <Route path='/create-video' element={<ProtectedRoute userData={userData}><CreateVideo /></ProtectedRoute>} />
          <Route path='/create-post' element={<ProtectedRoute userData={userData}><CreatePost /></ProtectedRoute>} />
          <Route path='/create-short' element={<ProtectedRoute userData={userData}><CreateShorts /></ProtectedRoute>} />
          <Route path='/create-playlist' element={<ProtectedRoute userData={userData}><CreatePlaylist /></ProtectedRoute>} />
          <Route path='/watch-short/:shortId' element={<ProtectedRoute userData={userData}><WatchShortPage /></ProtectedRoute>} />
          <Route path='/channelpage/:channelId' element={<ProtectedRoute userData={userData}><ChannelPageWrapper /></ProtectedRoute>} />
          <Route path='/subscribepage' element={<ProtectedRoute userData={userData}><SubscribePage /></ProtectedRoute>} />
          <Route path='/saveplaylist' element={<ProtectedRoute userData={userData}><SavedPlaylistPage /></ProtectedRoute>} />
          <Route path='/savevideos' element={<ProtectedRoute userData={userData}><SavedContentPage /></ProtectedRoute>} />
          <Route path='/likedvideos' element={<ProtectedRoute userData={userData}><LikedContentPage /></ProtectedRoute>} />
          <Route path='/history' element={<ProtectedRoute userData={userData}><HistoryPage /></ProtectedRoute>} />
          <Route path='/search' element={<SearchResults />} />

        </Route>

        {/* Routes outside Home */}
        <Route path='/signin' element={<YoutubeSignin />} />
        <Route path='/signup' element={<CreateAccount />} />
        <Route path='/forgetpassword' element={<ForgetPassword />} />
        <Route path='/createchannel' element={<ProtectedRoute userData={userData}><CreateChannelFlow /></ProtectedRoute>} />
        <Route path='/watch-video/:videoId' element={<ProtectedRoute userData={userData}><WatchVideoPage /></ProtectedRoute>} />





        <Route path='/ptstudio' element={<ProtectedRoute userData={userData}><PTStudio /></ProtectedRoute>} >
          <Route index element={<Navigate to="/ptstudio/dashboard" replace />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='content' element={<ContentPage />} />
          <Route path='analytics' element={<AnalyticsPage />} />
          <Route path='revenue' element={<RevenuePage />} />
          <Route path='managevideo/:videoId' element={<ManageVideo />} />
          <Route path='manageshort/:shortId' element={<ManageShort />} />
          <Route path='manageplaylist/:playlistId' element={<ManagePlaylist />} />
        </Route>

        {/* Direct /studio aliases */}
        <Route path='/studio' element={<Navigate to="/ptstudio/dashboard" replace />} />
        <Route path='/studio/dashboard' element={<Navigate to="/ptstudio/dashboard" replace />} />
        <Route path='/studio/content' element={<Navigate to="/ptstudio/content" replace />} />
        <Route path='/studio/analytics' element={<Navigate to="/ptstudio/analytics" replace />} />
        <Route path='/studio/revenue' element={<Navigate to="/ptstudio/revenue" replace />} />
        <Route path='/studio/managevideo/:videoId' element={<Navigate to="/ptstudio/managevideo/:videoId" replace />} />
        <Route path='/studio/manageshort/:shortId' element={<Navigate to="/ptstudio/manageshort/:shortId" replace />} />
        <Route path='/studio/manageplaylist/:playlistId' element={<Navigate to="/ptstudio/manageplaylist/:playlistId" replace />} />





      </Routes>
    </>
  )
}

export default App