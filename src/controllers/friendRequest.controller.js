const FriendRequest = require('../models/friendRequest.model');
const User = require('../models/user.model');
const AppError = require('../utils/AppError');
const responseManager = require('../utils/responseManager');

const getFriendProfile = (user) => ({
    username: user.username,
    name: user.name,
    userImageUrl: user.userImageUrl || null
});

const getIncomingFriendRequests = async (req, res) => {
    const pendingRequests = await FriendRequest.find({
        recipient: req.user._id,
        status: 'pending'
    })
        .sort({ createdAt: -1 })
        .populate('sender', 'name username userImageUrl')
        .lean();

    const requests = pendingRequests.map((request) => ({
        _id: request._id,
        sender: request.sender
            ? getFriendProfile(request.sender)
            : null,
        createdAt: request.createdAt
    }));

    return responseManager.success(
        res,
        200,
        'Friend requests fetched successfully',
        { requests }
    );
};

const sendFriendRequest = async (req, res) => {
    const recipient = await User.findOne({
        username: req.body.username,
        isActive: true
    }).select('_id username name userImageUrl myFriends');

    if (!recipient) {
        throw new AppError('User not found', 404);
    }

    if (recipient._id.toString() === req.user._id.toString()) {
        throw new AppError('You cannot send a friend request to yourself', 400);
    }

    const alreadyFriends =
        req.user.myFriends.some((friend) => friend.username === recipient.username) ||
        recipient.myFriends.some((friend) => friend.username === req.user.username);

    if (alreadyFriends) {
        throw new AppError('You are already friends with this user', 409);
    }

    const pairKey = [
        req.user._id.toString(),
        recipient._id.toString()
    ].sort().join(':');

    try {
        const friendRequest = await FriendRequest.create({
            sender: req.user._id,
            recipient: recipient._id,
            pairKey
        });

        return responseManager.success(
            res,
            201,
            'Friend request sent successfully',
            {
                friendRequest: {
                    _id: friendRequest._id,
                    recipient: recipient.username,
                    status: friendRequest.status,
                    createdAt: friendRequest.createdAt
                }
            }
        );
    } catch (error) {
        if (error.code === 11000) {
            throw new AppError('A friend request is already pending', 409);
        }

        throw error;
    }
};

const acceptFriendRequest = async (req, res) => {
    const friendRequest = await FriendRequest.findOne({
        _id: req.params.id,
        recipient: req.user._id,
        status: 'pending'
    }).populate('sender', 'name username userImageUrl isActive');

    if (!friendRequest || !friendRequest.sender) {
        throw new AppError('Pending friend request not found', 404);
    }

    const sender = friendRequest.sender;

    if (!sender.isActive) {
        throw new AppError('Friend request sender is inactive', 400);
    }

    const senderFriend = getFriendProfile(req.user);
    const recipientFriend = getFriendProfile(sender);

    const [senderUpdate, recipientUpdate] = await Promise.all([
        User.updateOne(
            { _id: sender._id },
            { $addToSet: { myFriends: senderFriend } }
        ),
        User.updateOne(
            { _id: req.user._id },
            { $addToSet: { myFriends: recipientFriend } }
        )
    ]);

    if (senderUpdate.matchedCount !== 1 || recipientUpdate.matchedCount !== 1) {
        throw new AppError('Unable to add both users as friends', 500);
    }

    const acceptedRequest = await FriendRequest.findOneAndUpdate(
        {
            _id: friendRequest._id,
            recipient: req.user._id,
            status: 'pending'
        },
        {
            $set: {
                status: 'accepted',
                acceptedAt: new Date()
            }
        },
        { new: true }
    );

    if (!acceptedRequest) {
        const currentRequest = await FriendRequest.findOne({
            _id: friendRequest._id,
            recipient: req.user._id
        });

        if (currentRequest?.status !== 'accepted') {
            throw new AppError('Pending friend request not found', 404);
        }
    }

    return responseManager.success(
        res,
        200,
        'Friend request accepted successfully',
        {
            friend: recipientFriend,
            friendRequest: {
                _id: friendRequest._id,
                status: 'accepted'
            }
        }
    );
};

module.exports = {
    getIncomingFriendRequests,
    sendFriendRequest,
    acceptFriendRequest
};
