// 1. Define Interfaces for type safety
interface Course {
    CourseID: number;
    CourseName: string;
    CategoryID: number;
    Image: string;
    Price: number;
    DSC: string;
    UserID: number;
}

interface Category {
    CategoryID: number;
    CategoryName: string;
}

// 2. API Endpoints
const courseApi: string = "http://localhost:49251/api/Courses";
const catApi: string = "http://localhost:49251/api/Category";

declare var $: any;

class CourseManager {
    private categoryList: Category[] = [];
    private UserID: number;

    constructor() {
        // Retrieve UserID from login session
        this.UserID = parseInt(localStorage.getItem("userID") || "0");
        console.log(this.UserID);
        
        this.init();
    }

    private init(): void {
        $(document).ready(() => {
            this.loadCategory();
            this.loadCourseID();

            // Image file change handler
            $("#txtImage").on("change", (e: any) => {
                const file = e.target.files[0];
                if (!file) return;
                const path = "img/" + file.name;
                $("#txtImage").attr("data-path", path);
                $("#imgCourse").attr("src", path); 
            });

            // Course dropdown change
            $("#ddlcourseID").on("change", () => {
                const id = $("#ddlcourseID").val();
                if (id) {
                    this.fetchCourseById(Number(id));
                }
            });
        });
    }

    // --- Data Loading using standard $.ajax ---

    private loadCategory(): void {
        $.ajax({
            url: catApi,
            type: "GET",
            success: (cats: Category[]) => {
                this.categoryList = cats;
                let options = cats.map(c => `<option value="${c.CategoryID}">${c.CategoryName}</option>`).join('');
                $("#ddlCategory").html('<option value="">Select Category</option>' + options);
            },
            error: () => alert("Error loading categories")
        });
    }

    public loadCourseID(): void {
        $.ajax({
            url: courseApi,
            type: "GET",
            success: (courses: Course[]) => {
                // Filter courses to only show those belonging to the logged-in User
                const myCourses = courses.filter(p => p.UserID === this.UserID);
                console.log(myCourses);
                
                let options = myCourses.map(p => `<option value="${p.CourseID}">${p.CourseID}</option>`).join('');
                $("#ddlcourseID").html('<option value="">Select ID</option>' + options);

                if (myCourses.length > 0) {
                    // Load the first available course into the form
                    $("#ddlcourseID").val(myCourses[0].CourseID);
                    console.log(myCourses[0].CourseID);
                    
                    this.fillData(myCourses[0]);
                    this.disableForm();
                } else {
                    this.clearForm();
                }
            },
            error: () => alert("Error loading Courses")
        });
    }

    private fetchCourseById(id: number): void {
        $.ajax({
            url: courseApi,
            type: "GET",
            success: (courses: Course[]) => {
                // Find the single specific course object from the list
                const course = courses.find(p => p.CourseID === id && p.UserID === this.UserID);
                if (course) {
                    this.fillData(course); 
                    this.disableForm();
                }
            },
            error: () => alert("Error fetching course details")
        });
    }

    // --- Form Logic ---

    private fillData(course: Course): void {
        // Update values in textboxes
        $("#txtName").val(course.CourseName);
        $("#ddlCategory").val(course.CategoryID);
        $("#txtPrice").val(course.Price);
        $("#courseDescription").val(course.DSC);
        
        // Handle Image Preview
        $("#txtImage").attr("data-path", "img/"+course.Image);
        $("#imgCourse").attr("src", "../"+course.Image);
    }

    private getData(): Course | null {
        const name = ($("#txtName").val() as string).trim();
        const category = parseInt($("#ddlCategory").val() as string);
        const price = parseFloat($("#txtPrice").val() as string);
        const img = $("#txtImage").attr("data-path");
        const desc = $("#courseDescription").val() as string;

        if (!name) { alert("Enter Course Name"); return null; }
        if (isNaN(category)) { alert("Select Category"); return null; }
        if (!img) { alert("Select Image"); return null; }
        if (isNaN(price)) { alert("Invalid Price"); return null; }

        return {
            CourseID: parseInt($("#ddlcourseID").val() as string) || 0,
            CourseName: name,
            CategoryID: category,
            Image: img,
            Price: price,
            DSC: desc,
            UserID: this.UserID
        };
    }

    public clearForm(): void {
        $("#ddlcourseID").val("");
        $("#txtName, #txtPrice, #courseDescription").val("");
        $("#ddlCategory").val("");
        $("#txtImage").val("").removeAttr("data-path");
        $("#imgCourse").attr("src", "");
    }

    public enableForm(): void {
        $("#txtName, #ddlCategory, #txtImage, #txtPrice, #courseDescription").prop("disabled", false);
    }

    public disableForm(): void {
        $("#txtName, #ddlCategory, #txtImage, #txtPrice, #courseDescription").prop("disabled", true);
    }

    // --- CRUD Operations ---

    public save(): void {
        const course = this.getData();
        if (!course) return;

        $.ajax({
            url: courseApi,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(course),
            success: () => {
                alert("Course Added!");
                this.loadCourseID();
            },
            error: () => alert("Error Saving Course")
        });
    }

    public update(): void {
        const course = this.getData();
        if (!course) return;

        $.ajax({
            url: courseApi,
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(course),
            success: () => {
                alert("Course Updated!");
                this.disableForm();
                this.loadCourseID();
            },
            error: () => alert("Error Updating Course")
        });
    }

    public delete(): void {
        const id = $("#ddlcourseID").val();
        if (!id) return alert("Select Course");

        if (!confirm("Are you sure?")) return;

        $.ajax({
            url: `${courseApi}?id=${id}`,
            type: "DELETE",
            success: () => {
                alert("Course Deleted!");
                this.clearForm();
                this.loadCourseID();
            },
            error: () => alert("Error deleting Course")
        });
    }
}

const manager = new CourseManager();

(window as any).addCourse = () => { manager.clearForm(); manager.enableForm(); };
(window as any).Edit = () => manager.enableForm();
(window as any).Save = () => manager.save();
(window as any).updateCourse = () => manager.update();
(window as any).deleteCourse = () => manager.delete();