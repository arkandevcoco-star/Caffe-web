var Order_btn = document.getElementById("Order-btn")
var name;
var pesanan;

function Order(){
    let name = document.getElementById("nama-pemesan").value;
    let pesanan = document.getElementById("pilihan1").value;
    
    if (name == "" || pesanan == "0") {
        alert("Please fill in your name and select a coffee order.");
        return;
    }
    else {
        alert("Thank you for your order, " + name + "! You have ordered a " + pesanan + ".");
    }
    let dataPembelian = {
        "id": parseInt(idPesanan),
        "nama": name,
        "quantity": 1
    }
    console.log(dataPembelian);
    fetch("http://localhost:3000/pesanan", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataPembelian)
    })           
    .then(hasil => {
        if (hasil.ok) {
            alert("Order submitted successfully!");
        } else {
            alert("Failed to submit order.");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An error occurred while submitting the order.");
    });
    
}

