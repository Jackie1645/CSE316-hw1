'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class ChangeDueDate_Transaction extends jsTPS_Transaction {
    constructor(initModel, oldDate, newDate, id) {
        super();
        this.model = initModel;
        this.oldDate = oldDate;
        this.newDate = newDate;
        this.id = id;
    }

    doTransaction() {
        this.model.changeDate(this.newDate, this.id);
    }

    undoTransaction() {
        this.model.changeDate(this.oldDate, this.id);
    }
}