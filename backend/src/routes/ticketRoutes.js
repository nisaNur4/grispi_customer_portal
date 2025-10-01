const express = require('express');
const router = express.Router();
const {
    getTickets,
    getTicketById,
    createTicket,
    addMessageToTicket,
} = require('../controllers/ticketControllers');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/multerMiddleware');

router.get('/', protect, getTickets); 
router.post('/', protect, upload.array('ekler'), createTicket);
router.get('/:id', protect, getTicketById);
router.post('/:id/message', protect, addMessageToTicket);

module.exports = router;