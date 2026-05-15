"use strict";
const INVOICE_API = "http://localhost:49251/api/Courses";
$(document).ready(() => {
    generateInvoiceUI();
});
function generateInvoiceUI() {
    const rawData = sessionStorage.getItem("billData");
    if (!rawData) {
        alert("No invoice data found.");
        window.location.href = "StudentHome.html";
        return;
    }
    const bill = JSON.parse(rawData);
    // Fetch courses to get the Names for the UI
    $.ajax({
        url: INVOICE_API,
        type: "GET",
        success: (products) => {
            let html = "";
            let grandTotal = 0;
            bill.Items.forEach(item => {
                const product = products.find(p => p.CourseID == item.CourseID);
                const name = product ? (product.CourseName) : "Unknown Course";
                grandTotal += item.TotalPrice;
                html += `
                <tr>
                    <td>${item.CourseID}</td>
                    <td>${name}</td>
                
                    <td>₹${item.TotalPrice.toFixed(2)}</td>
                </tr>`;
            });
            $("#disp-enroll-id").text(bill.EnrollID);
            $("#disp-date").text(new Date().toLocaleDateString());
            $("#invoice-items").html(html);
            $("#disp-total").text(grandTotal.toFixed(2));
            // Optional: Clear bill data after showing it so it doesn't persist
            // sessionStorage.removeItem("billData");
        }
    });
}
