import Survey from "../model/Survey.js";
import question from "../model/Question.js";
import Profile from "../model/profile.js";


export default class ListModel {
    constructor() {
        this.surveys = [];
        this.onChangeCallback = null;
        const metaDescription = document.querySelector('meta[name="description"]').getAttribute('content');
        if(metaDescription === 'profile') {
            this.person = null;
        }
    }


    SaveData(data, names, descriptions)
    {
        for (let i = 0; i < data.length && i < this.surveys[0].quests.length; i++) {
            for (let j = 0; j < data[i].length && j < this.surveys[0].quests[i].options.length; j++) {
                this.surveys[0].quests[i].options[j] = data[i][j];
            }
            this.surveys[0].quests[i].question = names[i];
            this.surveys[0].quests[i].description = descriptions[i];
            
        }
    }

    CheakAllnames()
    {
        let empty = [];
        this.surveys[0].quests.forEach((question, i) => 
        {
            if(!/\S/.test(question.question)){
                empty.push(i + 1);
            }
        })
        return empty;
    }

    CheakAllOptions()
    {
        let empty = [];
        this.surveys[0].quests.forEach((question, i) => 
        {
            empty.push([i + 1, []]);
            question.options.forEach((option, j) => {
                if(!/\S/.test(option)){
                    empty[empty.length - 1][1].push(j);
                }
            })
            if(empty[empty.length - 1][1].length === 0){
                empty.pop();
            }
        })
        return empty;
    }

    setPerson()
    {
        this.person = new Profile();
    }

    add(title) {
        let survey =  new Survey(title);
        survey.onChangeCallback = this.onChangeCallback;
        this.surveys.push(survey);
    }
  
    delete(SurveyID) {
        const SurveyIndex = this.surveys.findIndex( (Survey) => Survey.id === SurveyID); 
        this.surveys.splice(SurveyIndex, 1);
    }

    searchSurvey(searched){
        this.surveys.forEach(survey => {
            if(survey.name.indexOf(searched) === -1){
                survey.toggleVision(true);
            }
            else {
                survey.toggleVision(false);
            }
    
        });
    }

    input(id, value)
    {
        const matches = id.match(/\d+/g);
        this.inputs[parseInt(matches[0])][parseInt(matches[1])] = value;
       
    }

    filter(data)
    {

        if(data[0] !== ""){
            this.surveys.forEach(survey => {
                if(survey.responsible < data[0]){
                    survey.toggleVision(true);
                }
            })
        }

        if(data[1] !== ""){
            this.surveys.forEach(survey => {
                if(survey.responsible > data[1]){
                    survey.toggleVision(true);
                }
            })
        }

        if(data[2] !== ""){
            this.surveys.forEach(survey => {
                if(survey.quests.length < data[2]){
                    survey.toggleVision(true);
                }
            })
        }

        if(data[3] !== ""){
            this.surveys.forEach(survey => {
                if(survey.quests.length > data[3]){
                    survey.toggleVision(true);
                }
            })
        }
        
       

        if(!isNaN(data[4])){
            this.surveys.forEach(survey => {
                if(survey.date < data[4]){
                    survey.toggleVision(true);
                }
            })
        }

        if(!isNaN(data[5])){
            this.surveys.forEach(survey => {
                if(survey.date > data[5]){
                    survey.toggleVision(true);
                }
            })
        }
    }

    CheackIdenticalQuestions()
    {
        let error = [];
        let names = []
        this.surveys[0].quests.forEach((quest, i) => {
            if(names.indexOf(quest.question) !== -1) {
                error.push([names.indexOf(quest.question), i]);
            } else {
                names.push(quest.question);
            }
        })
        return error;
    }

    CheackIdenticalOption()
    {
        let error = [];
        this.surveys[0].quests.forEach((quest, i) => 
        {
            let uniqueElements  = new Set(quest.options);
            if(uniqueElements.size !== quest.options.length) {
                error.push(i);
            }
        })
        return error;
    }

    CheackMinMax()
    {
        let error = [];
        this.surveys[0].quests.forEach((quest, i) =>{
            if(quest.type === 2)
            {
                if(parseFloat(quest.options[0]) > parseFloat(quest.options[1])){
                    error.push(i);
                }
            }
        })
        return error;
    }

    cheackNun()
    {
        let error = [];
        this.surveys[0].quests.forEach((quest, i) =>{
            if(quest.type === 2)
            {
                error.push([i, []]);
                if(isNaN(quest.options[0])){
                    error[error.length - 1][1].push(quest.options[0]);
                }
                if(isNaN(quest.options[1])){
                    error[error.length - 1][1].push(quest.options[1]);
                }

                if(error[error.length - 1][1].length === 0){
                    error.pop();
                }
            }
        })
        return error;
    }

    addQuest(type)
    {
        const quest = new question(type, this.GetLastId() + 1);
        this.surveys[0].addQuest(quest);
    }

    deleteQuest(id)
    {
        this.surveys[0].quests.splice(id, 1);
         for(let i = id; i < this.surveys[0].quests.length; i++) {
            this.surveys[0].quests[i].id--;
        }
    }

    addOPtion(id)
    {
        this.surveys[0].addOption(id);
    }

    deleteOption(id, i)
    {
        this.surveys[0].deleteOption(id, i);
    }

    edit(SurveyID, data){
        for(let item of this.surveys)
        {
            if(item.id === SurveyID)
            {
                if(data[0] !== null){
                    item.img = data[0]; 
                }
                if(data[1] !== null){
                    item.name = data[1];
                }
                item.background = data[2];
                return;
            }
        }
    }

    showSurveys()
    {
        this.surveys.forEach(survey => {
            survey.show()})
    }

    hideSurvey(id)
    {
        this.surveys.map((Survey) =>{
            if(id.indexOf(Survey.id) > -1) {
                Survey.toggleVision(true);
                return; 
            } 
        })
    }
   
    GetSurvey(SurveyID){
        for(let item of this.surveys)
        {
            if(item.id === SurveyID)
            {
                return item;
            }
        }
        
    }

    setInfo(name, desc)
    {
        this.surveys[0].name = name;
        this.surveys[0].description = desc;
        this.surveys[0].date = new Date();
        this.surveys[0].status = true; 
    }

    GetProfileInfo(){
        let date = this.person.birthday;
        let info = [this.person.nickname, this.person.name, this.person.surname, this.person.email,
                    `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`, this.person.country,
                    this.person.laguenge, this.person.AboutMe, this.person.avatare];
        return info;
    }

    GetLastId()
    {
        if(this.surveys[0].quests.length === 0){
            return -1;
        }
        return this.surveys[0].quests[this.surveys[0].quests.length - 1].id;
    }

    GetLastOpt(id)
    {
        return this.surveys[0].quests[id].options.length - 1;
    }

    SetProfileInfo(data)
    {
        const start = 'nickname';
        const end = 'laguenge';
        let itering = false;
        let i = 0;
        for(let key in this.person){
            if(key == start){
                itering = true;
            }

            if(itering){
                this.person[key] = data[i];
                i++;
            }

            if(key = end){
                break;
            }
        }
    }

    toggleDone(SurveyIdList) {
        this.surveys.map( (Survey) => {
            if (SurveyIdList.indexOf(Survey.id) > -1) Survey.toggleDone();
         }); 
    }

    setOnChangeCallback(onChangeCallback) {
        this.onChangeCallback = onChangeCallback;
    }

    
}