
const departmentTable = document.getElementById('departmentTable').querySelector('tbody');
const responseMessage = document.getElementById('responseMessage')
const editModal = document.getElementById('editModal');
const editDepartmentForm = document.getElementById('editDepartmentForm');
const editDepartmentName = document.getElementById('editDepartmentName');
const editIsChecked = document.getElementById('editIsChecked');
const editDepartmentId = document.getElementById('editDepartmentId');
const closeModal = document.getElementById('closeModal');

const showEditModal = (department) => {
    editDepartmentId.value = department.id;
    editDepartmentName.value = department.name;

    if (department.active === 'Yes') {
        editIsChecked.checked = true
    } else {
        editIsChecked.checked = false
    }
    editModal.style.display = 'block';
};

const hideEditModal = () => {
    editModal.style.display = 'none';
};

const data_by_id = async () => {
    try {
        const res = await fetch('http://localhost:4000/departments');

        if (res.ok) {
            const departments = await res.json();
            departmentTable.innerHTML = ''; // Clear the table before populating

            departments.forEach(d => {
                const row = document.createElement('tr');
                const isActive = d.Active === true ? "Yes" : "No"
                row.innerHTML = `
                    <td>${d.Id}</td>
                    <td>${d.NameDepartment}</td>
                    <td>${isActive}</td>
                    <td>
                        <button class="editBtn" data-id="${d.Id}" data-name="${d.NameDepartment}" data-active="${isActive}">Edit</button>
                        <button class="deleteBtn" data-id="${d.Id}">Delete</button>
                    </td>
                `;
                departmentTable.appendChild(row);
            });

            const deleteButtons = document.querySelectorAll('.deleteBtn');
            deleteButtons.forEach(button => {
                button.addEventListener('click', (e) => deleteDepartment(e));
            });

            const editButtons = document.querySelectorAll('.editBtn');
            editButtons.forEach(button => {
                button.addEventListener('click', async (e) => {
                    const {id, name, active} = e.target.dataset
                    showEditModal({id, name, active});
                });
            });

            closeModal.addEventListener('click', hideEditModal);
        }
    } catch (e) {
        responseMessage.textContent = `Error loading Departments: ${e.message}`;
    }
};


window.onload = data_by_id;

//Private
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


const showMessage = (message, isError = false) => {
    const responseMessage = document.getElementById('responseMessage')
    responseMessage.textContent = message
    responseMessage.style.color = isError ? "red" : "green"
}

const saveDepartment = async (event) => {
    event.preventDefault();
    const departmentField = document.getElementById('departmentName');
    const departmentName = departmentField.value;
    const checkBoxField = document.getElementById('isChecked')
    const active = checkBoxField.checked

    try{
        const data = {Department: departmentName, Active: active}
        await postData('http://localhost:4000/save_department', data);
        showMessage(`Employee added successfully!`);
        await data_by_id();
        departmentField.value = ''
    }catch(e){
        console.log('Test Error', e.message)
    }
}
document.getElementById('insertDepartmentForm').addEventListener('submit', saveDepartment)

const deleteDepartment = async (event) => {
    const departmentId = event.target.getAttribute('data-id');
    try {
        const response = await fetch(`http://localhost:4000/delete_department/${departmentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            await data_by_id();
        } else {
            const error = await response.json();
            alert('Error deleting employee: ' + error.message);
        }
    } catch (error) {
        alert('Error connecting to the server: ' + error.message);
    }
}


