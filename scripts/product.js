// ECMA Script 2015 ~ ES6
class Product {
    constructor(id, name, price, quantity) {
        this.id = id;
        this.productName = name;
        this.price = price;
        this.quantity = quantity;
    }
}

const key = "data_product";

let products = [];

function init() {
    // chưa lưu trữ, chưa tạo ra key
    if (getLocalStorage(key) == null) {
        products = [
            new Product(1, "iPhone 6S", 5000000, 5),
            new Product(2, "iPhone 7S", 7500000, 15),
            new Product(3, "iPhone X", 15000000, 8),
            new Product(4, "iPhone 13", 35000000, 18)
        ];
        setLocalStorage(key, products);
    }
    else {
        products = getLocalStorage(key);
    }
}

function getLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

function setLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data))
}

function removeLocalStorage(key) {
    localStorage.removeItem(key);
}

function showProduct() {
    let tbProduct = document.querySelector('#tbProduct');
    tbProduct.innerHTML = "";
    products.forEach(function (product, index) {
        tbProduct.innerHTML += `
                                <tr id='tr_${product.id}'>
                                    <td class="text-center">${product.id}</td>
                                    <td>${product.productName}</td>
                                    <td class="text-right">${formatCurrency(product.price)}</td>
                                    <td class="text-right">${product.quantity}</td>
                                    <td>
                                        <button class="btn btn-warning" onclick="get(${product.id})">Edit</button>
                                        <button class="btn btn-primary d-none" onclick="update(${product.id})">Update</button>
                                        <button class="btn btn-warning d-none" onclick="reset(${product.id})">Cancel</button>
                                        <button class="btn btn-danger" onclick="remove(${product.id})">Remove</button>
                                    </td>
                                </tr>
                            `;
    })
}

function formatCurrency(number) {
    return number.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
}

function getLastestId() {
    let array = [...products];
    return array.sort(function (pdt1, pdt2) {
        return pdt2.id - pdt1.id;
    })[0].id;
}

function save() {
    let productName = document.getElementById("productName").value;
    let price = document.getElementById("price").value;
    let quantity = document.getElementById("quantity").value;
    let id = getLastestId() + 1;
    let product = new Product(id, productName, price, quantity);
    products.push(product);
    setLocalStorage(key, products);
    showProduct();
    clear();
}

function clear() {
    document.getElementById("productName").value = "";
    document.getElementById("price").value = "";
    document.getElementById("quantity").value = "";
}

function remove(id) {
    let confirmed = window.confirm("Are you sure to want to remove this product?");
    if (confirmed) {
        let position = findProductById(id);
        // product is existed
        if (position != -1) {
            products.splice(position, 1);
            setLocalStorage(key, products);
            showProduct();
        }
    }
}

function findProductById(id) {
    return products.findIndex(function (product, index) {
        return product.id == id;
    })
}


function get(id){
    let tr = document.getElementById(`tr_${id}`);
    let index = findProductById(id);
    let product = products[index];
    tr.children[1].innerHTML = `<input id='name_${id}' type="text" value="${product.productName}">`;
    tr.children[2].innerHTML = `<input id='price_${id}' type="text" value="${product.price}">`;
    tr.children[3].innerHTML = `<input id='quantity_${id}' type="text" value="${product.quantity}">`;

    tr.children[4].children[0].classList.add('d-none')
    tr.children[4].children[1].classList.remove('d-none')
    tr.children[4].children[2].classList.remove('d-none')
}

function reset(id){
    let tr = document.getElementById(`tr_${id}`);
    let index = findProductById(id);
    let product = products[index];
    tr.children[1].innerHTML = product.productName;
    tr.children[2].innerHTML = formatCurrency(product.price);
    tr.children[3].innerHTML = product.quantity;

    tr.children[4].children[0].classList.remove('d-none')
    tr.children[4].children[1].classList.add('d-none')
    tr.children[4].children[2].classList.add('d-none')
}


function update(id){
    let tr = document.getElementById(`tr_${id}`);
    let productName = document.getElementById(`name_${id}`).value;
    let price = document.getElementById(`price_${id}`).value;
    let quantity = document.getElementById(`quantity_${id}`).value;
    let index = findProductById(id);
    let product = products[index];
    product.productName = productName;
    product.price = price;
    product.quantity = quantity;
    setLocalStorage(key, products);
    reset(id);
}

// IIFE
(function ready() {
    init();
    showProduct();
})();

