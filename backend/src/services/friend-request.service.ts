import { FriendRequest, IFriendRequest } from '../models/FriendRequest';

export class FriendRequestService {
  static async sendRequest(from: string, to: string) {
    if (from === to) return { success: false, error: 'Cannot friend yourself' };
    const existing = await FriendRequest.findOne({ from, to, status: 'pending' });
    if (existing) return { success: false, error: 'Request already sent' };
    const alreadyFriends = await FriendRequest.findOne({ from, to, status: 'accepted' });
    if (alreadyFriends) return { success: false, error: 'Already friends' };
    const req = new FriendRequest({ from, to, status: 'pending' });
    await req.save();
    return { success: true, data: req };
  }

  static async getRequests(userId: string) {
    const incoming = await FriendRequest.find({ to: userId, status: 'pending' });
    const outgoing = await FriendRequest.find({ from: userId, status: 'pending' });
    return { success: true, incoming, outgoing };
  }

  static async respondRequest(requestId: string, userId: string, accept: boolean) {
    const req = await FriendRequest.findById(requestId);
    if (!req) return { success: false, error: 'Request not found' };
    if (req.to !== userId) return { success: false, error: 'Not authorized' };
    req.status = accept ? 'accepted' : 'declined';
    await req.save();
    return { success: true, data: req };
  }

  static async listFriends(userId: string) {
    const accepted = await FriendRequest.find({ $or: [ { from: userId }, { to: userId } ], status: 'accepted' });
    const friendIds = accepted.map(r => r.from === userId ? r.to : r.from);
    return { success: true, friends: friendIds };
  }
}
