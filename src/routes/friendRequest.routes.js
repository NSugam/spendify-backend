const router = require('express').Router();
const friendRequestController = require('../controllers/friendRequest.controller');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const {
    sendFriendRequestSchema,
    acceptFriendRequestParamsSchema
} = require('../validations/friendRequest.validation');

router.get('/', authenticate, friendRequestController.getIncomingFriendRequests);
router.post('/', authenticate, validate(sendFriendRequestSchema), friendRequestController.sendFriendRequest);
router.patch(
    '/:id/accept',
    authenticate,
    validate(acceptFriendRequestParamsSchema, 'params'),
    friendRequestController.acceptFriendRequest
);

module.exports = router;
