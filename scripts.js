const Modal = {
    open() {
    document
    .querySelector('.modal-overlay')
    .classList
    .add('active')
    },
    close () {
    document
    .querySelector('.modal-overlay')
    .classList
    .remove('active')
    }
}
const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("finances:transactions")) || []
    },
    set(transactions) {
        localStorage.setItem("finances:transactions", JSON.stringify(transactions))
    }
}

const Transaction = {
    
    all: Storage.get(),
    add(transaction) {
        Transaction.all.push(transaction)
        App.reload()
    },
    remove(index) {
        Transaction.all.splice(index, 1)
        App.reload()
    },
    incomes() {
        let income = 0;
        Transaction.all.forEach(transaction => {
            if( transaction.amount > 0 ) {
                income += transaction.amount;
            }
        })
        return income;
    },
    expenses() {
        let expense = 0;
        Transaction.all.forEach(transaction => {
            if( transaction.amount < 0 ) {
                expense = expense + transaction.amount;
            }
        })
        return expense;
    },
    total() {
       return Transaction.incomes() + Transaction.expenses();
    }
}


const DOM = { 

    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index
        DOM.transactionsContainer.appendChild(tr)
    },


    innerHTMLTransaction(transaction, index) {
        const CSSClass = transaction.amount > 0 ? "income" : "expense"
        const amount = Utils.formatCurrency(transaction.amount)
        
        const info = localStorage.getItem('finances:transactions')
        const array = JSON.parse(info)
        const a = [transaction]

        
        const sorted = array.sort((a,b)=> {
                    return a.date - b.date
                })

        if (transaction.description.length > 20){
           
            const html = 
            `
            <td class="description"><div class="descriptionDiv"><div class="div">${transaction.description}</div></div></td>
            <td class="${CSSClass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="lixeira.png" width='27'" alt="remover transação">
            </td>
            `
            
            return html
        }
        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSClass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img onclick="Transaction.remove(${index})" src="lixeira.png" width='27' alt="remover transação">
        </td>
        `
        return html

        
    },
    
    searchFilter() {
        document.querySelector('#search-input').
        addEventListener('input', filterList);

        function filterList(){
            const searchInput = document.querySelector('#search-input');
            const filter = searchInput.value.toLowerCase();
            const listItems = document.querySelectorAll('.list-group-item');

            listItems.forEach((item) => {
                let text = item.textContent;
                if(text.toLowerCase().includes(filter.toLowerCase())){
                    item.styles.display = '';
                }else{
                    item.styles.display = 'none';
                }
            })
        }
    },

    updateBalance() {
        document
        .getElementById('incomeDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
        .getElementById('expenseDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
        .getElementById('totalDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    },
    
}

const as = [DOM.transactionsContainer.children]
console.log(Transaction.all)
console.log(DOM)
console.log(DOM.transactionsContainer.children)


const a = DOM.transactionsContainer.children
  
       console.log(a)

//     const a = [ 
    //         {letra: 'b', num: 3}, 
    //         {letra: 'c', num: 2},
    //         {letra: 'd', num: 1},
    //     ]
    //    const sorted = a.sort((b,c)=> {
    //        return b.num - c.num
    //    })
    //    console.log(sorted)


const Utils = {

    formatAmount(value) {
        value = value * 100
        return Math.round(value)
    },

    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },
    

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
   
        return signal + value
    }
    
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },


    validateFields() {
        const { description, amount, date } = Form.getValues()
        if(description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("Preencha todos os campos")
        }
    },

   

    formatValues () {
        let { description, amount, date } = Form.getValues()
        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },
    submit(event) {
        event.preventDefault()

        try{
            Form.validateFields()
            const transaction = Form.formatValues()
            Transaction.add(transaction)
            //Form.formatData()
            Form.clearFields()
            Modal.close()

        } catch (error) {
            alert(error.message)
        }
    }
    

}

const App = {
    init() {
    Transaction.all.forEach(DOM.addTransaction)
    
    DOM.updateBalance()

    Storage.set(Transaction.all)
    },

    reload() {
        DOM.clearTransactions()
        App.init()
    },
}





// console.log(localStorage.getItem('finances:transactions'))

// console.log(tbody.children)



// console.log(localStorage.getItem('finances:transactions'))
App.init()
// console.log(Transaction);