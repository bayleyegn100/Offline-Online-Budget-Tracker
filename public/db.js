// Global variables
let db;
let budgetVersion;
// creat a database request in indexdb
const request = indexedDB.open("BudgetDB", budgetVersion || 21);
