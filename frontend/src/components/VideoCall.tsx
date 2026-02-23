import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import Peer from 'simple-peer';
import './VideoCall.css';

interface VideoCallProps {
  currentUserId: string;
  recipientId: string;
  onClose: () => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ currentUserId, recipientId, onClose }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [peer, setPeer] = useState<Peer.Instance | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isIncoming, setIsIncoming] = useState(false);
  const [incomingSignal, setIncomingSignal] = useState<any>(null);
  const [callStatus, setCallStatus] = useState<string>('Initializing...');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const newSocket = io(socketUrl);
    setSocket(newSocket);
    newSocket.emit('join', currentUserId);

    newSocket.on('incoming-call', (data: { from: string; signal: any }) => {
      if (data.from === recipientId) {
        setIsIncoming(true);
        setIncomingSignal(data.signal);
        setCallStatus('Incoming call...');
      }
    });

    newSocket.on('call-accepted', (signal: any) => {
      if (peer) {
        peer.signal(signal);
        setIsCallActive(true);
        setCallStatus('Connected');
      }
    });

    newSocket.on('call-rejected', () => {
      setCallStatus('Call rejected');
      setTimeout(() => onClose(), 2000);
    });

    newSocket.on('call-ended', () => {
      endCall();
    });

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      newSocket.close();
    };
  }, [currentUserId, recipientId]);

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const newPeer = new Peer({
        initiator: true,
        trickle: false,
        stream: stream
      });

      newPeer.on('signal', (signal: any) => {
        if (socket) {
          socket.emit('call-user', {
            to: recipientId,
            from: currentUserId,
            signal
          });
          setCallStatus('Calling...');
        }
      });

      newPeer.on('stream', (remoteStream: any) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      });

      newPeer.on('error', (err: any) => {
        console.error('Peer error:', err);
        setCallStatus('Connection error');
      });

      setPeer(newPeer);
    } catch (error) {
      console.error('Error accessing media devices:', error);
      setCallStatus('Camera/Mic access denied');
    }
  };

  const acceptCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const newPeer = new Peer({
        initiator: false,
        trickle: false,
        stream: stream
      });

      newPeer.on('signal', (signal: any) => {
        if (socket) {
          socket.emit('accept-call', { to: recipientId, signal });
        }
      });

      newPeer.on('stream', (remoteStream: any) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      });

      newPeer.signal(incomingSignal);
      setPeer(newPeer);
      setIsCallActive(true);
      setIsIncoming(false);
      setCallStatus('Connected');
    } catch (error) {
      console.error('Error accepting call:', error);
      setCallStatus('Camera/Mic access denied');
    }
  };

  const rejectCall = () => {
    if (socket) {
      socket.emit('reject-call', { to: recipientId });
    }
    onClose();
  };

  const endCall = () => {
    if (socket) {
      socket.emit('end-call', { to: recipientId });
    }
    if (peer) {
      peer.destroy();
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    setCallStatus('Call ended');
    setTimeout(() => onClose(), 1000);
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  return (
    <div className="video-call-container">
      <div className="video-call-header">
        <h3>📹 Video Call with {recipientId}</h3>
        <span className="call-status">{callStatus}</span>
      </div>

      <div className="videos-grid">
        <div className="video-wrapper">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="remote-video"
          />
          {!isCallActive && (
            <div className="video-placeholder">
              <div className="placeholder-icon">👤</div>
              <p>{recipientId}</p>
            </div>
          )}
        </div>

        <div className="video-wrapper local">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="local-video"
          />
          {isVideoOff && (
            <div className="video-off-overlay">
              <span>📷 Camera Off</span>
            </div>
          )}
        </div>
      </div>

      <div className="call-controls">
        {!isCallActive && !isIncoming && (
          <button onClick={startCall} className="control-btn start-call">
            📞 Start Call
          </button>
        )}

        {isIncoming && (
          <>
            <button onClick={acceptCall} className="control-btn accept">
              ✅ Accept
            </button>
            <button onClick={rejectCall} className="control-btn reject">
              ❌ Reject
            </button>
          </>
        )}

        {isCallActive && (
          <>
            <button 
              onClick={toggleMute} 
              className={`control-btn ${isMuted ? 'active' : ''}`}
            >
              {isMuted ? '🔇' : '🎤'}
            </button>
            <button 
              onClick={toggleVideo} 
              className={`control-btn ${isVideoOff ? 'active' : ''}`}
            >
              {isVideoOff ? '📷' : '📹'}
            </button>
            <button onClick={endCall} className="control-btn end-call">
              ☎️ End Call
            </button>
          </>
        )}

        <button onClick={onClose} className="control-btn close">
          ✕ Close
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
