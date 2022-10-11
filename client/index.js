
// to get data on loading the DOM
document.addEventListener('DOMContentLoaded',()=>{
    fetch('http://localhost:5000/getAll')
    .then(response => response.json())
    .then(data =>  loadHTMLTable(data['data']));
});

const add_btn = document.querySelector('.add-name-btn');
add_btn.addEventListener('click',()=>{
    const nameInput = document.querySelector('#input-name');
    const name = nameInput.value;
    nameInput.value = "";

    fetch("http://localhost:5000/insert" ,{
        headers:{
            'content-type':'application/json'
        },
        method: 'POST',
        body: JSON.stringify({name:name})
    })
    .then(response => response.json())
    .then(data => insertNewRow(data['data']));


})

function insertNewRow(data){
    let tbody = document.querySelector('.tbody');
    const isTableBody = document.querySelector('.noData');

    let tableHtml = "";
    tableHtml += '<tr>';
    for(key in data){
        if(data.hasOwnProperty(key)){
            if(key === 'dateAdded'){
                data[key] = new Date(data[key]).toDateString();
            }
            tableHtml += `<td>${data[key]}</td>`
        }
    }
    tableHtml += `<td><button class="delete-row-btn" data-id=${data.id}>delete</button></td>`
    tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>edit</button></td>`
    tableHtml +='</tr>'

    if(isTableBody){
        tbody.innerHTML = tableHtml;
    }
    else{
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }
}
function loadHTMLTable(data){
    let tbody = document.querySelector('.tbody');
    if(data.length === 0){
        tbody.innerHTML = `<tr><td id="noData" colspan='5'>NO DATA</td></tr>`;
        return;
    }
    let tableHtml = '';
    data.forEach(({id,name,dateAdded}) => {
        tableHtml += '<tr>'
        tableHtml += `<td>${id}</td>`
        tableHtml += `<td>${name}</td>`
        tableHtml += `<td>${new Date(dateAdded).toDateString()}</td>`
        tableHtml += `<td><button class="delete-row-btn" data-id=${id}>delete</button></td>`
        tableHtml += `<td><button class="edit-row-btn" data-id=${id}>edit</button></td>`
        tableHtml += '</tr>'
    });
    tbody.innerHTML = tableHtml;
}

document.querySelector('table tbody').addEventListener('click', function (event){
    // console.log(event.target.dataset.id);
    if(event.target.className === "delete-row-btn"){
        deleteRowById(event.target.dataset.id);
    }
    else if(event.target.className === "edit-row-btn"){
        updateRowByID(event.target.dataset.id);
    }
})



function deleteRowById(id){
    fetch("http://localhost:5000/delete/" + id,{
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            location.reload();
        }
    });

}


function updateRowByID(id){
    const updateRowSection = document.querySelector('#updateRow');
    updateRowSection.hidden = false;
    document.querySelector('#update-row-btn').dataset.id = id;
}

const updateRowBtn = document.querySelector('#update-row-btn');
updateRowBtn.addEventListener('click',()=>{
    const updateInputName = document.querySelector('#edit-row-input');
    const updatedName = updateInputName.value;

    fetch("http://localhost:5000/update",{
        headers:{
            'content-type' : 'application/json'
        },
        body: JSON.stringify({
            name : updatedName,
            id: updateRowBtn.dataset.id
        }),
        method:'PUT'
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            location.reload();
        }
    })
})


const searchBtn = document.querySelector('#search-name-btn');
searchBtn.addEventListener('click' , ()=>{
    const searchInput = document.querySelector('#search-input').value;
    fetch("http://localhost:5000/search/" +searchInput)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']))
})