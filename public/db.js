// Global variables
let db;
let budgetVersion;
// creat a database request in indexdb
const request = indexedDB.open("BudgetDB", budgetVersion || 21);
// checks the version to check the indexdb needs update or not.
request.onupgradeneeded = function (e) {
    console.log("Upgrade needed in IndexDB");
    // declaring both versions of the dbs
    const { oldVersion } = e;
    const newVersion = e.newVersion || db.version;
    console.log(`Database Updated from version ${oldVersion} to ${newVersion}`);
    db = e.target.resutl;
    // crating a budget store if not avilable.
    if (db.objectStoreNames.length === 0) {
        db.createObjectStore('BudgetStore', { autoIncrement: true });
    }
};
// log error if there is 
request.onerror = function (e) {
    console.log("Check the DB invoked");
}
// This is called when the user is back online (see event listener on line 99)
function checkDatabase() {
    console.log('check db invoked');

    // Opening a transaction on on BudgetStore db
    let transaction = db.transaction(['BudgetStore'], 'readwrite');

    // access BudgetStore object
    const store = transaction.objectStore('BudgetStore');

    // Get all records from store and set to a variable
    const getAll = store.getAll();
    // if the request was successful  
    getAll.onsuccess = function () {
        // If there are items in the store, bulk add them when we are back online
        if (getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((res) => {
                    // If returned response is not empty
                    if (res.length !== 0) {
                        // Opening another transaction to BudgetStore with the ability to read and write
                        transaction = db.transaction(['BudgetStore'], 'readwrite');

                        // Assigning the current store to a variable
                        const currentStore = transaction.objectStore('BudgetStore');

                        // Clearing existing entries because the bulk add to the DB was successful
                        currentStore.clear();
                        console.log('Clearing store 🧹');
                    }
                });
        }
    };
}
request.onsuccess = function (e) {
    console.log('success');
    db = e.target.result;
  
    // Checking if app is online before reading from db
    if (navigator.onLine) {
      console.log('Backend online! 🗄️');
      checkDatabase();
    }
  };
  
    // use saveRecord which is called in the sendTransaction function used when offline.
    const saveRecord = (record) => {
        console.log('Save record invoked');
        // Create a transaction on the BudgetStore db with readwrite access
        const transaction = db.transaction(['BudgetStore'], 'readwrite');
      
        // Access your BudgetStore object store
        const store = transaction.objectStore('BudgetStore');
      
        // Add record to your store with add method.
        store.add(record);
      };
      
   // Listen for app coming back online
  window.addEventListener('online', checkDatabase);