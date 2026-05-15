// 1. Define the User interface based on your C# Model
interface UserLoginData {
    UserID: number;
    UserName: string;
    Email: string;
    Pass: string;
    RoleID: number;
    Name?: string; // Optional: in case some API responses use 'Name' instead of 'UserName'
}

// 2. Define the Cart Item interface
interface LocalCartItem {
    CourseID: number;
    quantity?: number;
    Qty?: number;
    Price?: number;
}

// Constant API URLs
const userApi: string = "http://localhost:49251/api/Users";
const cartApi: string = "http://localhost:49251/api/Cart";

// Define JQuery globally
declare var $: any;

/**
 * Handles the Login logic with Role-based redirection
 */
// function Login(): void {
//     const email = ($('#email').val() as string).trim();
//     const pass = ($('#pass').val() as string).trim();

//     if (!email || !pass) {
//         alert("Enter Email and Password!");
//         return;
//     }

//     $.ajax({
//         url: userApi,
//         type: "GET",
//         success: (users: UserLoginData[]) => {
//             // Find user using the property names from your C# Controller
//             const user = users.find(u => u.Email === email && u.Pass === pass);
            
//             if (!user) {
//                 alert("Invalid Credentials!! Try Again.");
//                 return;
//             }

//             // Store session data
//             sessionStorage.setItem("userEmail", email);
//             sessionStorage.setItem("userID", user.UserID.toString());
//             sessionStorage.setItem("userName", user.UserName || user.Name || "");
//             sessionStorage.setItem("userRole", user.RoleID.toString());

//             const displayName = user.UserName || user.Name || "User";
//             alert(`Login Successful!! Welcome ${displayName}`);

//             // ROLE-BASED REDIRECTION
//             if (user.RoleID === 1) {
//                 // Admin UI
//                 window.location.href = "./AdminHome.html";
//             } 
//             else if (user.RoleID === 2) {
//                 // Instructor UI
//                 window.location.href = "./InstructorDashboard.html";
//             } 
//             else if (user.RoleID === 3) {
//                 // Student UI logic with Cart Check
//                 const redirect = sessionStorage.getItem("redirectAfterLogin");
                
//                 if (redirect === "cart") {
//                     mergeCart(user.UserID, () => {
//                         sessionStorage.removeItem("redirectAfterLogin");
//                         window.location.href = "./payment.html";
//                     });
//                 } else {
//                     window.location.href = "./StudentHome.html";
//                 }
//             }
//         },
//         error: (err: any) => {
//             console.error("Login Error:", err);
//             alert("Error logging in. Please try again.");
//         }
//     });
// }
function Login(): void {
    const email = ($('#email').val() as string).trim();
    const pass = ($('#pass').val() as string).trim();

    if (!email || !pass) {
        alert("Enter Email and Password!");
        return;
    }

    $.ajax({
        url: userApi,
        type: "GET",
        success: (users: UserLoginData[]) => {
            const user = users.find(u => u.Email === email && u.Pass === pass);
            
            if (!user) {
                alert("Invalid Credentials!! Try Again.");
                return;
            }

            // --- KEY UPDATES FOR NAVBAR DYNAMICS ---
            // LayoutManager uses localStorage.getItem("type") to render the navbar
            localStorage.setItem("type", user.RoleID.toString()); 
            localStorage.setItem("userID", user.UserID.toString());
            
            // Storing other session details
            sessionStorage.setItem("userEmail", email);
            sessionStorage.setItem("userName", user.UserName || user.Name || "");
            // ---------------------------------------

            const displayName = user.UserName || user.Name || "User";
            alert(`Login Successful!! Welcome ${displayName}`);

            // UNIFIED REDIRECTION:
            // Every role now goes to StudentHome.html. 
            // The LayoutManager on that page will read the "type" we just set and show the correct navbar.
            
            // Exception: If a student was sent to login from the Cart, take them to payment.
            const redirect = sessionStorage.getItem("redirectURL");
            if (user.RoleID === 3 && redirect === "./Cart.html") { // Assuming 2 is Student
                mergeCart(user.UserID, () => {
                    sessionStorage.removeItem("redirectURL");
                    window.location.href = "./payment.html";
                });
            } else {
                window.location.href = "./StudentHome.html";
            }
        },
        error: (err: any) => {
            console.error("Login Error:", err);
            alert("Error logging in. Please try again.");
        }
    });
}

/**
 * Merges session-based guest cart into the database
 */
function mergeCart(userID: number, callback: () => void): void {
    const localCart: LocalCartItem[] = JSON.parse(sessionStorage.getItem("cart") || "[]");

    if (localCart.length === 0) {
        if (callback) callback();
        return;
    }

    let i = 0;

    const processNext = (): void => {
        if (i >= localCart.length) {
            // Cleanup cart after full merge
            sessionStorage.removeItem("cart");
            localStorage.removeItem("cart");
            
            if (callback) callback();
            return;
        }

        const item = localCart[i];

        $.ajax({
            url: cartApi,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                
                CourseID: item.CourseID,
                UserID: userID,
            }),
            success: () => {
                console.log("Merged item:", item.CourseID);
            },
            error: (err: any) => {
                console.error("Error merging item:", item, err);
            },
            complete: () => {
                i++;
                processNext(); // Sequence: wait for one to finish before next
            }
        });
    };

    processNext();
}

// Explicitly export to window so HTML buttons can find the functions
(window as any).Login = Login;