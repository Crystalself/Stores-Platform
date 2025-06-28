const router = require("express").Router();

const add = require("./add");
const all = require("./all");
const checkout = require("./checkout");
const details = require("./details");
const remove = require("./remove");
const removeItem = require("./remove-item");
const updateQuantity = require("./update-quantity");

router.put('/add', add);
router.get('/all', all);
router.post('/checkout', checkout);
router.post('/details', details);
router.delete('/remove', remove);
router.delete('/remove-item', removeItem);
router.put('/update-quantity', updateQuantity);

module.exports = router;