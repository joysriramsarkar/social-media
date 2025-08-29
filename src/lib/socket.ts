import { Server } from 'socket.io';

interface UserSocket {
  userId: string;
  socketId: string;
}

// Store connected users
const connectedUsers = new Map<string, string>(); // userId -> socketId

export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Handle user authentication
    socket.on('authenticate', (userId: string) => {
      if (userId) {
        connectedUsers.set(userId, socket.id);
        socket.userId = userId;
        console.log(`User ${userId} authenticated with socket ${socket.id}`);
      }
    });

    // Handle new post notifications
    socket.on('new_post', (data: { 
      authorId: string; 
      post: any; 
      followers: string[] 
    }) => {
      // Notify followers about new post
      data.followers.forEach((followerId: string) => {
        const followerSocketId = connectedUsers.get(followerId);
        if (followerSocketId && followerId !== data.authorId) {
          io.to(followerSocketId).emit('new_post', {
            post: data.post,
            message: `${data.post.author.name} একটি নতুন পোস্ট করেছেন`
          });
        }
      });
    });

    // Handle like notifications
    socket.on('post_liked', (data: { 
      postId: string; 
      likerId: string; 
      authorId: string; 
      like: any 
    }) => {
      const authorSocketId = connectedUsers.get(data.authorId);
      if (authorSocketId && data.authorId !== data.likerId) {
        io.to(authorSocketId).emit('notification', {
          type: 'LIKE',
          message: `${data.like.actor.name} আপনার পোস্টটি লাইক করেছেন`,
          data: data.like
        });
      }
    });

    // Handle comment notifications
    socket.on('post_commented', (data: { 
      postId: string; 
      commenterId: string; 
      authorId: string; 
      comment: any 
    }) => {
      const authorSocketId = connectedUsers.get(data.authorId);
      if (authorSocketId && data.authorId !== data.commenterId) {
        io.to(authorSocketId).emit('notification', {
          type: 'COMMENT',
          message: `${data.comment.actor.name} আপনার পোস্টে মন্তব্য করেছেন`,
          data: data.comment
        });
      }
    });

    // Handle follow notifications
    socket.on('user_followed', (data: { 
      followerId: string; 
      followingId: string; 
      follow: any 
    }) => {
      const followingSocketId = connectedUsers.get(data.followingId);
      if (followingSocketId) {
        io.to(followingSocketId).emit('notification', {
          type: 'FOLLOW',
          message: `${data.follow.actor.name} আপনাকে ফলো করেছেন`,
          data: data.follow
        });
      }
    });

    // Handle real-time post updates
    socket.on('post_updated', (data: { 
      postId: string; 
      update: any 
    }) => {
      // Broadcast post update to all connected users
      socket.broadcast.emit('post_updated', {
        postId: data.postId,
        update: data.update
      });
    });

    // Handle typing indicators for comments
    socket.on('typing', (data: { 
      postId: string; 
      userId: string; 
      username: string 
    }) => {
      socket.broadcast.emit('user_typing', {
        postId: data.postId,
        userId: data.userId,
        username: data.username
      });
    });

    socket.on('stop_typing', (data: { 
      postId: string; 
      userId: string 
    }) => {
      socket.broadcast.emit('user_stopped_typing', {
        postId: data.postId,
        userId: data.userId
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      
      // Remove user from connected users
      if (socket.userId) {
        connectedUsers.delete(socket.userId);
        console.log(`User ${socket.userId} disconnected`);
      }
    });

    // Send welcome message
    socket.emit('connected', {
      message: 'সোশ্যালমিডিয়া রিয়েল-টাইম সার্ভিসে সংযুক্ত হয়েছেন!',
      timestamp: new Date().toISOString(),
    });
  });
};