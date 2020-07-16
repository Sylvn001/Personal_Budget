class Expense{
    constructor(year,month,day,type,description,value){
        this.year = year 
        this.month = month  
        this.day = day 
        this.type = type 
        this.description = description
        this.value = value
    }

    validate(){
        for(let i in this){
            if(this[i] == undefined || this[i] == '' || this[i] == null )
                return false 
        }
        return true
    }
}
class Bd{
    constructor(){
        let id = localStorage.getItem('id')

        if(id === null){
            localStorage.setItem('id' , 0)
        }
    }
    
    getNextID(){
        let nextId = localStorage.getItem('id')
        return parseInt(nextId) + 1  
    }
    record(d){
        let id = this.getNextID()

        localStorage.setItem(id , JSON.stringify(d)) 
        localStorage.setItem('id' , id)
    }
    retrieveRecords(){

        //array expense 
        let expenses = Array()
        let id = localStorage.getItem('id')
        //recovers all registered data in LocalStorage
        for(let i=1; i <= id; i++ ){
            let expense = JSON.parse(localStorage.getItem(i))

            if(expense === null){
                continue
            }
            expense.id = i
            expenses.push(expense)

        }
        return expenses
    }
    search(expense){
        let filteredExpenses = Array()
        filteredExpenses = this.retrieveRecords()
        //year filter
        if(expense.year != ''){
            filteredExpenses = filteredExpenses.filter( d => d.year == expense.year) 
        }
        //month filter 
        if(expense.month != ''){
            filteredExpenses = filteredExpenses.filter( d => d.month == expense.month) 
        }
        //day filter 
        if(expense.day != ''){
            filteredExpenses = filteredExpenses.filter( d => d.day == expense.day) 
        }
        //type filter 
        if(expense.type != ''){
            filteredExpenses = filteredExpenses.filter( d => d.type == expense.type) 
        }
        //description filter 
        if(expense.description != ''){
            filteredExpenses = filteredExpenses.filter( d => d.description == expense.description) 
        }
        //value filter 
        if(expense.value != ''){
            filteredExpenses = filteredExpenses.filter( d => d.value == expense.value) 
        }

        return filteredExpenses
    }
    remove(id){
        localStorage.removeItem(id)
    }

}

let bd = new Bd()


function registerExpense(){
    let year        = document.getElementById('ano')
    let month       = document.getElementById('mes')
    let day         = document.getElementById('dia')
    let type        = document.getElementById('tipo')
    let description = document.getElementById('descricao')
    let value       = document.getElementById('valor')

    let expense = new Expense(
        year.value,
        month.value,
        day.value,
        type.value,
        description.value,
        value.value
        )

        if(expense.validate() == true){
            //Success
            bd.record(expense)

            //Removes classes that previously existed
            document.getElementById("ModalTitle").classList.remove('text-danger');
            document.getElementById("btnModal").classList.remove('btn-danger');
            //create a new class 
            document.getElementById("ModalTitle").classList.add('text-success');
            document.getElementById("btnModal").classList.add('btn-success');
            document.getElementById('ModalTitle').innerHTML = 'Gravado com sucesso'
            document.getElementById('ModalText').innerHTML = 'Os dados foram prenchidos corretamente!'
            $('#ModalExpense').modal('show')
            ano.value       = ''
            mes.value       = ''
            dia.value       = ''
            tipo.value      = ''
            descricao.value = ''
            valor.value     = ''
        }
        else{

            //same here
            document.getElementById("ModalTitle").classList.remove('text-success');
            document.getElementById("btnModal").classList.remove('btn-success');
            //:p
            document.getElementById("ModalTitle").classList.add('text-danger');
            document.getElementById("btnModal").classList.add('btn-danger');
            document.getElementById('ModalTitle').innerHTML = 'Erro na gravação'
            document.getElementById('ModalText').innerHTML = 'Os campos obrigatorios não foram prenchidos'
            $('#ModalExpense').modal('show')
            //erro 
            
        }

}

function loadList(expenses = Array() , filter = false){
    if(expenses.length == 0 && filter == false){
       expenses = bd.retrieveRecords()
    }

    let expenseList = document.getElementById('ExpenseList')
    expenseList.innerHTML = ''

    expenses.forEach(function(d) {
        //Create TR 
        let line = expenseList.insertRow()
        //create TD
        line.insertCell(0).innerHTML = `${d.day}/${d.month}/${d.year} `
        switch(d.type){
            case '1': d.type = 'Alimentação'
                break
            case '2': d.type = 'Educação'
                break
            case '3': d.type = 'Lazer'
                break
            case '4': d.type = 'Saúde'
                break
            case '5': d.type = 'Transporte'
                break
        }
        line.insertCell(1).innerHTML = d.type
        line.insertCell(2).innerHTML = d.description
        line.insertCell(3).innerHTML = d.value
        //delete button 
        let btn = document.createElement("button")
        btn.id = `id_expense_${d.id}`
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class ="fas fa-times" </i>' 
        btn.onclick = function(){ // remove expense
            let id = this.id.replace('id_expense_' , '')
            bd.remove(id)
            //--------------------- MODAL ---------------------
            //Removes classes that previously existed
            document.getElementById("ModalTitle").classList.remove('text-danger');
            document.getElementById("btnModal").classList.remove('btn-danger');
            //create a new class 
            document.getElementById("ModalTitle").classList.add('text-success');
            document.getElementById("btnModal").classList.add('btn-success');
            document.getElementById('ModalTitle').innerHTML = 'Excluido com Sucesso!'
            document.getElementById('ModalText').innerHTML = 'Os dados foram Excluidos'
            $('#ModalExpense').modal('show')
            //END  --------------------------- ----------------
          
        }
        line.insertCell(4).append(btn)
    })
}

function searchExpense (){
    let year         = document.getElementById('ano').value
    let month        = document.getElementById('mes').value
    let day          = document.getElementById('dia').value
    let type         = document.getElementById('tipo').value
    let description  = document.getElementById('descricao').value
    let value        = document.getElementById('valor').value

    let expense = new Expense(
        year,
        month,
        day,
        type,
        description,
        value,
    )
    
    let expenses =  bd.search(expense)
    loadList(expenses, true)
    

}
