'use strict'

/**
 * ToDoController
 * 
 * This class serves as the event traffic manager, routing all
 * event handling responses.
 */
export default class ToDoController {    
    constructor() {}

    setModel(initModel) {
        this.model = initModel;
        let appModel = this.model;

        // SETUP ALL THE EVENT HANDLERS SINCE THEY USE THE MODEL
        document.getElementById("add-list-button").onmousedown = function() {
            appModel.addNewList();
        }
        document.getElementById("undo-button").onmousedown = function() {
            appModel.undo();
        }
        document.getElementById("redo-button").onmousedown = function() {
            appModel.redo();
        }
        document.getElementById("delete-list-button").onmousedown = function() {
            var modal = document.getElementById("myModal");
            var span = document.getElementsByClassName("close")[0];
            var confirm = document.getElementsByClassName("modalConfirm")[0];
            modal.style.display = "block";
            span.onclick = function() {
                modal.style.display = "none";
            }
            confirm.onclick = function() {
                appModel.removeCurrentList();
                modal.style.display = "none";
            }
            window.onclick = function(event) {
                if (event.target == modal) {
                  modal.style.display = "none";
                }
            } 
        }
        document.getElementById("add-item-button").onmousedown = function() {
            appModel.addNewItemTransaction();
        }
        document.getElementById("close-list-button").onmousedown = function() {
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
    }
    
    // PROVIDES THE RESPONSE TO WHEN A USER CLICKS ON A LIST TO LOAD
    handleLoadList(listId) {
        // UNLOAD THE CURRENT LIST AND INSTEAD LOAD THE CURRENT LIST
        this.model.loadList(listId);
    }

    handleListUp(listItemId) {
        this.model.moveItemUpTransaction(listItemId);
    }

    handleListDown(listItemId) {
        this.model.moveItemDownTransaction(listItemId);
    }
    
    handleTaskChange(oldDesc, newDesc, id) {
        this.model.changeDescTransaction(oldDesc, newDesc, id);
    }

    handleDateChange(oldDate, newDate, id) {
        this.model.changeDateTransaction(oldDate, newDate, id);
    }

    handleStatusChange(oldStatus, newStatus, id) {
        this.model.changeStatusTransaction(oldStatus, newStatus, id);
    }

    handleItemDeletion(oldDesc, oldDate, oldStatus, id, index) {
        this.model.removeItemTransaction(oldDesc, oldDate, oldStatus, id, index);
    }
}