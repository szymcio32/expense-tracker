class Expense{
    constructor(name, amount, category, date){
        this.name = name;
        this.amount = amount;
        this.category = category;
        this.date = date;
    }
}

class UI{
    static showAllExpenses(){
        const expenses = LocalStore.getExpensesFromStore();
        expenses.forEach( expense => UI.addExpense(expense));
    }
    static addExpense(expense){
        const table_body = document.querySelector('#expense-table-body');
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${expense.name}</td>
        <td>${expense.amount}</td>
        <td>${expense.category}</td>
        <td>${expense.date}<button class="btn btn-danger float-right delete">X</button></td>
        `;
        table_body.appendChild(row);
    }

    static removeExpense(e_target){
        if(e_target.classList.contains('delete')){
            e_target.parentElement.parentElement.remove();
        }
    }
}

class LocalStore{
    static getExpensesFromStore(){
        let expenses = localStorage.getItem('expenses');
        return (expenses === null) ? [] : JSON.parse(expenses);
    }

    static addExpenseToStore(expense){
        let expenses = LocalStore.getExpensesFromStore();
        expenses.push(expense);
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    static removeExpenseFromStore(tr){
        let expenses = LocalStore.getExpensesFromStore();
        var row_data = [];
        Array.from(tr.children).forEach( td => row_data.push(td.textContent));
        expenses.forEach( (expense, index) => {
            const {name, amount, category, date} = expense
            if (name === row_data[0] && amount === row_data[1] && category === row_data[2] && date === row_data[3].slice(0, -1)){
                expenses.splice(index, 1);
            }
        localStorage.setItem('expenses', JSON.stringify(expenses));
        });
    }
}

class DatePicker{
    static getTodayDate(){
        const today = new Date();
        let day = today.getUTCDate();
        if (day < 10){
            day = `0${day}`;
        }
        let month = today.getUTCMonth() + 1;
        if (month < 10){
            month = `0${month}`;
        }
        document.querySelector("#expense-date").value = `${day}-${month}-${today.getUTCFullYear()}`;
    }

    static enableDatePicker(){
        $('#expense-date').datepicker({
            format: 'dd-mm-yyyy',
        });
    }
}


// Event: DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    UI.showAllExpenses();
    DatePicker.getTodayDate();
    DatePicker.enableDatePicker();
});

// Event: add expense button
document.querySelector('#expense-btn').addEventListener('click', e => {
    e.preventDefault();

    const name = document.querySelector("#expense-name").value;
    const amount = document.querySelector("#expense-amount").value;
    const category = document.querySelector("#expense-category").value;
    const expense_date = document.querySelector("#expense-date").value;

    const expense = new Expense(name, amount, category, expense_date);

    UI.addExpense(expense);
    LocalStore.addExpenseToStore(expense);
});

// Event: remove expense
document.querySelector('#expense-table-body').addEventListener('click', e => {
    UI.removeExpense(e.target);
    LocalStore.removeExpenseFromStore(e.target.parentElement.parentElement);
});