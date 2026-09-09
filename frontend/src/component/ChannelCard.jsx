import { useNavigate } from "react-router-dom";

const ChannelCard = ({ id, name, avatar}) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center gap-4 p-4 rounded-lg border border-gray-800 hover:bg-gray-100 cursor-pointer"
      onClick={()=>navigate(`/channelpage/${id}`)}
    >
      {/* Avatar */}
      <img
        src={avatar}
        alt={name}
        className="w-16 h-16 rounded-full object-cover"
      />

      {/* Info */}
      <div>
        <h3 className="text-lg font-bold">{name}</h3>
      
      </div>
    </div>
  );
};

export default ChannelCard;