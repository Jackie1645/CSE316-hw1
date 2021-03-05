'use strict'

/**
 * ToDoView
 * 
 * This class generates all HTML content for the UI.
 */
export default class ToDoView {
    constructor() {}

    // ADDS A LIST TO SELECT FROM IN THE LEFT SIDEBAR
    appendNewListToView(newList) {
        // GET THE UI CONTROL WE WILL APPEND IT TO
        let listsElement = document.getElementById("todo-lists-list");

        // MAKE AND ADD THE NODE
        let newListId = "todo-list-" + newList.id;
        let listElement = document.createElement("div");
        listElement.setAttribute("id", newListId);
        listElement.setAttribute("class", "todo_button");

        listElement.style.display = "flex";
        listElement.style.alignContent = "center";
        listElement.style.justifyContent = "center";
        listElement.style.minHeight = "40px";

        listElement.appendChild(document.createTextNode(newList.name));
        listsElement.appendChild(listElement);

        // SETUP THE HANDLER FOR WHEN SOMEONE MOUSE CLICKS ON OUR LIST
        let thisController = this.controller;
        listElement.onmousedown = function() {
            window.localStorage.setItem("view", true);

            thisController.model.tps.clearAllTransactions();

            for (var i = 0; i < listsElement.children.length; i++) {
                listsElement.children.item(i).style.backgroundColor = "";
                listsElement.children.item(i).style.color = "white";
            }
            thisController.handleLoadList(newList.id);
            listElement.style.backgroundColor = "rgb(255,200,25)";
            listElement.style.color = "black";

            listsElement.insertBefore(listElement, listsElement.children.item(0));
        }
    }

    // REMOVES ALL THE LISTS FROM THE LEFT SIDEBAR
    clearItemsList() {
        let itemsListDiv = document.getElementById("todo-list-items-div");
        // BUT FIRST WE MUST CLEAR THE WORKSPACE OF ALL CARDS BUT THE FIRST, WHICH IS THE ITEMS TABLE HEADER
        let parent = itemsListDiv;
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    // REFRESHES ALL THE LISTS IN THE LEFT SIDEBAR
    refreshLists(lists) {
        // GET THE UI CONTROL WE WILL APPEND IT TO
        let listsElement = document.getElementById("todo-lists-list");
        listsElement.innerHTML = "";

        for (let i = 0; i < lists.length; i++) {
            let list = lists[i];
            this.appendNewListToView(list);
        }
    }

    // LOADS THE list ARGUMENT'S ITEMS INTO THE VIEW
    viewList(list) {
        // WE'LL BE ADDING THE LIST ITEMS TO OUR WORKSPACE
        let itemsListDiv = document.getElementById("todo-list-items-div");

        // GET RID OF ALL THE ITEMS
        this.clearItemsList();
        
        //rgb(233,237,240)
        for (let i = 0; i < list.items.length; i++) {
            // NOW BUILD ALL THE LIST ITEMS
            let listItem = list.items[i];
            let listItemElement = "<div id='todo-list-item-" + listItem.id + "' class='list-item-card'>"
                                + "<div class='task-col' contenteditable = true>" + listItem.description + "</div>"
                                + "<div class='due-date-col'> <input type= \"date\" value = \"" + listItem.dueDate + "\" style='background-color:#40454e; border:none; color:#e9edf0;'> </div>"
                                + `<div class='status-col'> <select name = 'Completion' style ='background-color:#40454e;border:none;color:${listItem.status == "incomplete" ? "yellow" : "#ADD8E6"};'>`
                                + ((listItem.status == "complete") ?
                            
                                    "<option style='color:white;' value = 'incomplete'>incomplete</option> \
                                    <option style='color:white;' value = 'complete' selected>complete</option> </select></div>"
                                : 
                                    "<option style='color:white;' value = 'incomplete' selected>incomplete</option> \
                                    <option style='color:white;' value = 'complete' >complete</option> </select></div>")
                                + "<div class='list-controls-col'>"

                                + " <div class='list-item-control material-icons'>keyboard_arrow_up</div>"
                                + " <div class='list-item-control material-icons'>keyboard_arrow_down</div>"
                                + " <div class='list-item-control material-icons'>close</div>"
                                + " <div class='list-item-control'></div>"
                                + " <div class='list-item-control'></div>"
                                + "</div>";
            itemsListDiv.innerHTML += listItemElement;
        }

        let thisController = this.controller;

        document.getElementById("add-item-button").style.color = "";
        document.getElementById("delete-list-button").style.color = "";
        document.getElementById("close-list-button").style.color = "";

        document.getElementById("add-item-button").onmousedown = function() {
            thisController.model.addNewItemTransaction();
        }
        document.getElementById("delete-list-button").onmousedown = function() {
            window.localStorage.setItem("view", false);

            var modal = document.getElementById("myModal");
            var span = document.getElementsByClassName("close")[0];
            var confirm = document.getElementsByClassName("modalConfirm")[0];
            modal.style.display = "block";
            span.onclick = function() {
                modal.style.display = "none";
            }
            confirm.onclick = function() {
                thisController.model.removeCurrentList();
                modal.style.display = "none";
            }
            window.onclick = function(event) {
                if (event.target == modal) {
                  modal.style.display = "none";
                }
            }
        }

        document.getElementById("close-list-button").onmousedown = function() {
            window.localStorage.setItem("view", false);
            let grid = document.getElementById('todo-list-items-div');
            while (grid.hasChildNodes()) {
                grid.removeChild(grid.firstChild);
            }
            let listsElement = document.getElementById("todo-lists-list");
            for (var i = 0; i < listsElement.children.length; i++) {
                listsElement.children.item(i).style.backgroundColor = "";
                listsElement.children.item(i).style.color = "white";
            }
        }


        let description = document.getElementsByClassName("task-col");
        for (let i = 0; i < description.length; i++) {
            if (description[i].id == "close-list-button") {
                continue;
            }
            description[i].onblur = function(mv) {
                var old = thisController.model.currentList.getItembyID(description[i].parentElement.id.slice(15)).getDescription();
                thisController.handleTaskChange(old, mv.target.innerHTML, description[i].parentElement.id.slice(15));
            }
        }

        let dates = document.getElementsByClassName("due-date-col");
        for (let i = 0; i < dates.length; i++) {
            if (dates[i].id == "date-col-header") {
                continue;
            }
            dates[i].onchange = function() {
                var old = thisController.model.currentList.getItembyID(description[i].parentElement.id.slice(15)).getDueDate();
                thisController.handleDateChange(old, dates[i].children[0].value, dates[i].parentElement.id.slice(15));
            }
        }

        let states = document.getElementsByClassName("status-col");
        for (let i = 0; i < states.length; i++) {
            if (states[i].id == "status-col-header") {
                continue;
            }
            states[i].onchange = function() {
                var old = thisController.model.currentList.getItembyID(description[i].parentElement.id.slice(15)).getStatus();
                thisController.handleStatusChange(old, states[i].firstElementChild.value, states[i].parentElement.id.slice(15));
            }
        }

        let status = document.getElementsByClassName("status-col");
        for (let i = 0; i < status.length; i++) {
            if (i == 0) continue;
            let state = status[i].firstElementChild;
            state.onchange = ()=> {
                if (state.value == "incomplete") {
                    state.style.color = "yellow";
                }
                else {
                    state.style.color = "#ADD8E6";
                }
            }
        }


        
        let direction = document.getElementsByClassName("list-item-control material-icons");
        for (let i = 0; i < direction.length; i++) {
            let item = direction[i].parentElement.parentElement;
            if (direction[i].innerHTML == "keyboard_arrow_up") {
                if (i == 3) {
                    direction[i].style.color = "rgb(128,128,128)";
                    continue;
                }
                direction[i].onclick = function() {
                    thisController.handleListUp(item.id.slice(15));
                }
            }
            if (direction[i].innerHTML == "keyboard_arrow_down") {
                if (i == direction.length - 2) {
                    direction[i].style.color = "rgb(128,128,128)";
                    continue;
                }
                direction[i].onclick = function() {
                    thisController.handleListDown(item.id.slice(15));
                }
            }
            if (direction[i].innerHTML == "close") {
                if (direction[i].id == "close-list-button") {
                    continue;
                }
                direction[i].onclick = function() {
                    let deletion = thisController.model.currentList.getItembyID(item.id.slice(15));
                    let elem = thisController.model.currentList.getItembyID(item.id.slice(15));
                    let index = thisController.model.currentList.getIndexOfItem(elem);
                    thisController.handleItemDeletion(deletion.getDescription(), deletion.getDueDate(), deletion.getStatus(), item.id.slice(15), index);
                }
            }
        }
        
    }

    // THE VIEW NEEDS THE CONTROLLER TO PROVIDE PROPER RESPONSES
    setController(initController) {
        this.controller = initController;
    }
}