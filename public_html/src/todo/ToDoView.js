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
            for (var i = 0; i < listsElement.children.length; i++) {
                listsElement.children.item(i).style.backgroundColor = "";
                listsElement.children.item(i).style.color = "white";
            }
            thisController.handleLoadList(newList.id);
            listElement.style.backgroundColor = "rgb(255,200,25)";
            listElement.style.color = "black";

            thisController.canControlLists = true;
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
        
        
    }

    // THE VIEW NEEDS THE CONTROLLER TO PROVIDE PROPER RESPONSES
    setController(initController) {
        this.controller = initController;
    }
}