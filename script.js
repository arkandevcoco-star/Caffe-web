var Order_btn = document.getElementById("Order-btn")
var name;
var pesanan;

function Order(){
    let name = document.getElementById("nama-pemesan").value;
    let pesanan = document.getElementById("pilihan1").value;
    
    if (name == "" || pesanan == "0") {
        alert("Please fill in your name and select a coffee order.");
    }
    else {
        alert("Thank you for your order, " + name + "! You have ordered a " + pesanan + ".");
    }
}