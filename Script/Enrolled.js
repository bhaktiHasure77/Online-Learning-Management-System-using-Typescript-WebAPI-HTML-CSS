"use strict";
class EnrolledCoursesManager {
    userID;
    constructor() {
        this.userID = parseInt(localStorage.getItem("userID") || "0");
        this.init();
    }
    init() {
        $(document).ready(() => {
            if (this.userID > 0) {
                console.log(this.userID);
                this.loadEnrolledCourses();
            }
            else {
                // sessionStorage.setItem("redirectURL", "./Enrolled.html"); 
                alert("Please login to view your courses.");
                window.location.href = "LoginPage.html";
            }
        });
    }
    loadEnrolledCourses() {
        console.log("Loading coursess");
        $.ajax({
            url: "http://localhost:49251/api/Enrollment",
            type: "GET",
            success: (enroll) => {
                let enrollID = enroll.filter((p) => p.UserID == this.userID);
                console.log(enrollID);
                enrollID.forEach(element => {
                    $.ajax({
                        url: "http://localhost:49251/api/Invoice",
                        type: "GET",
                        success: (allInvoices) => {
                            console.log(allInvoices);
                            let invoiceList = allInvoices.filter((p) => p.EnrollID == element.EnrollID);
                            // Step 2: Get all Courses (to get names/images)
                            $.ajax({
                                url: "http://localhost:49251/api/Courses",
                                type: "GET",
                                success: (allCourses) => {
                                    this.renderEnrolledUI(invoiceList, allCourses);
                                }
                            });
                        },
                        error: () => alert("Failed to load enrollment data.")
                    });
                });
                // Step 1: Get all Invoices (purchased items)
            }
        });
    }
    renderEnrolledUI(invoices, courses) {
        // Filter invoices to only show those belonging to THIS student
        // Note: Ensure your Invoice table/API includes 'UserID'
        const myInvoices = invoices.filter(inv => inv.UserID === this.userID);
        let html = "";
        if (myInvoices.length === 0) {
            html = "<div class='no-data'>You haven't enrolled in any courses yet.</div>";
        }
        else {
            myInvoices.forEach(inv => {
                // Find the matching course details
                const course = courses.find(c => c.CourseID === inv.CourseID);
                if (course) {
                    html += `
                    <div class="course-card">
                        <img src="../${course.Image}" alt="${course.CourseName}">
                        <div class="course-info">
                            <h3>${course.CourseName}</h3>
                            <p>Enrolled ID: ${inv.EnrollID}</p>
                            <button class="view-btn" onclick="goToCourse(${course.CourseID})">Go to Course</button>
                        </div>
                    </div>`;
                }
            });
        }
        $("#enrolled-courses-container").html(html);
    }
}
const enrolledMgr = new EnrolledCoursesManager();
// Helper for button click
window.goToCourse = (id) => {
    sessionStorage.setItem("CurrentCourseID", id.toString());
    window.location.href = "CoursePlayer.html";
};
