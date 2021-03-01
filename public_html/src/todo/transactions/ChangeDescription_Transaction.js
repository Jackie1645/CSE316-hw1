'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class ChangeDescription_Transaction extends jsTPS_Transaction {
    constructor(initModel, oldText, newText, id) {
        super();
        this.model = initModel;
        this.oldText = oldText;
        this.newText = newText;
        this.id = id;
    }

    doTransaction() {
        this.model.changeTaskDesc(this.newText, this.id);
    }

    undoTransaction() {
        this.model.changeTaskDesc(this.oldText, this.id);
    }
}