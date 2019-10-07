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
        <td class="exp-name">${expense.name}</td>
        <td class="exp-amount">${expense.amount}</td>
        <td class="exp-category">${expense.category}</td>
        <td class="exp-date">${expense.date}<button class="btn btn-danger float-right delete">X</button></td>
        `;
        table_body.appendChild(row);
    }

    static removeExpense(e_target){
        if(e_target.classList.contains('delete')){
            e_target.parentElement.parentElement.remove();
        }
    }

    static countTotalAmount(){
        const td_amount_rows = document.querySelectorAll("td.exp-amount");
        let total = 0;
        td_amount_rows.forEach(td => {
            if (!td.parentNode.classList.contains('d-none')){
                total += parseFloat(td.textContent);
            }
        });

        document.querySelector("#total").textContent = total;
    }

    static showAlert(msg, cls){
        const div = document.createElement('div');
        div.className = `alert ${cls}`;
        div.appendChild(document.createTextNode(msg));
        const btn = document.querySelector('#expense-btn');
        const form = document.querySelector('#expense-form');
        form.insertBefore(div, btn.parentNode);

        setTimeout( () => div.remove(), 2000);
    }

    static resetFields(){
        document.querySelector('#expense-form').reset();
        DatePicker.setTodayDateToInputDate();
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
    static setTodayDateToInputDate(){
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
            dateFormat: 'dd-mm-yy',
        });
    }
}

class ExpenseFilter{
    static filterByName(){
        const search_string = document.querySelector("#filter-name").value.toLowerCase();
        const expenses_name_td = document.querySelectorAll("td.exp-name");
        expenses_name_td.forEach( td => {
            let td_value = td.textContent.toLowerCase();
            if (td_value.includes(search_string)){
                td.parentNode.classList.remove('d-none');
            }
            else{
                td.parentNode.classList.add('d-none');
            }
        });
    }

    static filterByCategory(){
        const search_category = document.querySelector("#filter-category").value.toLowerCase();
        const expenses_category_td = document.querySelectorAll("td.exp-category");
        expenses_category_td.forEach( td => {
            let td_value = td.textContent.toLowerCase();
            if (!td_value.includes(search_category)){
                td.parentNode.classList.add('d-none');
            }
        });
    }

    static resetFilter(){
        const table_body = document.querySelector('#expense-table-body').childNodes
        table_body.forEach( row => row.classList.remove('d-none'));
        document.querySelector('#filter-form').reset();
    }
}

// import Chart instance
import { bar_chart } from './chart.mjs';


// Event: DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    UI.showAllExpenses();
    DatePicker.setTodayDateToInputDate();
    DatePicker.enableDatePicker();
    UI.countTotalAmount();
    bar_chart.createChart();
    bar_chart.updateChart();
});

// Event: add expense button
document.querySelector('#expense-btn').addEventListener('click', e => {
    e.preventDefault();

    const name = document.querySelector("#expense-name").value;
    const amount = document.querySelector("#expense-amount").value;
    const category = document.querySelector("#expense-category").value;
    const expense_date = document.querySelector("#expense-date").value;

    if (name === "" || amount === ""){
        UI.showAlert("Expense name or amount are empty", "alert-danger");
        return
    }

    const expense = new Expense(name, amount, category, expense_date);

    UI.addExpense(expense);
    UI.showAlert("Expense has been successfully added", "alert-success");
    LocalStore.addExpenseToStore(expense);
    UI.countTotalAmount();
    UI.resetFields();
    bar_chart.updateChart();
});

// Event: remove expense
document.querySelector('#expense-table-body').addEventListener('click', e => {
    UI.removeExpense(e.target);
    UI.showAlert("Expense has been removed", "alert-success");
    LocalStore.removeExpenseFromStore(e.target.parentElement.parentElement);
    UI.countTotalAmount();
    bar_chart.updateChart();
});

// Event: filter expenses
document.querySelector("#filter-btn").addEventListener('click', e =>{
    e.preventDefault();

    ExpenseFilter.filterByName();
    ExpenseFilter.filterByCategory();
    UI.countTotalAmount();
    bar_chart.updateChart();

});

// Event: reset filter
document.querySelector('#reset-filter-btn').addEventListener('click', e =>{
    e.preventDefault();

    ExpenseFilter.resetFilter();
    UI.countTotalAmount();
    bar_chart.updateChart();
})