
export default class Controller {
    constructor(SurveyListModel, SurveyListView) {
        this.SurveyListModel = SurveyListModel;
        this.SurveyListView = SurveyListView;
        
        this.SearchInput = "";

        const metaDescription = document.querySelector('meta[name="description"]').getAttribute('content');
       
        if(metaDescription === "Public") {
            this.InitPublic();
        } else if(metaDescription === "Main") {
            this.InitMain();
        } else if(metaDescription === "profile") {
            this.InitProfile();
        } else if (metaDescription === "Workplace") {
            this.InitWorkplace()
        }
    }
    
    InitPublic()
    {
        this.main = "main";
        this.SurveyListModel.setOnChangeCallback((e) => this.onChangeCallback(e));
        this.SearchInput = 'SearchText';
        document.querySelector('#SearchBtn').addEventListener('click', ()=>this.searchSurvey());
        document.querySelector('#SearchClean').addEventListener('click', ()=>this.SurveyListModel.showSurveys());
        document.getElementById('SearchText').addEventListener('keydown', (e) => this.searchEnter(e));
        this.initOnModelChange();
        this.onChangeCallback();
        document.querySelector('#filter').addEventListener('click', ()=>this.SurveyListModel.showSurveys());// e 
        document.querySelector('#filter_complete').addEventListener('click', ()=>this.filter());
    }
   
    filter()
    {
        let data = [];
        data.push(this.SurveyListView.GetElement('min0').value);
        data.push(this.SurveyListView.GetElement('max0').value);
        data.push(this.SurveyListView.GetElement('min1').value)
        data.push(this.SurveyListView.GetElement('max1').value)
        data.push(new Date(this.SurveyListView.GetElement('after').value))
        data.push(new Date(this.SurveyListView.GetElement('before').value))
        
        
        for(let i = 0; i < 4; i++){
            if(data[i] !== ''){
                if(isNaN(data[i])){
                    console.log("error");
                    return; 
                }
            }
        }
        
        this.SurveyListModel.showSurveys();
        this.SurveyListModel.filter(data);
        this.onChangeCallback();
    }

    searchSurvey(){ 
        const res = this.SurveyListView.GetElement(this.SearchInput).value;
        if(res.length === 0){
            return; 
        }
        this.SurveyListView.clean(this.SearchInput);
        this.SurveyListModel.searchSurvey(res);
        
        const metaDescription = document.querySelector('meta[name="description"]').getAttribute('content');
        if(metaDescription === 'Main')
        {
            this.SurveyListView.hideModal('add_new');
        }
    }

   
    SaveData()
    {
        const metaDescription = document.querySelector('meta[name="description"]').getAttribute('content');
        if(metaDescription === 'Workplace' && this.SurveyListModel.surveys.length != 0 && this.deleteOP){
            const e = this.SurveyListView.GetElements('[data-input]');
            let data = [];
            let j = 0;
            for(let i = 0; i < e.length;){
                let id = parseInt(this.SurveyListView.GetAtr(e[i], 'data-id'));
                data.push([])
                while(i < e.length && id === parseInt(this.SurveyListView.GetAtr(e[i], 'data-id'))){
                    data[j].push(e[i].value);
                    i++;
                }
                j++;
            }
            let names = []
            let descriptions = []
            this.SurveyListView.GetElements('[data-name]').forEach((name) => {
                names.push(name.value);
            })
            this.SurveyListView.GetElements('[data-description]').forEach((description) => {
                descriptions.push(description.value);
            })
            this.SurveyListModel.SaveData(data, names, descriptions);
        }
    }
    

    onChangeCallback() {
        /* updates UI when a model has changed (title, done attributes) */
        this.SaveData();
        document.querySelector(`#${this.main}`).innerHTML = this.SurveyListView.toHtml();
    }


  
    initOnModelChange() {
        let handler = {
            set: (obj, prop, val) => {
                obj[prop] = val;
                document.querySelector('#main').innerHTML = this.SurveyListView.toHtml();
                return true;
            }
        }
        this.SurveyListModel.surveys = new Proxy(this.SurveyListModel.surveys, handler);
    }


    searchEnter(e)
    {
        if(e.key === 'Enter'){
            e.preventDefault();
            this.searchSurvey();
        }
    }

    addSurvey() {
        const title = document.getElementById('add_survey_index').value;
        this.SurveyListView.clean('add_survey_index');
        this.SurveyListModel.add(title);
        this.SurveyListView.hideModal('add_new');
    }

    delSurvey(id) { 
        this.SurveyListModel.delete(id);
    }
  

    finish()
    {

        function list(data)
        {
            let message = '';
            for (let i = 0; i < data.length && i < 4; i++) {
                message += `${data[i]}, `;
            }
            if(data.length === 5){
                message += `${data[5]}`;
            } else if(data.length > 5) {
                message += '...';
            } else {
                message = message.slice(0, -2);
            }
            return message;
        }
        
        function add_end(message, data){
            if(data.length <= 3){
                message = message.slice(0, -4);
            } else {
                message += '...'
            }
            return message;
        }
        this.SaveData();
        let message = '';
        const cheacked_name = this.SurveyListModel.CheakAllnames();
        const cheacked_options = this.SurveyListModel.CheakAllOptions();
        const cheacked_value = this.SurveyListModel.cheackNun();
        const cheacked_min_max = this.SurveyListModel.CheackMinMax();
        const cheacked_identicalQuest = this.SurveyListModel.CheackIdenticalQuestions();
        const cheacked_identicalOpt = this.SurveyListModel.CheackIdenticalOption();
        if(this.SurveyListModel.surveys[0].quests.length === 0){
           this.SurveyListView.showError('You have at least one question to ask');
        } else if(this.SurveyListView.GetElement('name_survey').value === ''){
            this.SurveyListView.showError('You need to name the survey');
        } else if(cheacked_name.length !== 0){
            let message = 'In question ';
            message += list(cheacked_name);
            this.SurveyListView.showError(message + ' do not have a name');
        } else if(cheacked_options.length !== 0) {
            for(let i = 0; i < cheacked_options.length && i < 3; i++) {
                message += 'in question ' + cheacked_options[i][0]  + ' options ';
                message += list(cheacked_options[i][1]) + ' and ';
            }
            message = add_end(message, cheacked_options);
            this.SurveyListView.showError(message + ' nothing is written');
        } else if(cheacked_value.length !== 0) {
            for(let i = 0; i < cheacked_value.length && i < 3; i++) {
                message += ' in question ' + cheacked_value[i][0]  + ' options: ';
                message += cheacked_value[i][1][0] + ' is not number and ';
                if(cheacked_value[i][1].length != 1){
                    message += cheacked_value[i][1][1] + ' is not number and ';
                }
            }
            message = add_end(message, cheacked_value);
            this.SurveyListView.showError(message);
        } else if(cheacked_min_max.length !== 0) {
            for(let i = 0; i < cheacked_min_max.length && i < 3; i++) {
                message += 'in question ' + cheacked_min_max[i]  + ' minimun more than maximum and';
            }
            message = add_end(message, cheacked_min_max);
            this.SurveyListView.showError(message);
        } else if(cheacked_identicalOpt.length !== 0) {
            message = 'In question ';
            message += list(cheacked_identicalOpt);
            message += ' have identical options';
            this.SurveyListView.showError(message );
        } else if(cheacked_identicalQuest.length !== 0) {
            for(let i = 0; i < cheacked_identicalQuest.length && i < 3; i++) {
                message += ` question ${cheacked_identicalQuest[i][0]} have same name with ${cheacked_identicalQuest[i][1]} and `;
            }
            message = add_end(message, cheacked_identicalQuest);
            this.SurveyListView.showError(message);
        }
        else {
            const name = this.SurveyListView.GetElement('name_survey').value;
            const description = this.SurveyListView.GetElement('description_survey').value;
            this.SurveyListModel.setInfo(name, description);
            this.SurveyListView.disabledAll();
        }
    }

    InitWorkplace()
    {
        this.main = "main";
        this.deleteOP = true;
        document.getElementById('finish_btn').addEventListener('click', () => this.finish());
        document.querySelector('#add_new_btn').addEventListener('click', ()=>this.addQuestion());
        document.querySelector('#main').addEventListener('click', (e) => this.onClickW(e)); 
        this.type = 0;
        this.SurveyListView.setSave(this.SaveData);
        this.SurveyListModel.setOnChangeCallback((e) => this.onChangeCallback(e));
        this.SurveyListModel.add('example');
        document.getElementById('radioGroup').addEventListener('change', (e) => 
        {
            if(e.target.type === 'radio'){
                this.type = parseInt(e.target.id[e.target.id.length - 1]);
            }
        })

    }

    onClickW(e)
    {
        if(e.target.hasAttribute('data-delete')) {
            this.SaveData();
            this.SurveyListModel.deleteOption(e.target.dataset.id, e.target.dataset.delete)
            this.deleteOP = false;
            this.onChangeCallback();
            this.deleteOP = true;
        } else if(e.target.hasAttribute('data-add')) {
            this.SurveyListModel.addOPtion(e.target.dataset.add);
            this.onChangeCallback();

        } else if(e.target.hasAttribute('data-deleteQuestion')) {
            this.SaveData();
            this.deleteOP = false;
            this.SurveyListModel.deleteQuest(e.target.dataset.deletequestion);
            this.onChangeCallback();
            this.deleteOP = true;
        } 
    }

    deleteOption(e)
    {
        const matches = e.target.id.match(/\d+/g);
        const first = parseInt(matches[0]);
        const second = parseInt(matches[1]);
        console.log(first);
        console.log(second);
    }

    addOption(id)
    {
        const matches = id.match(/\d+/g);
        this.SurveyListModel.surveys[0].addOption(parseInt(matches[0]));
        this.onChangeCallback();
        
    }

    addQuestion()
    {
        this.SurveyListModel.addQuest(this.type);
        this.SurveyListView.hideModal('add_new');
        this.onChangeCallback();
    }

    InitMain()
    {
        this.SurveyListModel.setOnChangeCallback((e) => this.onChangeCallback(e));
        this.main = "main";
        this.SearchInput = 'SearchText';
        document.querySelector('#SearchBtn').addEventListener('click', ()=>this.searchSurvey());
        document.querySelector('#SearchClean').addEventListener('click', ()=>this.SurveyListModel.showSurveys());
        document.getElementById('SearchText').addEventListener('keydown', (e) => this.searchEnter(e));
        document.querySelector('#main').addEventListener('click', (e) => this.onClick(e)); 
        document.getElementById('add_survey_index').addEventListener('keydown', 
        (e) => {
            if(e.key === 'Enter'){
                e.preventDefault();
                this.addSurvey(e)
            }
        })
        document.querySelector('#change').addEventListener('click', (e) => this.edit(e));
        document.querySelector('#add_new_btn').addEventListener('click', (e)=>this.addSurvey(e));
        this.initOnModelChange();
    }

    

    onClick(e) {
        if (e.target.className === 'dropdown-item') {
            if(e.target.innerText === 'Delete') {
                this.SurveyListModel.delete(e.target.dataset.id)
            } else if(e.target.innerText === 'Edit') {
                const edit = this.SurveyListModel.GetSurvey(e.target.dataset.id).name;
                const color = this.SurveyListModel.GetSurvey(e.target.dataset.id).background;
                this.SurveyListView.showModal(edit, color, e.target.dataset.id);
            } else if(e.target.innerText === 'Hide') {
                this.SurveyListModel.hideSurvey(e.target.dataset.id);
            }
            return;
        }
    }

    edit(e){ 
        const fileInput = this.SurveyListView.GetElement('editFile');
        const nameInput = this.SurveyListView.GetElement('editName'); 
        const colorInput =  this.SurveyListView.GetElement('editColor');
        
        let data = [];
        if(fileInput.files.length > 0) {
            data.push(fileInput.files[0].name);
        } else {
            data.push(null);
        }

        if(nameInput.value.trim() !== '') {
            data.push(nameInput.value);
        } else {
            data.push(null);
        }

        data.push(colorInput.value);
        this.SurveyListView.clean('editFile');
        this.SurveyListView.clean('editName');
        this.SurveyListModel.edit(e.target.dataset.id, data);
    }


    InitProfile()
    {
        this.SurveyListModel.setOnChangeCallback((e) => this.onChangeCallback(e));

        this.main = 'my_surveys';
        this.SurveyListModel.setPerson();

        let data = this.SurveyListModel.GetProfileInfo();
        let tags = ['nickname', 'name', 'surname', 'email', 'birthday', 'country', 'language'];
        tags.forEach((tag, i) => { this.SurveyListView.SentText(tag, data[i]); })

        this.SurveyListView.SentText('AboutMe', data[7]);
        this.SurveyListView.changeAvatar(data[8]);


        document.querySelector('#SearchBtn0').addEventListener('click', ()=>this.searchSurvey());
        document.querySelector('#SearchClean0').addEventListener('click', ()=>this.SurveyListModel.showSurveys());
        document.getElementById('SearchText0').addEventListener('keydown', 
        (e) => {
            if(e.key === 'Enter'){
                e.preventDefault();
                this.searchSurvey();
             }
    
        })

        document.querySelector('#SearchBtn1').addEventListener('click', ()=>this.searchSurvey());
        document.querySelector('#SearchClean1').addEventListener('click', ()=>this.SurveyListModel.showSurveys());
        document.getElementById('SearchText1').addEventListener('keydown', (e) => this.searchEnter(e))
 
        document.getElementById('change_main').addEventListener('click', ()=>this.ChangeMain());
        document.getElementById('ChangeMain').addEventListener('click', ()=>this.ChangeMain());
        document.getElementById('CancelMain').addEventListener('click', ()=>{
            this.SurveyListView.CancelMain()
            this.edit = true; });
            
        document.getElementById('CancelAbout').addEventListener('click', ()=>{   
            this.SurveyListView.CancelAbout()
            this.edit = true;
        });
         

        this.edit = true;
        document.getElementById('profileImage').addEventListener('click', () => {
                
        if(!this.edit){
            fileInput.click();
        }});
            
            
        document.getElementById('change_about').addEventListener('click', ()=>this.ChangeAbout());
        document.getElementById('ChangeAbout').addEventListener('click', ()=>this.ChangeAbout());   
        this.SurveyListView.createNav(Math.round(this.SurveyListModel.person.surveys.length / 10), 'previousMine')
        this.SurveyListView.createNav(Math.round(this.SurveyListModel.person.completed.length / 10), 'previousComplete')
            
        document.getElementById('NavMine').addEventListener('click', ()=>{
            this.SurveyListModel.showSurveys();
            this.main = 'my_surveys';
            this.SearchInput = 'SearchText0';
            this.SurveyListView.iteration = 0;
            this.SurveyListModel.surveys = this.SurveyListModel.person.surveys;
            this.onChangeCallback()
        });

        document.getElementById('NavConmplete').addEventListener('click', ()=>{
            this.SurveyListModel.showSurveys();
            this.main = 'completed_surveys'; 
            this.SearchInput = 'SearchText1';
            this.SurveyListModel.surveys = this.SurveyListModel.person.completed;
            this.SurveyListView.iteration = 0;
            this.onChangeCallback();
        });
            
        this.handleNavigation('navMine');
            this.handleNavigation('navComplete');
    }
    
    ChangeAbout(){
        if(this.edit){
            this.SurveyListView.HideShow('AboutMe', 'none');
            this.SurveyListView.HideShow('EditAbout', 'block');
            this.SurveyListView.HideShow('CancelAbout', 'block');
            this.SurveyListView.HideShow('ChangeAbout', 'block');
            this.edit = false;
        } else {
            this.SurveyListView.SentText('AboutMe', this.SurveyListView.GetElement('EditAbout').value);
            this.SurveyListView.HideShow('AboutMe', 'block');
            this.SurveyListView.clean('EditAbout');
            this.SurveyListView.HideShow('EditAbout', 'none');
            this.SurveyListView.HideShow('CancelAbout', 'none');
            this.SurveyListView.HideShow('ChangeAbout', 'none');
            this.edit = true;
        }

    }

    ChangeMain()
    {
        if(this.edit){
            this.SurveyListView.HideProfile();
            this.edit = false;
        } else {
            let data = [];
            let tags = ['nickname_input', 'name_input', 'surname_input', 'email_input', 'birthday_input', 'country_input', 'language_input'];
            
            tags.forEach(element => {
                data.push(this.SurveyListView.GetElement(element).value);
            });

            if(data[3] !== ""){
                data[3] = new Date (data[3]);
            } 

            this.SurveyListModel.SetProfileInfo(data); 
            this.SurveyListView.ShowProfile(data);
            let input = ['nickname_input', 'name_input', 'surname_input', 'email_input', 'birthday_input', 'country_input', 'language_input'];
            input.forEach((tag) => {
                this.SurveyListView.clean(tag);
            })
            this.edit = true;
        }
    }


    handleNavigation(navId) {
        const navItems = document.querySelectorAll(`#${navId} .page-item a`);
        
        navItems.forEach(item => {
            item.addEventListener('click', (event) => {
                event.preventDefault();
                if (item.id === 'back' ) {
                    if(this.SurveyListView.iteration != 0){

                        this.SurveyListView.iteration--;
                    }
                } else if (item.id === 'next') {
                    if(this.SurveyListView.iteration + 1 < Math.round(this.SurveyListModel.surveys.length / 10))
                    {
                        this.SurveyListView.iteration++;
                    }
                } else {
                    this.SurveyListView.iteration = parseInt(item.id);
                }
                this.onChangeCallback();
            });
        });
    }
}


