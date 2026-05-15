interface EnrolledCourseView {
    CourseID: number;
    CourseName: string;
    Image: string;
    Price: number;
    EnrollID: number;
    UserID:number;
}
declare var $:any;
class EnrolledCoursesManager {
    private userID: number;

    constructor() {
        this.userID = parseInt(localStorage.getItem("userID") || "0");
        this.init();
    }

    private init(): void {
        $(document).ready(() => {
            if (this.userID > 0) {
                console.log(this.userID);
                
                this.loadEnrolledCourses();
            } else {
                // sessionStorage.setItem("redirectURL", "./Enrolled.html"); 

                alert("Please login to view your courses.");
                window.location.href = "LoginPage.html";
            }
        });
    }

    public loadEnrolledCourses(): void {
        console.log("Loading coursess");
        
        $.ajax({
            url: "http://localhost:49251/api/Enrollment",
            type:"GET",
            success:(enroll:EnrolledCourseView[])=>{
                let enrollID=enroll.filter((p)=>p.UserID==this.userID)
                console.log(enrollID);
                enrollID.forEach(element => {
                     $.ajax({
            url: "http://localhost:49251/api/Invoice",
            type: "GET",
            success: (allInvoices: any[]) => {
                console.log(allInvoices);
                let invoiceList=allInvoices.filter((p)=>p.EnrollID==element.EnrollID)
                
                // Step 2: Get all Courses (to get names/images)
                $.ajax({
                    url: "http://localhost:49251/api/Courses",
                    type: "GET",
                    success: (allCourses: any[]) => {
                        this.renderEnrolledUI(invoiceList, allCourses);
                    }
                });
            },
            error: () => alert("Failed to load enrollment data.")
        });
                });
        // Step 1: Get all Invoices (purchased items)
       
    }
     
           })
    }

    private renderEnrolledUI(invoices: any[], courses: any[]): void {
        // Filter invoices to only show those belonging to THIS student
        // Note: Ensure your Invoice table/API includes 'UserID'
        const myInvoices = invoices.filter(inv => inv.UserID === this.userID);

        let html = "";

        if (myInvoices.length === 0) {
            html = "<div class='no-data'>You haven't enrolled in any courses yet.</div>";
        } else {
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
(window as any).goToCourse = (id: number) => {
    sessionStorage.setItem("CurrentCourseID", id.toString());
    window.location.href = "CoursePlayer.html"; 
}; 