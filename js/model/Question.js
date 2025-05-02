export default class question {
    constructor(type, id) {
        this.id = id;
        this.onChangeCallback = null;
        this.type = type;
        this.question = "";
        this.description = "";
        if(this.type == 3){
            this.options = [];
        } else {
            this.options = ['', ''];
        }
        
    }


    deleteOption(i)
    {
        if(this.options.length > 2) {
            this.options.splice(i, 1);
        }
    }
    
}