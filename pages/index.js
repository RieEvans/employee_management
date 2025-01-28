async function fetchEmployees() {
    try {
        const response = await fetch('https://employee-management-nine-lyart.vercel.app/employees');
        if (response) {
            const employees = await response.json();
            const employeeTableBody = document.querySelector('#employeeTable tbody');
            employeeTableBody.innerHTML = '';

            employees.forEach(e => {
                const birthDate = new Date(e.BirthDate)
                const formattedDate = birthDate.toLocaleDateString('en-US')
                const row = document.createElement('tr');
                const isActive = e.Active === true ? "Yes" : "No"
                row.innerHTML = `
                    <td>${e.EmployeeName}</td>
                    <td>${formattedDate}</td>
                    <td>${e.Department}</td>
                    <td>${isActive}</td>
                    <td>
                        <button class="editBtn" data-id="${e.Id}">Edit</button>
                        <button class="deleteBtn" data-id="${e.Id}">Delete</button>
                    </td>
                `;
                employeeTableBody.appendChild(row);
            });
            
            const editButtons = document.querySelectorAll('.editBtn');
            editButtons.forEach(button => {
                button.addEventListener('click', (e) => editEmployee(e));
            });

            const deleteButtons = document.querySelectorAll('.deleteBtn');
            deleteButtons.forEach(button => {
                button.addEventListener('click', (e) => deleteEmployee(e));
            });
        } else {
            document.getElementById('responseMessage').textContent =
                'Error fetching employees: ' + (await response.json()).message;
        }
    } catch (error) {
        document.getElementById('responseMessage').textContent =
            'Error connecting to the server: ' + error.message;
    }
}

async function getDepartments() {
    try {
        const response =  await fetch('http://localhost:4000/departments');
        if (response) {
            const departments = await response.json();
            const dropdown = document.getElementById('department')
            dropdown.innerHTML = '<option value="" disabled selected>Select Department</option>';

            departments.forEach(department => {
                const option = document.createElement('option');
                option.value = department.Id;
                option.textContent = department.NameDepartment;
                dropdown.appendChild(option);
            });
        } else {
            document.getElementById('responseMessage').textContent =
                'Error fetching employees: ' + (await response.json()).message;
        }
    } catch (error) {
        document.getElementById('responseMessage').textContent =
            'Error connecting to the server: ' + error.message;
    }
}

document.addEventListener('DOMContentLoaded', getDepartments);
window.onload = fetchEmployees;

document.getElementById('insertForm').addEventListener('submit', handleFormSubmit);
const showMessage = (message, isError = false) => {
    const responseMessage = document.getElementById('responseMessage')
    responseMessage.textContent = message
    responseMessage.style.color = isError ? "red" : "green"
}

const postData = async (url, data) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to send data');
        }

        return await response.json();
    } catch (error) {
        throw new Error(error.message || 'An error occurred');
    }
};

// Function to delete an employee
async function deleteEmployee(event) {
    const employeeId = event.target.getAttribute('data-id');
    try {
        const response = await fetch(`http://localhost:4000/delete/${employeeId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            await fetchEmployees();
        } else {
            const error = await response.json();
            alert('Error deleting employee: ' + error.message);
        }
    } catch (error) {
        alert('Error connecting to the server: ' + error.message);
    }
}

// Track the employee and row that being edited
let editingEmployeeId = null;
let editingRow = null;

function editEmployee(event) {
    const employeeId = event.target.getAttribute('data-id');
    const row = event.target.closest('tr');

    const employeeName = row.querySelector('td:first-child').textContent;
    const birthDate = row.querySelector('td:nth-child(2)').textContent;
    const departmentName = row.querySelector('td:nth-child(3)').textContent.trim();
    document.getElementById('name').value = employeeName;
    document.getElementById('dob').value = new Date(birthDate).toISOString().split('T')[0];

    const departmentDropdown = document.getElementById('department')
    const options = departmentDropdown.options;
    for (let i = 0; i < options.length; i++) {
        if (options[i].text.trim() === departmentName) {
            departmentDropdown.selectedIndex = i;
            break;
        }
    }
    editingEmployeeId = employeeId;
    editingRow = row;
}

// Form submission handler
async function handleFormSubmit(event) {
    event.preventDefault();
    const nameField = document.getElementById('name');
    const dobField = document.getElementById('dob');
    const checkField = document.getElementById('isChecked');
    const departmentId = document.getElementById('department')
    const name = nameField.value.trim();
    const dob = dobField.value;
    const active = checkField.checked
    const department = departmentId.value

    if (!name || !dob) {
        showMessage('Both Name and Date of Birth are required!', true);
        return;
    }

    try {
        const data = { EmployeeName: name, BirthDate: dob, Active: active, Department: department };
        if (editingEmployeeId) {
            await postData(`http://localhost:4000/update/${editingEmployeeId}`, data);
            editingRow.querySelector('td:first-child').textContent = name;
            showMessage(`Employee updated successfully!: ${name}`);
            editingEmployeeId = null;
            editingRow = null;

        } else {
            await postData('http://localhost:4000/save', data);
            showMessage(`Employee added successfully!: ${name}`);
        }
        nameField.value = ''
        dobField.value = ''
        await fetchEmployees(); // Refresh the employee list
    } catch (error) {
        showMessage(`Error: ${error.message}`, true);
    }
}
