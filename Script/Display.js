"use strict";
const prodApi = "http://localhost:49251/api/Courses";
const enrollApi = "http://localhost:49251/api/Enrollments"; // Adjust ports
const invoiceApi = "http://localhost:49251/api/Invoice";
$(document).ready(() => {
    displayWatch("#develop", 1);
    displayWatch("#business", 2);
    displayWatch("#market", 3);
});
function displayWatch(containerId, catId) {
    $.ajax({
        url: prodApi,
        type: "GET",
        success: (products) => {
            const filteredProd = products.filter((item) => item.CategoryID == catId);
            const htmlContent = generateProductCards(filteredProd);
            $(containerId).html(htmlContent);
        },
        error: (err) => console.log("Error: ", err)
    });
}
/**
 * Reusable helper with both "Add to Cart" and "Enroll Now"
 */
function generateProductCards(products) {
    return products.map(item => `
        <div class="imges">
            <img src="../${item.Image}" alt="${item.CourseName}" loading="lazy">
            <div class="imgprop">
                <h2>${item.CourseName}</h2>
                <p class="img-description">${item.DSC}</p>
                <div class="star-container">⭐⭐⭐⭐⭐</div>
                <div><i class="fa-solid fa-indian-rupee-sign"></i> ${item.Price}.00</div>
                
                <div class="button-group" style="display: flex; gap: 20px; margin-top: 10px; justify-content:center">
                    <button class="btn-add" type="button" onclick="addToCart(${item.CourseID})">
                        Add To Cart
                    </button>
                    
                    <button class="btn-add" type="button" onclick="handleEnrollment(${item.CourseID}, ${item.Price})">
                        Enroll Now
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}
/**
 * PHASE 1: Logical Routing
 */
function handleEnrollment(courseID, price) {
    const userID = localStorage.getItem("userID");
    if (!userID) {
        alert("Please login to enroll in this course!");
        window.location.href = "LoginPage.html";
    }
    else {
        // Redirect to a payment page with data in the URL
        window.location.href = `payment.html?courseID=${courseID}&amount=${price}`;
    }
}
/**
 * PHASE 2 & 3: Run this on your Payment Page success event
 * I'm including it here as a reference.
 */
function processSuccessfulPayment(courseID, amount) {
    const userID = parseInt(sessionStorage.getItem("userID") || "0");
    // 1. Create Enrollment Record
    $.ajax({
        url: enrollApi,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            UserID: userID,
            CourseID: courseID
            // EnrollmentDate handled by SQL Default GetDate()
        }),
        success: (enrollResult) => {
            // 2. Create Invoice Record using the new EnrollID
            if (enrollResult) {
                $.ajax({
                    url: invoiceApi,
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify({
                        UserID: userID,
                        EnrollID: enrollResult.EnrollID, // Returned from your API
                        InvoiceQty: 1,
                        TotalPrice: amount
                    }),
                    success: () => {
                        alert("Payment Successful! Invoice Generated.");
                        window.location.href = "../HTML/Invoice.html";
                    }
                });
            }
        },
        error: () => alert("Enrollment failed after payment.")
    });
}
// Global Exports
window.displayWatch = displayWatch;
window.handleEnrollment = handleEnrollment;
window.addToCart = (id) => {
    console.log(`Adding Course ${id} to cart`);
};
