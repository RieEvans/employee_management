const express = require('express')
const router = express.Router();

const {
    fetchEmployees,
    createEmployee,
    editEmployee,
    removeEmployee,
} = require('../controller/employee_controller');

router.get('/', fetchEmployees);
router.post('/save', createEmployee);
router.post('/update/:id', editEmployee);
router.delete('/delete/:id', removeEmployee);

module.exports = router;