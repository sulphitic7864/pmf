import { useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_ENDPOINTS } from '../server/api_endpoints';

const TrackedVideoPlayer = ({ video, className, onViewCountChange, autoPlay = false }) => {
  const countedPlayback = useRef(false);

  const recordPlayback = async () => {
    if (countedPlayback.current) return;
    countedPlayback.current = true;

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Sign in to record film views.');

      const response = await axios.post(
        API_ENDPOINTS.RECORD_VIDEO_VIEW(video.id),
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      onViewCountChange(video.id, response.data.result.viewCount);
    } catch (error) {
      countedPlayback.current = false;
      console.error('Unable to record film view:', error);
      toast.error(error.response?.data?.message || error.message || 'Unable to record film view.');
    }
  };

  return (
    <video
      className={className}
      controls
      autoPlay={autoPlay}
      muted={autoPlay}
      playsInline
      aria-label={`Play ${video.title || 'film submission'}`}
      onPlay={recordPlayback}
      onEnded={() => { countedPlayback.current = false; }}
    >
      <source src={video.url} type='video/mp4' />
    </video>
  );
};

TrackedVideoPlayer.propTypes = {
  video: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    title: PropTypes.string,
    url: PropTypes.string.isRequired,
  }).isRequired,
  className: PropTypes.string,
  onViewCountChange: PropTypes.func.isRequired,
  autoPlay: PropTypes.bool,
};

export default TrackedVideoPlayer;
