// 1. Interfaces
interface Product {
    CourseID: number;
    Name: string;
    Image: string;
    Price: number;
   
}

interface CartItem {
    CartID?: number;
    UserID?: number;
    CourseID: number;
    CourseName?: string;
    Price?: number;
    Image?: string;
}

interface User {
    UserID: number;
    Email: string;
}

// 2. Constants & API Configuration
const API = {
    cart: "http://localhost:49251/api/Cart",
    product: "http://localhost:49251/api/Courses",
    user: "http://localhost:49251/api/Users"
};

declare var $: any;

$(document).ready(() => {
    updateCartCounter();
    updateUserIcon();
});

// 3. API Helper Functions
function insertCart(item: CartItem): void {
    $.ajax({
        url: API.cart,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(item),
        success: () => {
            alert("Course Added to Cart!!");
            updateCartCounter();
        },
        error: (err: any) => console.error("Insert Error:", err)
    });
}

function updateCart(item: CartItem): void {
    $.ajax({
        url: API.cart,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(item),
        success: () => {
            alert("Course Updated!!");
            updateCartCounter();
        },
        error: (err: any) => console.error("Update Error:", err)
    });
}

// 4. Main Cart Logic
function addToCart(CourseID: number): void {
    // Step 1: Fetch Product Details
    $.ajax({
        url: API.product,
        type: "GET",
        success: (products: Product[]) => {
            const product = products.find(p => p.CourseID == CourseID);
            if (!product) return;

            const email = sessionStorage.getItem("userEmail");

            // ================= GUEST CART (Local Storage) =================
            if (!email) {
                let cart: CartItem[] = JSON.parse(sessionStorage.getItem("cart") || "[]");
                let existing = cart.find(i => i.CourseID == CourseID);

                if (existing) {
                   
                        alert("Already in Cart!!");
                        return;
                    
                } else {
                    cart.push({
                        CourseID: product.CourseID,
                        CourseName: product.Name,
                        Price: product.Price,
                        Image: product.Image
                    
                    });
                }

                sessionStorage.setItem("cart", JSON.stringify(cart));
                updateCartCounter();
                alert("Guest Cart Updated!");
                return;
            }

            // ================= LOGGED IN CART (Database) =================
            // Fetch Users to get UserID
            $.ajax({
                url: API.user,
                type: "GET",
                success: (users: User[]) => {
                    const user = users.find(u => u.Email === email);
                    if (!user) return;

                    // Fetch Cart for this user
                    $.ajax({
                        url: API.cart,
                        type: "GET",
                        success: (cart: CartItem[]) => {
                            let existing = cart.find(c => c.CourseID == CourseID && c.UserID == user.UserID);

                            if (existing) {
                                
                                    alert("Already in Cart!!");
                                    return;
                            
                               
                            } else {
                                insertCart({
                                    UserID: user.UserID,
                                    CourseID: product.CourseID,
                                });
                            }
                        }
                    });
                }
            });
        }
    });
}

// 5. UI Updates
function updateCartCounter(): void {
    const email = sessionStorage.getItem("userEmail");
    let count: number = 0;

    if (!email) {
        let cart: CartItem[] = JSON.parse(sessionStorage.getItem("cart") || "[]");
        count = cart.length;
        refreshCartCounter(count);
    } else {
        $.ajax({
            url: API.cart,
            type: "GET",
            success: (cart: CartItem[]) => {
                count = cart.length;
                refreshCartCounter(count);
            },
            error: () => refreshCartCounter(0)
        });
    }
}

function refreshCartCounter(count: number): void {
    let icon = $(".fa-bag-shopping");
    if (!icon.length) return;

    $(".cart-badge").remove();
    if (count > 0) {
        icon.parent().append(`<span class="cart-badge">${count}</span>`);
    }
}

function updateUserIcon(): void {
    let userIcon = $("#user-icon");
    let userID = sessionStorage.getItem("userID");

    if (userID) {
        userIcon.html(`
            <i class="fa-solid fa-right-from-bracket" 
               title="Logout" 
               style="cursor:pointer; font-size:22px;" 
               onclick="logoutUser()"></i>
        `);
    } else {
        userIcon.html(`
            <a href="./LoginPage.html" title="Login">
                <i class="fa-solid fa-right-to-bracket" style="font-size:22px;"></i>
            </a>
        `);
    }
}

// 6. Auth
function logoutUser(): void {
    sessionStorage.clear();
    localStorage.clear();
    
    alert("Logged Out Successfully!!");
    updateCartCounter();
    updateUserIcon();
    window.location.href = "../HTML/StudentHome.html";
}

// Global Exports
(window as any).addToCart = addToCart;
(window as any).logoutUser = logoutUser;