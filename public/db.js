let db;
//Returns a IDBRequest object
const request = indexedDB.open("budget", 1);
//Returns a new object store 
request.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectStore("pending", { autoIncrement: true });
};
//Success event 
request.onsucess = function (event) {
    db = event.target.result;
//If the navigator is online then check the database
    if(navigator.onLine) {
        checkDatabase();
    }
};
//Console logged Oops for error
request.onerror = function (event) {
    console.log("Oops!", event.target.errorcode);
};
//Function for saving the record for the upgrade needed
function saveRecord(record) {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");

    store.add(record);
};
//Checks to see if there are any pedning records to be updated once an online connection is made
function checkDatabase() {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    const getAll = store.getAll();
//Gets all object stores onsuccess evens if the length is greater than 0 
    getAll.onsucess = function () {
        if(getAll.result.length > 0) {
//Stringify all the objects that get returned as the result of transactions
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
           .then(response => response.json())
           .then(()=> {
               const transaction = db.transaction(["pending"], "readwrite");
               const store = transaction.objectStore("pending");
               store.clear();
           });
        }
    };
}
//Listens and initiates all functions 
window.addEventListener("online", checkDatabase);