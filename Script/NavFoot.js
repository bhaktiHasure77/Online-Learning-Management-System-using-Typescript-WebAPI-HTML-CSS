"use strict";
var UserRole;
(function (UserRole) {
    UserRole[UserRole["GUEST"] = 0] = "GUEST";
    UserRole[UserRole["ADMIN"] = 1] = "ADMIN";
    UserRole[UserRole["INSTRUCTOR"] = 2] = "INSTRUCTOR";
    UserRole[UserRole["STUDENT"] = 3] = "STUDENT";
})(UserRole || (UserRole = {}));
class LayoutManager {
    role;
    constructor() {
        // Retrieve role from localStorage ("type") and default to GUEST
        const savedRole = localStorage.getItem("type");
        this.role = savedRole ? parseInt(savedRole) : UserRole.GUEST;
    }
    /**
     * Generates the Navbar HTML based on the user's role
     */
    renderNavbar() {
        // 1. Start Navbar and Static Links (Home & Explore Courses)
        let navHTML = `
        <nav class="navdiv">
            <div class="logo">
               <h2>CORAL <br> ACADEMY</h2>
            </div>
            <ul type="none">
                <li><a href="../HTML/StudentHome.html">Home</a></li>
                <li>
                    <a href="#">Explore Courses <i class="fa-solid fa-angle-down"></i></a>
                    <div class="dropdown">
                        <table>
                            <tr><td><a href="../HTML/Development.html">Development</a></td></tr>
                            <tr><td><a href="../HTML/Business.html">Business</a></td></tr>
                            <tr><td><a href="../HTML/Marketing.html">Marketing</a></td></tr>
                        </table>
                    </div>
                </li>`;
        // 2. Conditional Role-Based Links
        if (this.role === UserRole.STUDENT || this.role === UserRole.GUEST) {
            navHTML += `<li><a href="./Enrolled.html">Enrolled Courses</a></li>
            <li><a href="./About.html">About Us</a></li>
            <li><a href="./Contact.html">Contact</a></li>
            </ul>`;
        }
        else if (this.role === UserRole.INSTRUCTOR) {
            navHTML += `<li><a href="./Course.html">Course Manager</a></li>
            
            <li></li>`;
        }
        else if (this.role === UserRole.ADMIN) {
            navHTML += `<li><a href="./User.html">User Manager</a></li>
            <li></li>`;
        }
        // // 4. Icons Section (Login/Logout & Cart logic)
        // navHTML += `<div class="icon">`;
        // Logout/Login Icon
        if (this.role !== UserRole.GUEST) {
            navHTML += `
            <div class="icon" title="Logout">
                <i class="fa-solid fa-right-from-bracket" style="cursor:pointer" onclick="logoutUser()"></i>
            </div>`;
        }
        else {
            navHTML += `
            <div class="icon" title="Login">
                <a href="../HTML/LoginPage.html"><i class="fa-solid fa-right-to-bracket"></i></a>
            </div>`;
        }
        // Cart Icon: ONLY for Students (Role 2) or Guests (Role 0)
        // Hidden for Admin (1) and Instructor (3)
        if (this.role === UserRole.STUDENT || this.role === UserRole.GUEST) {
            navHTML += `
            <div class="icon">
                <a href="../HTML/Cart.html"><i class="fa-solid fa-bag-shopping"></i></a>
            </div>`;
        }
        navHTML += `</nav>`;
        // Render to the DOM
        $(".navbar").html(navHTML);
    }
    renderFooter() {
        const footerHTML = `
        <footer>
            <div class="footer-container">
                <div class="flex-wrapper">
                    <div class="footer-wrapper">
                        <p class="para"><h3>CORAL ACADEMY</h3><br />Learn Anything, Anywhere...</p>
                       <div class="Icon" >
                         <br>
                         <a href="">
                           <i
                             class="fa-brands fa-x-twitter"
                             style="color: #000000"
                           ></i>
                         </a>
                         <a href="">
                           <i
                             class="fa-brands fa-instagram"
                             style="color: #000000"
                           ></i>
                         </a>
                         <a href="">
                           <i
                             class="fa-brands fa-facebook-f"
                             style="color: #000000"
                           ></i>
                         </a>
                         <a href="">
                           <i
                             class="fa-brands fa-google-plus-g"
                             style="color: #000000"
                           ></i>
                         </a>
                     </div>
                    </div>
                    <div class="footer-list">
                        <h3>Company</h3>
                        <ul type="none">
                            <li><a href="#" class="footer-link">FAQ's</a></li>
                            <li><a href="../HTML/About.html" class="footer-link">About Us</a></li>
                            <li><a href="./Contact.html" class="footer-link">Contact</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>`;
        $(".footer").html(footerHTML);
    }
}
// Execution
const layout = new LayoutManager();
$(document).ready(() => {
    layout.renderNavbar();
    layout.renderFooter();
});
// Global Logout Function
window.logoutUser = () => {
    localStorage.removeItem("type");
    localStorage.removeItem("type");
    localStorage.removeItem("userID"); // Assuming you store userID too
    window.location.href = "../HTML/StudentHome.html";
};
