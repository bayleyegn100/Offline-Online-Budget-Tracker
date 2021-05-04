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