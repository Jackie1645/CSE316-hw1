'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class DeleteItem_Transaction extends jsTPS_Transaction {
    constructor(initModel, oldDesc, oldDate, oldStatus, oldID, oldIndex) {
        super();
        this.model = initModel;
        this.desc = oldDesc;
        this.date = oldDate;
        this.status = oldStatus;
        this.id = oldID;
        this.index = oldIndex;
    }

    doTransaction() {
        this.model.closeItem(this.id);
    }

    undoTransaction() {
        let item = this.model.addNewItemToList(this.model.currentList, this.desc, this.date, this.status);
        while (this.model.currentList.getIndexOfItem(item) > this.index) {
            this.model.moveUp(item.getId());
        }
        //item.setId(this.id);
        this.id = item.getId();
    }
}