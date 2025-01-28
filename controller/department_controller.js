const sql = require('mssql');
const {getDepartments} = require('../model/department_model')

const fetchDepartments = async (req, res) => {
    const conn = res.locals.conn;
    try {
        const result = await getDepartments(conn);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching departments', error: error.message });
    }
};

const saveDepartments = async (req, res) => {
    const conn = res.locals.conn;
    const { Department, Active } = req.body;
    try {
        await conn.request()
            .input('Department', sql.VarChar(250), Department)
            .input('Active', sql.Bit, Active)
            .query(`
                    INSERT INTO tblDepartments (NameDepartment, Active)
                    VALUES (@Department, @Active)
                `)
        res.json({ message: 'Employee saved successfully!' });
    }catch(e) {
        res.json('Error:' + {error: e.message})
    }
}

const deleteDepartment = async (req, res) => {
    const conn = res.locals.conn;
    const departmentId = req.params.id;
    console.log("departmentId", departmentId)
    try {
        await conn.request()
        .input("department_id", sql.Int, departmentId)
        .query(`DELETE FROM tblDepartments WHERE Id = @department_id`)
        res.status(200).json({ message: 'Department deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting employee', error: error.message });
    }
};

module.exports = {fetchDepartments, saveDepartments, deleteDepartment}