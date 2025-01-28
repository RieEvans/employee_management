const sql = require('mssql');

const getDepartments = async (conn) => {
    return await conn.request().query(`SELECT * FROM tblDepartments ORDER BY NameDepartment ASC`);
};

module.exports = {getDepartments}