const sql = require('mssql');

const fetchEmployees = async (req, res) => {
    const conn = res.locals.conn;
    try {
        const result = await conn.request().query(`
            SELECT e.Id, e.EmployeeName, e.BirthDate, ISNULL(e.Active, 0) AS [Active], 
                   ISNULL(d.NameDepartment, '') AS [Department]
            FROM tblEmployees e
            LEFT OUTER JOIN tblDepartments d ON e.DepartmentId = d.Id
            ORDER BY e.EmployeeName ASC`)
        return res.json(result.recordset)
    } catch (e) {
        res.json({error: e.message})
    }
};

const createEmployee = async (req, res) => {
    const conn = res.locals.conn;
    const { EmployeeName, BirthDate, Department, Active } = req.body;
    try {
        await conn.request()
            .input('EmployeeName', sql.VarChar(250), EmployeeName)
            .input('BirthDate', sql.Date, BirthDate)
            .input('Department', sql.Int, Department)
            .input('Active', sql.Bit, Active)
            .query(`
                INSERT INTO tblEmployees (EmployeeName, BirthDate, DepartmentId, Active)
                VALUES (@EmployeeName, @BirthDate, @Department, @Active)
            `);
        res.json({ message: 'Employee saved successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving employee', error: error.message });
    }
};

const editEmployee = async (req, res) => {
    const conn = res.locals.conn;
    const employeeId = req.params.id;
    const { EmployeeName, BirthDate, Department, Active} = req.body;

    try {
        const result = await conn.request()
            .input('employee_id', sql.Int, employeeId)
            .input('employee_name', sql.VarChar(250), EmployeeName)
            .input('birth_date', sql.Date, BirthDate)
            .input('department_id', sql.Int, Department)
            .input('active', sql.Bit, Active)
            .query(`
                UPDATE tblEmployees
                SET EmployeeName = @employee_name, BirthDate = @birth_date, DepartmentId = @department_id   , Active = @active
                WHERE Id = @employee_id
            `);

        if (result.rowsAffected[0] > 0) {
            res.status(200).json({ message: 'Employee Modified to ' });
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }

    } catch (e) {
        console.error('Error updating employee:', e.message);
        res.status(500).json({ message: 'Error updating employee', e: e.message });
    }
};

const removeEmployee = async (req, res) => {
    const conn = res.locals.conn;
    const employeeId = req.params.id;
    try {
        await conn.request()
        .input("employee_id", sql.Int, employeeId)
        .query(`DELETE FROM tblEmployees WHERE Id = @employee_id`)
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting employee', error: error.message });
    }
};

module.exports = { fetchEmployees, createEmployee, editEmployee, removeEmployee };
