const router = require('express').Router();
const friendRequestController = require('../controllers/friendRequest.controller');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const {
    sendFriendRequestSchema,
    friendRequestIdParamsSchema
} = require('../validations/friendRequest.validation');

router.get('/', authenticate, friendRequestController.getIncomingFriendRequests);
router.post('/', authenticate, validate(sendFriendRequestSchema), friendRequestController.sendFriendRequest);
router.patch(
    '/:id/accept',
    authenticate,
    validate(friendRequestIdParamsSchema, 'params'),
    friendRequestController.acceptFriendRequest
);
router.patch(
    '/:id/decline',
    authenticate,
    validate(friendRequestIdParamsSchema, 'params'),
    friendRequestController.declineFriendRequest
);

module.exports = router;
