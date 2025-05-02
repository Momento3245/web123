export default class Survey {
    constructor(name) {
        this.id = Math.round(Math.random() * 100000).toString();
        this.name = name;
        this.responsible = 0;
        this.img = null;
        this.background = "#FFFFFF";
        this.date = new Date();
        this.status = false;
        this.shown = false;

        this.quests = [];

        this.onChangeCallback = null;
        return this.initOnModelChange();
    }

    addOption(id)
    {
        this.quests[id].options.push('');       
    }

    deleteOption(i, j)
    {
        this.quests[i].deleteOption(j);
    }

    addQuest(question)
    {
        question.onChangeCallback = this.onChangeCallback;
        this.quests.push(question);
    }

    toggleDone() {
        this.status = !this.status;
        return this.status;
    }
    
    show()
    {
        this.shown = false;
    }

    toggleVision(status)
    {
        this.shown = status;
        return this.shown;
    }

    setOnChangeCallback() {
        
        this.onChangeCallback = onChangeCallback;
    }

    initOnModelChange() {
        let handler = {
            set: (obj, prop, val) => {
                obj[prop] = val;
                if (this.onChangeCallback) this.onChangeCallback(this);
                return true;
            }
        }
        return new Proxy(this, handler);
    }
}