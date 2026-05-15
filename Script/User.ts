// 1. Define Interfaces
interface UserRole {
    RoleID: number;
    RoleName: string;
}

interface UserProfile {
    UserID: number;
    UserName: string; // Matches C# ud.UserName
    Email: string;
    Pass: string;     // Matches C# ud.Pass
    RoleID: number;   // Matches C# ud.RoleID
    // Optional compatibility fields
    Name?: string;
    Password?: string;
}

// 2. Constants & Global Setup
const userApi: string = "http://localhost:49251/api/Users";
const RoleApi: string = "http://localhost:49251/api/Role";

declare var $: any;
let categoryList: UserRole[] = [];

$(document).ready(() => {
    loadCategory();
    loadFilteredUserIDs();
});

// 3. Load Roles (Excluding Admin/RoleID 1)
function loadCategory(): void {
    $.ajax({
        url: RoleApi,
        Role: "GET",
        success: (roles: UserRole[]) => {
            categoryList = roles;
            // Filter to show only Instructor and Student in the dropdown
            const filteredRoles = roles.filter(r => r.RoleID !== 1);
            console.log(filteredRoles);
            
            let options = filteredRoles.map(r => 
                `<option value="${r.RoleID}">${r.RoleName}</option>`
           
            ).join('');
            
            $("#ddlCategory").html(options);
        },
        error: () => alert("Error loading User Roles")
    });
}

// 4. Load User IDs (Excluding Admins)
function loadFilteredUserIDs(): void {
    $.ajax({
        url: userApi,
        Role: "GET",
        success: (users: UserProfile[]) => {
            // Keep only Instructors (2) and Students (3)
            const filteredUsers = users.filter(u => u.RoleID === 2 || u.RoleID === 3);

            let options = filteredUsers.map(u => 
                `<option value="${u.UserID}">${u.UserID}</option>`
            ).join('');

            $("#ddlUserID").html(options || "<option>No Users Found</option>");

            if (filteredUsers.length > 0) {
                fillData(filteredUsers[0]);
                disableForm();
            }
        },
        error: (err: any) => console.error("Error fetching users:", err)
    });
}

// 5. Form Management
function fillData(user: UserProfile): void {
    $("#txtName").val(user.UserName || user.Name || "");
    $("#txtEmail").val(user.Email || "");
    $("#txtPass").val(user.Pass || user.Password || "");
    $("#ddlCategory").val(user.RoleID || "");
}

function clearForm(): void {
    $("#txtName, #txtEmail, #txtPass").val("");
    $("#ddlCategory").val($("#ddlCategory option:first").val());
}

function disableForm(): void {
    $("#txtName, #txtEmail, #txtPass, #ddlCategory").prop("disabled", true);
}

function enableForm(): void {
    $("#txtName, #txtEmail, #txtPass, #ddlCategory").prop("disabled", false);
}

// 6. Data Retrieval (Pre-validated)
function getFormData(): UserProfile | null {
    const uName = ($("#txtName").val() as string).trim();
    const email = ($("#txtEmail").val() as string).trim();
    const pass = ($("#txtPass").val() as string).trim();
    const roleId = parseInt($("#ddlCategory").val() as string);

    if (!uName || !email || !pass || isNaN(roleId)) {
        alert("Please fill all fields correctly.");
        return null;
    }

    return {
        UserID: parseInt($("#ddlUserID").val() as string) || 0,
        UserName: uName,
        Email: email,
        Pass: pass,
        RoleID: roleId
    };
}

// 7. Event Handlers & CRUD
$("#ddlUserID").change(function() {
    const id = $("#ddlUserID").val();
    $.ajax({
        url: userApi,
        Role: "GET",
        success: (users: UserProfile[]) => {
            const user = users.find(u => u.UserID == id);
            if (user) {
                fillData(user);
                disableForm();
            }
        }
    });
});

function addUser(): void {
    $("#ddlUserID").prop("disabled", true);
    clearForm();
    enableForm();
}

function Save(): void {
    const user = getFormData();
    if (!user) return;

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

function updateUser(): void {
    const user = getFormData();
    if (!user) return;

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

function deleteUser(): void {
    const id = $("#ddlUserID").val();
    if (!id || !confirm("Delete this user?")) return;

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
(window as any).addUser = addUser;
(window as any).Save = Save;
(window as any).Edit = () => enableForm();
(window as any).updateUser = updateUser;
(window as any).deleteUser = deleteUser;