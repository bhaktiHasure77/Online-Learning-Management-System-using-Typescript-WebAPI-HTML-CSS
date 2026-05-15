// // Define the User interface
// interface UserSignUp {
//     Name: string;
//     Email: string;
//     Password: string;
//     RoleID: number; // 2 for Student, 3 for Instructor
// }

// const userApi: string = "http://localhost:49251/api/Users";

// // Define JQuery globally if not using @types/jquery
// declare var $: any;

// /**
//  * Gathers data from the form and returns a User object
//  */
// function Data(): UserSignUp | void {
//     const name = ($('#name').val() as string).trim();
//     const email = ($('#email').val() as string).trim();
//     const pass = ($('#pass').val() as string).trim();
//     const confirmPass = ($('#pass2').val() as string).trim();
    
//     // Get the selected radio button value
//     const selectedRole = $("input[name='role']:checked").val();
//     const roleId = selectedRole ? parseInt(selectedRole as string) : 2;
// console.log(roleId);
//     if (pass === confirmPass) {
//         return {
//             Name: name,
//             Email: email,
//             Password: pass,
//             RoleID: roleId
//         };
//     } else {
//         alert("Confirm Password isn't Matching with Password");
//         return;
//     }
// }

// /**
//  * Sends POST request to the API
//  */
// function AddUser(data: UserSignUp): void {
//     $.ajax({
//         url: userApi,
//         type: "POST",
//         contentType: "application/json",
//         data: JSON.stringify(data),
//         success: () => {
//             alert("Signed Up Successfully!! Welcome " + data.Name);
//             window.location.href = "LoginPage.html";
//         },
//         error: (err: any) => {
//             console.error(err);
//             alert("An error occurred while Signing in! Please try again");
//         }
//     });
// }

// /**
//  * Validates if user exists before adding
//  */
// function SignUp(): void {
//     const data = Data();
//     if (!data) return; // Stop if validation failed

//     $.ajax({
//         url: userApi,
//         type: "GET",
//         async: false,
//         success: (users: UserSignUp[]) => {
//             const exist = users.some(ele => ele.Email === data.Email);
//             if (exist) {
//                 alert("User Exists!! Please Login");
//             } else {
//                 AddUser(data);
//             }
//         },
//         error: (err: any) => {
//             console.log("Error During Login Check: ", err);
//             alert('An error occurred while checking credentials.');
//         }
//     });
// }


// Define the User interface
interface UserSignUp {
    UserName: string;
    Email: string;
    Pass: string;
    RoleID: number; 
}

const userApi: string = "http://localhost:49251/api/Users";

// Define JQuery globally
declare var $: any;

/**
 * Gathers data from the form and returns a User object
 */
function Data(): UserSignUp | void {
    const name = ($('#name').val() as string).trim();
    const email = ($('#email').val() as string).trim();
    const pass = ($('#pass').val() as string).trim();
    const confirmPass = ($('#pass2').val() as string).trim();
    
    // Captures the radio value: Student (3) or Instructor (2)
    const selectedRoleValue = $("input[name='role']:checked").val();
    const roleId = selectedRoleValue ? parseInt(selectedRoleValue as string) : 3;
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
    } else {
        alert("Confirm Password isn't Matching with Password");
        return;
    }
}

/**
 * Sends POST request to the API
 */
function AddUser(data: UserSignUp): void {
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
        error: (err: any) => {
            console.error("Post Error:", err);
            alert("An error occurred while creating your account.");
        }
    });
}

/**
 * Validates if user exists before adding
 */
function SignUp(): void {
    const data = Data();
    if (!data) return; 

    $.ajax({
        url: userApi,
        type: "GET",
        success: (users: UserSignUp[]) => {
            const exist = users.some(ele => ele.Email === data.Email);
            if (exist) {
                alert("User Exists!! Please Login");
            } else {
                AddUser(data);
            }
        },
        error: (err: any) => {
            console.error("Fetch Error: ", err);
            alert('An error occurred while checking existing users.');
        }
    });
}

// Ensure the function is accessible to the HTML button
(window as any).SignUp = SignUp;