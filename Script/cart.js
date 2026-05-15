"use strict";
// 2. CONFIGURATION
const API_CONFIG = {
    cart: "http://localhost:49251/api/Cart",
    product: "http://localhost:49251/api/Courses",
    bill: "http://localhost:49251/api/Enrollment",
    Invoices: "http://localhost:49251/api/Invoice"
};
class CartManager {
    constructor() {
        this.init();
    }
    init() {
        $(document).ready(() => {
            this.loadCart();
        });
    }
    isLoggedIn() {
        return !!sessionStorage.getItem("userEmail");
    }
    // ---------------- ROUTING LOGIC ----------------
    /**
     * Called by the "Proceed to Payment" button on Cart.html
     */
    checkLoginAndProceed() {
        const cart = $.ajax({ url: API_CONFIG.cart, type: "GET" });
        console.log(cart);
        if (!this.isLoggedIn()) {
            alert("Please login to proceed with your purchase.");
            // Store the current page so login can return here
            sessionStorage.setItem("redirectURL", "./Cart.html");
            window.location.href = "LoginPage.html";
        }
        else if (!cart || cart.length === 0) {
            alert("Your Cart is Empty!");
            return;
        }
        else {
            // User is logged in, move to the payment details page
            window.location.href = "payment.html";
        }
    }
    // ---------------- LOAD LOGIC ----------------
    loadCart() {
        if (!this.isLoggedIn()) {
            this.loadLocalCart();
            return;
        }
        $.ajax({
            url: API_CONFIG.cart,
            type: "GET",
            success: (cart) => {
                $.ajax({
                    url: API_CONFIG.product,
                    type: "GET",
                    success: (products) => {
                        this.renderCartUI(cart, products, "server");
                    }
                });
            }
        });
    }
    loadLocalCart() {
        let cart = JSON.parse(sessionStorage.getItem("cart") || "[]");
        $.ajax({
            url: API_CONFIG.product,
            type: "GET",
            success: (products) => {
                this.renderCartUI(cart, products, "local");
            }
        });
    }
    renderCartUI(cart, products, type) {
        let html = "";
        let total = 0;
        cart.forEach(item => {
            const product = products.find(p => p.CourseID == item.CourseID);
            if (!product)
                return;
            const price = Number(product.Price || 0);
            total += price;
            html += `
            <div class="imges">
                <img src="../${product.Image || item.Image}">
                <div class="imgprop">
                    <p>${product.CourseName || item.CourseName}</p>
                    <div>₹${price}</div>
                    <button class="btn-add" onclick="cartMgr.deleteCartItem(${item.CourseID})">Remove</button>
                </div>
            </div>`;
        });
        $("#cart-container").html(html || "<h3>Your cart is empty</h3>");
        $("#total-bill").text("₹" + total.toFixed(2));
    }
    // ---------------- PAYMENT & INVOICE FLOW ----------------
    //     public async processPayment(): Promise<void> {
    //         // 1. Validate fields on payment.html
    //         if (!this.validatePaymentForm()) return;
    //         try {
    //             const cart: CartItem[] = await $.ajax({ url: API_CONFIG.cart, type: "GET" });
    //             const products: Product[] = await $.ajax({ url: API_CONFIG.product, type: "GET" });
    //             if (!cart || cart.length === 0) {
    //                 alert("Your Cart is Empty!");
    //                 return;
    //             }
    //                         // Inside processPayment()
    //             const userIDRaw = localStorage.getItem("userID");
    //             console.log("Current User ID from Session:", userIDRaw); // DEBUG THIS
    //             const userID = parseInt(userIDRaw || "0");
    //             if (isNaN(userID) || userID <= 0) {
    //                 alert("Invalid User Session. Please log in again.");
    //                 window.location.href = "LoginPage.html";
    //                 return;
    //             }
    //             // Ensure the key 'UserID' matches exactly what your C# Model expects
    //             const enrollmentData = { UserID: userID };
    //             // 2. Create Enrollment
    //             const EnrollID: number = await $.ajax({
    //                 url: API_CONFIG.bill,
    //                 type: "POST",
    //                 contentType: "application/json",
    //                 data: JSON.stringify(enrollmentData)
    //             });
    // console.log(EnrollID);
    //             // 3. Map to Invoice
    //             const Invoices: Invoice[] = cart.map(item => {
    //                 const prodRef = products.find(p => p.CourseID == item.CourseID);
    //                 return {
    //                     UserID:userID,
    //                     CourseID: item.CourseID,
    //                     EnrollID: EnrollID,
    //                     TotalPrice: prodRef ? prodRef.Price : 0
    //                 };
    //             });
    //             // 4. Save Invoices
    //             await $.ajax({
    //                 url: API_CONFIG.Invoices,
    //                 type: "POST",
    //                 contentType: "application/json",
    //                 data: JSON.stringify(Invoices)
    //             });
    //             // 5. Clear Cart
    //             await this.clearServerCart(cart);
    //             sessionStorage.setItem("billData", JSON.stringify({ EnrollID: EnrollID, Items: Invoices }));
    //             alert("Payment Successful!");
    //             window.location.href = "Invoice.html";
    //         } catch (err) {
    //             console.error("Payment Error:", err);
    //             alert("Transaction failed. Check API connectivity.");
    //         }
    //     }
    async processPayment() {
        // 1. Validate fields on payment.html
        if (!this.validatePaymentForm())
            return;
        try {
            const cart = await $.ajax({ url: API_CONFIG.cart, type: "GET" });
            const products = await $.ajax({ url: API_CONFIG.product, type: "GET" });
            if (!cart || cart.length === 0) {
                alert("Your Cart is Empty!");
                return;
            }
            const userIDRaw = localStorage.getItem("userID"); // Ensure Casing matches exactly
            const userID = parseInt(userIDRaw || "0");
            if (isNaN(userID) || userID <= 0) {
                alert("Invalid User Session. Please log in again.");
                window.location.href = "LoginPage.html";
                return;
            }
            const enrollmentData = { UserID: userID };
            // 2. Create Enrollment (Hits POST InsertEnrollment)
            // Note: This returns "Enrollment Generated" as a string
            await $.ajax({
                url: API_CONFIG.bill,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(enrollmentData)
            });
            // 3. NEW STEP: Fetch all Enrollments to find the ID we just created
            const allEnrollments = await $.ajax({
                url: API_CONFIG.bill,
                type: "GET"
            });
            // Filter for this user and sort to find the newest (highest ID) Enrollment
            const userEnrollments = allEnrollments.filter(e => e.UserID === userID);
            const latestEnrollment = userEnrollments.sort((a, b) => b.EnrollID - a.EnrollID)[0];
            if (!latestEnrollment) {
                alert("Critical Error: Enrollment ID not found.");
                return;
            }
            const currentEnrollID = latestEnrollment.EnrollID;
            console.log("Using Real EnrollID:", currentEnrollID);
            // 4. Map to Invoice using the REAL ID
            const invoicesToSave = cart.map(item => {
                const prodRef = products.find(p => p.CourseID == item.CourseID);
                return {
                    UserID: userID,
                    EnrollID: currentEnrollID, // Valid ID from database
                    CourseID: item.CourseID,
                    TotalPrice: prodRef ? prodRef.Price : 0
                };
            });
            // 5. Save Invoices (Matches your existing flow)
            // If your API expects an array, this works. If it expects one object, loop this.
            await $.ajax({
                url: API_CONFIG.Invoices,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(invoicesToSave)
            });
            // 6. Clear Cart
            await this.clearServerCart(cart);
            sessionStorage.setItem("billData", JSON.stringify({ EnrollID: currentEnrollID, Items: invoicesToSave }));
            alert("Payment Successful!");
            window.location.href = "Invoice.html";
        }
        catch (err) {
            console.error("Payment Error:", err);
            alert("Transaction failed. Check API connectivity or SQL Constraints.");
        }
    }
    async clearServerCart(cart) {
        const cartDeletes = cart.map(item => $.ajax({ url: `${API_CONFIG.cart}?id=${item.CourseID}`, type: "DELETE" }));
        await Promise.all(cartDeletes);
    }
    // private validatePaymentForm(): boolean {
    //     // Safeguard: Check if we are actually on the payment page
    //     if ($("#txtCardNo").length === 0) return true; 
    //     const cardNo = $("#txtCardNo").val() as string;
    //     const name = $("#txtName").val() as string;
    //     const mobNo = $("#txtMobNo").val() as string;
    //     const cvv = $("#txtCVV").val() as string;
    //     if (cardNo.length !== 16) { alert("Card number must be 16 digits"); return false; }
    //     if (!name) { alert("Enter Name"); return false; }
    //     if (mobNo.length !== 10) { alert("Enter 10 digit Mobile number."); return false; }
    //     if (cvv.length !== 3) { alert("Enter 3 digit CVV"); return false; }
    //     return true;
    // }
    validatePaymentForm() {
        // Safeguard: Check if we are actually on the payment page
        if ($("#txtCardNo").length === 0)
            return true;
        const cardNo = $("#txtCardNo").val().trim();
        const name = $("#txtName").val().trim();
        const mobNo = $("#txtMobNo").val().trim();
        const cvv = $("#txtCVV").val().trim();
        // Helper to check if string is only numbers
        const isNumeric = (val) => /^\d+$/.test(val);
        // 1. Card Number Validation
        if (cardNo.length !== 16 || !isNumeric(cardNo)) {
            alert("Card number must be exactly 16 digits (numbers only).");
            return false;
        }
        // 2. Name Validation
        if (!name) {
            alert("Please enter the cardholder name.");
            return false;
        }
        // 3. Mobile Number Validation
        if (mobNo.length !== 10 || !isNumeric(mobNo)) {
            alert("Mobile number must be exactly 10 digits (numbers only).");
            return false;
        }
        // 4. CVV Validation
        if (cvv.length !== 3 || !isNumeric(cvv)) {
            alert("CVV must be exactly 3 digits (numbers only).");
            return false;
        }
        return true;
    }
    deleteCartItem(id) {
        $.ajax({
            url: `${API_CONFIG.cart}?id=${id}`,
            type: "DELETE",
            success: () => this.loadCart()
        });
    }
}
const cartMgr = new CartManager();
window.cartMgr = cartMgr;
