const express = require('express')
const router = express.Router()

const {fetchDepartments, saveDepartments} = require('../controller/department_controller')

router.get('/', fetchDepartments);
router.get('/save', saveDepartments)

module.exports = router

