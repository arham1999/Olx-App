if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../sw.js');
}


function search() {
    var adVal = document.getElementById('sear').value;
    if(adVal === "") {
        alert('Please Enter Adname');
        return false
    }
    localStorage.setItem('adVal', adVal);
    var adCat = document.getElementById('drop').value;
    localStorage.setItem('adCat', adCat);
    location.href = 'search.html';
    return false
}