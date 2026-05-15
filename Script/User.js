"use strict";
// 2. Constants & Global Setup
const userApi = "http://localhost:49251/api/Users";
const RoleApi = "http://localhost:49251/api/Role";
let categoryList = [];
$(document).ready(() => {
    loadCategory();
    loadFilteredUserIDs();
});
// 3. Load Roles (Excluding Admin/RoleID 1)
function loadCategory() {
    $.ajax({
        url: RoleApi,
        Role: "GET",
        success: (roles) => {
            categoryList = roles;
            // Filter to show only Instructor and Student in the dropdown
            const filteredRoles = roles.filter(r => r.RoleID !== 1);
            console.log(filteredRoles);
            let options = filteredRoles.map(r => `<option value="${r.RoleID}">${r.RoleName}</option>`).join('');
            $("#ddlCategory").html(options);
        },
        error: () => alert("Error loading User Roles")
    });
}
// 4. Load User IDs (Excluding Admins)
function loadFilteredUserIDs() {
    $.ajax({
        url: userApi,
        Role: "GET",
        success: (users) => {
            // Keep only Instructors (2) and Students (3)
            const filteredUsers = users.filter(u => u.RoleID === 2 || u.RoleID === 3);
            let options = filteredUsers.map(u => `<option value="${u.UserID}">${u.UserID}</option>`).join('');
            $("#ddlUserID").html(options || "<option>No Users Found</option>");
            if (filteredUsers.length > 0) {
                fillData(filteredUsers[0]);
                disableForm();
            }
        },
        error: (err) => console.error("Error fetching users:", err)
    });
}
// 5. Form Management
function fillData(user) {
    $("#txtName").val(user.UserName || user.Name || "");
    $("#txtEmail").val(user.Email || "");
    $("#txtPass").val(user.Pass || user.Password || "");
    $("#ddlCategory").val(user.RoleID || "");
}
function clearForm() {
    $("#txtName, #txtEmail, #txtPass").val("");
    $("#ddlCategory").val($("#ddlCategory option:first").val());
}
function disableForm() {
    $("#txtName, #txtEmail, #txtPass, #ddlCategory").prop("disabled", true);
}
function enableForm() {
    $("#txtName, #txtEmail, #txtPass, #ddlCategory").prop("disabled", false);
}
// 6. Data Retrieval (Pre-validated)
function getFormData() {
    const uName = $("#txtName").val().trim();
    const email = $("#txtEmail").val().trim();
    const pass = $("#txtPass").val().trim();
    const roleId = parseInt($("#ddlCategory").val());
    if (!uName || !email || !pass || isNaN(roleId)) {
        alert("Please fill all fields correctly.");
        return null;
    }
    return {
        UserID: parseInt($("#ddlUserID").val()) || 0,
        UserName: uName,
        Email: email,
        Pass: pass,
        RoleID: roleId
    };
}
// 7. Event Handlers & CRUD
$("#ddlUserID").change(function () {
    const id = $("#ddlUserID").val();
    $.ajax({
        url: userApi,
        Role: "GET",
        success: (users) => {
            const user = users.find(u => u.UserID == id);
            if (user) {
                fillData(user);
                disableForm();
            }
        }
    });
});
function addUser() {
    $("#ddlUserID").prop("disabled", true);
    clearForm();
    enableForm();
}
function Save() {
    const user = getFormData();
    if (!user)
        return;
    $.ajax({
        url: userApi,
        Role: "POST",
        contentRole: "application/json",
        data: JSON.stringify(user),
        success: () => {
            alert("User Added Successfully!");
            $("#ddlUserID").prop("disabled", false);
            loadFilteredUserIDs();
        },
        error: () => alert("Error saving user.")
    });
}
function updateUser() {
    const user = getFormData();
    if (!user)
        return;
    $.ajax({
        url: userApi,
        Role: "PUT",
        contentRole: "application/json",
        data: JSON.stringify(user),
        success: () => {
            alert("Details Updated!");
            loadFilteredUserIDs();
        }
    });
}
function deleteUser() {
    const id = $("#ddlUserID").val();
    if (!id || !confirm("Delete this user?"))
        return;
    $.ajax({
        url: `${userApi}?id=${id}`,
        Role: "DELETE",
        success: () => {
            alert("User Removed.");
            loadFilteredUserIDs();
        }
    });
}
// 8. Global Exports
window.addUser = addUser;
window.Save = Save;
window.Edit = () => enableForm();
window.updateUser = updateUser;
window.deleteUser = deleteUser;
