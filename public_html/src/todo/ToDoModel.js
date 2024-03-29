'use strict'

import ToDoList from './ToDoList.js'
import ToDoListItem from './ToDoListItem.js'
import jsTPS from '../common/jsTPS.js'
import AddNewItem_Transaction from './transactions/AddNewItem_Transaction.js'
import MoveItemUp_Transaction from './transactions/MoveItemUp_Transaction.js'
import MoveItemDown_Transaction from './transactions/MoveItemDown_Transaction.js'
import ChangeDescription_Transaction from './transactions/ChangeDescription_Transaction.js'
import ChangeDueDate_Transaction from './transactions/ChangeDueDate_Transaction.js'
import ChangeStatus_Transaction from './transactions/ChangeStatus_Transaction.js'
import DeleteItem_Transaction from './transactions/DeleteItem_Transaction.js'

/**
 * ToDoModel
 * 
 * This class manages all the app data.
 */
export default class ToDoModel {
    constructor() {
        // THIS WILL STORE ALL OF OUR LISTS
        this.toDoLists = [];

        // THIS IS THE LIST CURRENTLY BEING EDITED
        this.currentList = null;

        // THIS WILL MANAGE OUR TRANSACTIONS
        this.tps = new jsTPS();

        // WE'LL USE THIS TO ASSIGN ID NUMBERS TO EVERY LIST
        this.nextListId = 0;

        // WE'LL USE THIS TO ASSIGN ID NUMBERS TO EVERY LIST ITEM
        this.nextListItemId = 0;
    }

    /**
     * addItemToCurrentList
     * 
     * This function adds the itemToAdd argument to the current list being edited.
     * 
     * @param {*} itemToAdd A instantiated item to add to the list.
     */
    addItemToCurrentList(itemToAdd) {
        this.currentList.push(itemToAdd);
    }

    /**
     * addNewItemToCurrentList
     * 
     * This function adds a brand new default item to the current list.
     */
    addNewItemToCurrentList() {
        let newItem = new ToDoListItem(this.nextListItemId++);
        this.addItemToList(this.currentList, newItem);
        return newItem;
    }

    /**
     * addItemToList
     * 
     * Function for adding a new item to the list argument using the provided data arguments.
     */
    addNewItemToList(list, initDescription, initDueDate, initStatus) {
        let newItem = new ToDoListItem(this.nextListItemId++);
        newItem.setDescription(initDescription);
        newItem.setDueDate(initDueDate);
        newItem.setStatus(initStatus);
        list.addItem(newItem);
        if (this.currentList) {
            this.view.viewList(list);
        }
        return newItem;
    }

    /**
     * addNewItemTransaction
     * 
     * Creates a new transaction for adding an item and adds it to the transaction stack.
     */
    addNewItemTransaction() {
        let transaction = new AddNewItem_Transaction(this);
        this.tps.addTransaction(transaction);
    }

    moveItemUpTransaction(id) {
        let transaction = new MoveItemUp_Transaction(this, id);
        this.tps.addTransaction(transaction);
    }

    moveItemDownTransaction(id) {
        let transaction = new MoveItemDown_Transaction(this, id);
        this.tps.addTransaction(transaction);
    }

    changeDescTransaction(oldDesc, newDesc, id) {
        let transaction = new ChangeDescription_Transaction(this, oldDesc, newDesc, id);
        this.tps.addTransaction(transaction);
    }
    
    changeDateTransaction(oldDate, newDate, id) {
        let transaction = new ChangeDueDate_Transaction(this, oldDate, newDate, id);
        this.tps.addTransaction(transaction);
    }

    changeStatusTransaction(oldStatus, newStatus, id) {
        let transaction = new ChangeStatus_Transaction(this, oldStatus, newStatus, id);
        this.tps.addTransaction(transaction);
    }

    removeItemTransaction(oldDesc, oldDate, oldStatus, id, index) {
        let transaction = new DeleteItem_Transaction(this, oldDesc, oldDate, oldStatus, id, index);
        this.tps.addTransaction(transaction);
    }

    /**
     * addNewList
     * 
     * This function makes a new list and adds it to the application. The list will
     * have initName as its name.
     * 
     * @param {*} initName The name of this to add.
     */
    addNewList(initName) {
        let newList = new ToDoList(this.nextListId++);
        if (initName)
            newList.setName(initName);
        this.toDoLists.push(newList);
        this.view.appendNewListToView(newList);
        return newList;
    }

    /**
     * Adds a brand new default item to the current list's items list and refreshes the view.
     */
    addNewItem() {
        let newItem = new ToDoListItem(this.nextListItemId++);
        this.currentList.items.push(newItem);
        this.view.viewList(this.currentList);
        return newItem;
    }

    /**
     * Makes a new list item with the provided data and adds it to the list.
     */
    loadItemIntoList(list, description, due_date, assigned_to, completed) {
        let newItem = new ToDoListItem();
        newItem.setDescription(description);
        newItem.setDueDate(due_date);
        newItem.setAssignedTo(assigned_to);
        newItem.setCompleted(completed);
        this.addItemToList(list, newItem);
    }

    /**
     * Load the items for the listId list into the UI.
     */
    loadList(listId) {
        let listIndex = -1;
        for (let i = 0; (i < this.toDoLists.length) && (listIndex < 0); i++) {
            if (this.toDoLists[i].id === listId)
                listIndex = i;
        }
        if (listIndex >= 0) {
            let listToLoad = this.toDoLists[listIndex];
            this.currentList = listToLoad;
            this.view.viewList(this.currentList);
        }
    }

    

    /**
     * Redo the current transaction if there is one.
     */
    redo() {
        if (this.tps.hasTransactionToRedo()) {
            this.tps.doTransaction();
        }
    }   

    /**
     * Remove the itemToRemove from the current list and refresh.
     */
    removeItem(itemToRemove) {
        this.currentList.removeItem(itemToRemove);
        this.view.viewList(this.currentList);
    }

    /**
     * Finds and then removes the current list.
     */
    removeCurrentList() {
        let indexOfList = -1;
        for (let i = 0; (i < this.toDoLists.length) && (indexOfList < 0); i++) {
            if (this.toDoLists[i].id === this.currentList.id) {
                indexOfList = i;
            }
        }
        this.toDoLists.splice(indexOfList, 1);
        this.currentList = null;
        this.view.clearItemsList();
        this.view.refreshLists(this.toDoLists);
    }

    getIndex(item) {
        for (let i = 0; i < this.currentList.length; i++) {
            if (this.currentList[i] == item) return i;
        }
        return null;
    }

    // WE NEED THE VIEW TO UPDATE WHEN DATA CHANGES.
    setView(initView) {
        this.view = initView;
    }

    /**
     * Undo the most recently done transaction if there is one.
     */
    undo() {
        if (this.tps.hasTransactionToUndo()) {
            this.tps.undoTransaction();
        }
    }

    changeTaskDesc(newDes, id) {
        this.currentList.getItembyID(id).setDescription(newDes);
        this.view.viewList(this.currentList);
    }

    changeDate(newDate, id) {
        this.currentList.getItembyID(id).setDueDate(newDate);
        this.view.viewList(this.currentList);
    }

    changeStatus(newStatus, id) {
        this.currentList.getItembyID(id).setStatus(newStatus);
        this.view.viewList(this.currentList);
    }

    moveUp(id) {
        let item = this.currentList.getItembyID(id);
        let index = this.currentList.getIndexOfItem(item);
        if (index <= 0) {
            return;
        }
        this.currentList.swap(index, index - 1);
        this.view.viewList(this.currentList);
    }
    
    moveDown(id) {
        let item = this.currentList.getItembyID(id);
        let index = this.currentList.getIndexOfItem(item);
        if (index >= this.currentList.items.length - 1) {
            return;
        }
        this.currentList.swap(index, index + 1);
        this.view.viewList(this.currentList);
    }

    closeItem(id) {
        this.currentList.removeItem(this.currentList.getItembyID(id));
        this.view.viewList(this.currentList);
    }
}