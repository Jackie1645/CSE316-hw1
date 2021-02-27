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
            thisController.handleLoadList(newList.id);
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
                                + "<div class='status-col'> <select name = 'Completion' style ='background-color:#40454e;border:none;color:#e9edf0;'>"
                                + ((listItem.status == "complete") ?
                            
                                    "<option value = 'incomplete'>incomplete</option> \
                                    <option value = 'complete' selected>complete</option> </select></div>"
                                : 
                                    "<option value = 'incomplete' selected>incomplete</option> \
                                    <option value = 'complete' >complete</option> </select></div>")
                                + "<div class='list-controls-col'>"

                                + " <div class='list-item-control material-icons'>keyboard_arrow_up</div>"
                                + " <div class='list-item-control material-icons'>keyboard_arrow_down</div>"
                                + " <div class='list-item-control material-icons'>close</div>"
                                + " <div class='list-item-control'></div>"
                                + " <div class='list-item-control'></div>"
                                + "</div>";
            itemsListDiv.innerHTML += listItemElement;
        }

        for (let i = 0; i < list.items.length; i++) {
            
            let listItemElement = document.getElementsByClassName("list-item-control material-icons");
            if (listItemElement[i].innerHTML == "keyboard_arrow_up") {
                let up = listItemElement[i];
                up.addEventListener("click,", function() {
                    //let list = up.parentElement.parentElement;
                });
            }
            //console.log(list.items[i].status);
            //listItemElement.addEventListener("click", function() {
                
            //});
        }
    }

    // THE VIEW NEEDS THE CONTROLLER TO PROVIDE PROPER RESPONSES
    setController(initController) {
        this.controller = initController;
    }
}