"use strict";
// // Define the User interface
// interface UserSignUp {
//     Name: string;
//     Email: string;
//     Password: string;
//     RoleID: number; // 2 for Student, 3 for Instructor
// }
const userApi = "http://localhost:49251/api/Users";
/**
 * Gathers data from the form and returns a User object
 */
function Data() {
    const name = $('#name').val().trim();
    const email = $('#email').val().trim();
    const pass = $('#pass').val().trim();
    const confirmPass = $('#pass2').val().trim();
    // Captures the radio value: Student (3) or Instructor (2)
    const selectedRoleValue = $("input[name='role']:checked").val();
    const roleId = selectedRoleValue ? parseInt(selectedRoleValue) : 3;
    console.log(pass);
    // Basic validation check
    if (!name || !email || !pass) {
        alert("Please fill in all fields.");
        return;
    }
    if (pass === confirmPass) {
        return {
            UserName: name,
            Email: email,
            Pass: pass,
            RoleID: roleId
        };
    }
    else {
        alert("Confirm Password isn't Matching with Password");
        return;
    }
}
/**
 * Sends POST request to the API
 */
function AddUser(data) {
    $.ajax({
        url: userApi,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: () => {
            const roleName = data.RoleID === 3 ? "Student" : "Instructor";
            alert(`Signed Up Successfully as ${roleName}!! Welcome ` + data.UserName);
            window.location.href = "../HTML/LoginPage.html";
        },
        error: (err) => {
            console.error("Post Error:", err);
            alert("An error occurred while creating your account.");
        }
    });
}
/**
 * Validates if user exists before adding
 */
function SignUp() {
    const data = Data();
    if (!data)
        return;
    $.ajax({
        url: userApi,
        type: "GET",
        success: (users) => {
            const exist = users.some(ele => ele.Email === data.Email);
            if (exist) {
                alert("User Exists!! Please Login");
            }
            else {
                AddUser(data);
            }
        },
        error: (err) => {
            console.error("Fetch Error: ", err);
            alert('An error occurred while checking existing users.');
        }
    });
}
// Ensure the function is accessible to the HTML button
window.SignUp = SignUp;
