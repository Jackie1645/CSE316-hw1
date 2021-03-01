'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class ChangeStatus_Transaction extends jsTPS_Transaction {
    constructor(initModel, oldStatus, newStatus, id) {
        super();
        this.model = initModel;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
        this.id = id;
    }

    doTransaction() {
        this.model.changeStatus(this.newStatus, this.id);
    }

    undoTransaction() {
        this.model.changeStatus(this.oldStatus, this.id);
    }
}