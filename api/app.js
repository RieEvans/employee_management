const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const departmentRoutes = require('../routes/department_routes');
const {fetchEmployees, createEmployee, editEmployee, removeEmployee} = require('../controller/employee_controller')
const {saveDepartments, deleteDepartment} = require('../controller/department_controller')
const dbMiddleWare = require('./database');

app.use(cors({
    origin: 'https://employee-management-psi-three.vercel.app', // Allow your frontend's domain
}));

app.use(express.static(path.join(__dirname, '../pages')));
app.use(express.json());
app.use(dbMiddleWare);

// Register Routes
app.use('/employees', fetchEmployees);
app.use('/save', createEmployee);
app.use('/update/:id', editEmployee);
app.use('/delete/:id', removeEmployee);

// Department Routes
app.use('/departments', departmentRoutes);
app.use('/save_department', saveDepartments);
app.delete('/delete_department/:id', deleteDepartment);


// Start the Server
const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

module.exports = app;

/*******************************************************************************************8*/
// const express = require('express');
// const app = express()
// const sql = require('mssql')

// app.use(express.static(__dirname));
// app.use(express.json());
// const PORT = 4000;
// app.listen(PORT);

// //SQL Server Configuration
// const sqlConfig = {
//     user: 'sa',
//     password: 'masterkey_2233#',
//     database: 'Jeonsoft',
//     server: 'localhost',
//     port: 2019,
//     pool: {
//         max: 10,
//         min: 0,
//         idleTimeoutMillis: 30000,
//     },
//     options: {
//         encrypt: false, // For Windows SQL Server
//         trustServerCertificate: true,
//     },
// };

// const dbMiddleWare = async (req, res, next) => {
//     if (!res.locals.conn) {
//         try {
//             const pool = await sql.connect(sqlConfig);
//             res.locals.conn = pool;
//             console.log('Database connection established');
//         } catch (error) {
//             console.error('Database connection failed:', error.message);
//             return res.status(500).json({ message: 'Database connection failed' });
//         }
//     }
//     next()
// }

// // Use the middleware globally
// app.use(dbMiddleWare);

// //CRUD
// app.get('/employees', async (req, res) => {
//     const conn = res.locals.conn;
//     try {
//         const result = await conn.request().query(`
//             SELECT e.Id, e.EmployeeName, e.BirthDate, ISNULL(e.Active, 0) AS [Active], ISNULL(d.NameDepartment, '') AS [Department]
//             FROM tblEmployees e
//             LEFT OUTER JOIN tblDepartments d ON e.DepartmentId = d.Id
//         `)
//         res.json(result.recordset)
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching items', error: error.message });
//     }
// })

// app.get('/departments', async (req, res) => {
//     const conn = res.locals.conn;
//     try {
//         const result = await conn.request().query(`
//             SELECT *
//             FROM tblDepartments
//         `)
//         res.json(result.recordset)
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching items', error: error.message });
//     }
// })

// app.post('/save', async (req, res) => {
//     const conn = res.locals.conn
//     const { EmployeeName, BirthDate, Department, Active} = req.body;
//     console.log("department", Department)
//     try {
//         // Insert into tblEmployees
//         await conn.request()    
//             .input('EmployeeName', sql.VarChar(250), EmployeeName)
//             .input('BirthDate', sql.Date, BirthDate)
//             .input('Department', sql.Int, Department)
//             .input('Active', sql.Bit, Active)
//             .query(`
//                 INSERT INTO tblEmployees (EmployeeName, BirthDate, DepartmentId, Active)
//                 VALUES (@EmployeeName, @BirthDate, @Department, @Active)
//             `);
//         res.json({ message: 'Employee saved successfully!' });
//     } catch (error) {
//         console.error("Error:", error.stack);
//         res.status(500).json({ message: 'Error Saving Employee', error: error.message });
//     }
// });

// app.post('/update/:id', async (req, res) => {
//     const conn = res.locals.conn;
//     const employeeId = req.params.id;
//     const { EmployeeName, BirthDate, Department, Active} = req.body;

//     try {
//         const result = await conn.request()
//             .input('employee_id', sql.Int, employeeId)
//             .input('employee_name', sql.VarChar(250), EmployeeName)
//             .input('birth_date', sql.Date, BirthDate)
//             .input('department_id', sql.Int, Department)
//             .input('active', sql.Bit, Active)
//             .query(`
//                 UPDATE tblEmployees
//                 SET EmployeeName = @employee_name, BirthDate = @birth_date, DepartmentId = @department_id   , Active = @active
//                 WHERE Id = @employee_id
//             `);

//         if (result.rowsAffected[0] > 0) {
//             res.status(200).json({ message: 'Employee Modified to ' });
//         } else {
//             res.status(404).json({ message: 'Employee not found' });
//         }

//     } catch (e) {
//         console.error('Error updating employee:', e.message);
//         res.status(500).json({ message: 'Error updating employee', e: e.message });
//     }
// });

// app.delete('/delete/:id', async (req, res) => {
//     const conn = res.locals.conn;
//     const employeeId = req.params.id;
//     try {
//         await conn.request()
//         .input("employee_id", sql.Int, employeeId)
//         .query(`DELETE FROM tblEmployees WHERE Id = @employee_id`)
//         res.status(200).json({ message: 'Employee deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Error deleting employee', error: error.message });
//     }
// });
