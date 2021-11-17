const express = require('express');
const router = express.Router();

const localRoomListController = require('../controllers/local-room-list');
const myRoomListController = require('../controllers/my-room-list');
const newRoomController = require('../controllers/new-room');
const roomEntryController = require('../controllers/room-entry');
const deleteRoomController = require('../controllers/delete-room');

router.get('/local-room-list',localRoomListController.get);
router.get('/my-room-list', myRoomListController.get);
router.get('/new-room', newRoomController.post);
router.post('/new-room', newRoomController.post);
router.post('/room-entry', roomEntryController.post);
router.delete('/delete-room', deleteRoomController.delete);

module.exports = router;