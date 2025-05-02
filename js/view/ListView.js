import SurveyView from './SurveyView.js';
import QuestionView from './QuestionView.js';

export default class SurveyListView {
    constructor(SurveyListModel) {
        this.SurveyListModel = SurveyListModel;

        
        const metaDescription = document.querySelector('meta[name="description"]').getAttribute('content');
        if(metaDescription === "Public") {
            this.InitPublic()
        } else if (metaDescription === 'Main') {
            this.InitMain()
        } else if(metaDescription === 'SingUP') {
           this.InitSingUp()
        } else if(metaDescription === "profile") {
           this.InitProfile(); 
        } else if(metaDescription === 'Workplace') {
            this.InitWorkplace();
        }
    }

    InitWorkplace()
    {
        const modalElement = document.getElementById('add_new');
        this.modalInstance = new bootstrap.Modal(modalElement);
        this.toHtml = this.toHhmlWorkplace;
        this.save = null;
    }

    setSave(save)
    {
        this.save = save; 
    }

    toHhmlWorkplace()
    {
        this.save();
        if(this.SurveyListModel.surveys.length === 0)
        {
            return ""; 
        }
        const showe = this.SurveyListModel.surveys[0].quests;
        const SurveysHtml = showe.map( (quest) => {
            const SVquest = new QuestionView(quest);
            return SVquest.toHtml();
        }).join("");
        return SurveysHtml;
    }


    InitPublic()
    {
        this.CleanController = null;
        document.querySelector('#filter').addEventListener('click', ()=>this.filter());
        this.toHtml = this.toHtmlPublic;
    }

    InitMain()
    {
        const modalElement = document.getElementById('add_new');
        this.modalInstance = new bootstrap.Modal(modalElement);
        this.toHtml = this.toHtmlIndex;
    }

    InitSingUp()
    {
        const genderRadios = document.querySelectorAll('input[name="gender"]');
            genderRadios.forEach(function(radio) {
                radio.addEventListener('change', function() {
                    const selectedValue = this.value;
                    console.log('Selected option:', selectedValue);

                    if (selectedValue === 'Custom') {
                        document.getElementById('gender_file').style.display = 'block';
                    } else {
                        document.getElementById('gender_file').style.display = 'none';
                    }
                });
            });
    }

    InitProfile()
    {
         this.data = ['nickname', 'name', 'surname', 'email', 'birthday', 'country', 'language'];
         this.input = ['nickname_input_div', 'name_input_div', 'surname_input_div', 'email_input_div', 
                       'birthday_input_div', 'country_input_div', 'language_input_div'];
         this.iteration = 0;
         this.toHtml = this.toHhmlProfile;
    }

    changeAvatar(source)
    {
        document.getElementById('profileImage').src = source;
    }

    HideShow(tag, status) 
    {
        document.getElementById(tag).style.display = status;
    }

    HideProfile(){
        this.data.forEach((tag) => {
            document.getElementById(tag).style.display = 'none';
        } )
        this.input.forEach(tag => {
            document.getElementById(tag).style.display = 'block';
        } )
        document.getElementById('ChangeMain').style.display = 'block';
        document.getElementById('CancelMain').style.display = 'block';
    }

    ShowProfile(data)
    {
        this.input.forEach(tag => {
            document.getElementById(tag).style.display = 'none';
        } )
        document.getElementById('ChangeMain').style.display = 'none';
        document.getElementById('CancelMain').style.display = 'none';
        if(data[0] != ""){
            document.getElementById('nickname_picture').innerHTML = data[0]
        }
        this.data.forEach((tag, i) => {
            if(data[i] != ""){
                document.getElementById(tag).innerHTML = data[i];
            }
            document.getElementById(tag).style.display = 'block';
        } )
    }

    CancelMain(){
        this.input.forEach((tag, i) => {

            document.getElementById(this.data[i] + '_input').value = '';
            document.getElementById(tag).style.display = 'none';
        } )
        document.getElementById('ChangeMain').style.display = 'none';
        document.getElementById('CancelMain').style.display = 'none';
        let data = this.SurveyListModel.person.GetInfo();
        this.data.forEach((tag, i) => {
            document.getElementById(tag).style.display = 'block';
            document.getElementById(tag).value = data[i];
        } )
    }
    
    CancelAbout(){
        document.getElementById('AboutMe').style.display = 'block';
        document.getElementById('AboutMe').value = this.SurveyListModel.person.AboutMe;       
        document.getElementById('EditAbout').style.display = 'none';
        document.getElementById('EditAbout').value = '';
        document.getElementById('CancelAbout').style.display = 'none';
        document.getElementById('ChangeAbout').style.display = 'none';

    }

   

    choice(e){
        if(e.value === "Custom"){
            document.getElementById('gender_file').style.display = 'block';
        } else {
            document.getElementById('gender_file').style.display = 'none';
        }
    }
    

    filter()
    {
        const toggleElement = document.getElementById('filter_panel');
        if(toggleElement.style.display === 'none'){
            toggleElement.style.display = 'block';
        } else {
            this.SurveyListModel.showSurveys();
            let tags = ['min0', 'min1', 'max0', 'max1', 'before', 'after'];
            tags.forEach(
                (tag) =>{
                    document.getElementById(tag).value = "";
            })
            toggleElement.style.display = 'none';
        }     
    }

    GetElements(tag){
        return document.querySelectorAll(tag);
    }

    GetAtr(e, atr){
        return e.getAttribute(atr);
    }

    SentText(tag, value){
        document.getElementById(tag).innerHTML = value;
    }

    disabledAll()
    {
        function disable(e) {
            e.disabled = true;
        }
        document.getElementById('name_survey').disabled = true;
        document.getElementById('description_survey').disabled = true;
        document.querySelectorAll('[data-input]').forEach((e) => disable(e));
        document.querySelectorAll('[data-name]').forEach((e) => disable(e));
        document.querySelectorAll('[data-description]').forEach((e) => disable(e));
        document.querySelectorAll('[data-deleteQuestion]').forEach((e) => disable(e));
        document.querySelectorAll('[data-add]').forEach((e) => disable(e));
        document.querySelectorAll('[data-delete]').forEach((e) => disable(e));
        document.querySelectorAll('[data-mandatory]').forEach((e) => disable(e));
    }

    createNav(time, where)
    {
        if(time === 0){
            time = 1;
        }
        let item = document.getElementById(where);
        for(let i = 0; i < time; i++){
            let newNav = document.createElement('li');
            newNav.className  = 'page-item';
            newNav.innerHTML = `<a id="${i}" href="#" class="page-link">${i+1}</a>`;
            item.insertAdjacentElement('afterend', newNav);
            item = newNav;
        }
    }

    toHhmlProfile(){
        let start = this.iteration * 10;
        let end = Math.min(this.iteration * 10 + 10, this.SurveyListModel.surveys.length);
        const CurrentSurveys = this.SurveyListModel.surveys.slice(start, end);
        const SurveysHtml = CurrentSurveys.map( (Survey) => {
            const SView = new SurveyView(Survey);
            return SView.toHtmlPublic();
        }).join("");
        return SurveysHtml;
    }

    allOptions()
    {
        return document.querySelectorAll('[option]');
    }

    toHtmlPublic(){
        
        const SurveysHtml = this.SurveyListModel.surveys.map( (Survey) => {
            const SView = new SurveyView(Survey);
            return SView.toHtmlPublic();
        }).join("");
        return SurveysHtml;
    }
    
    
    showModal(name, color, ID)
    {
        var myModal = new bootstrap.Modal(document.getElementById('Edit'));
        document.getElementById('EditLabel').innerHTML = `Edit ${name}`;
        document.getElementById('editColor').value = `${color}`;
        let tmp = document.getElementById('change'); 
        tmp.setAttribute('data-id', `${ID}`);
        myModal.show();
    }

    showError(text)
    {
        const errorModal = new bootstrap.Modal(document.getElementById('Error'));

        document.getElementById('error_text').innerText = text;
        errorModal.show();
    }

    closeError()
    {
        const errorModal = new bootstrap.Modal(document.getElementById('Error'));
        errorModal.hide();
    }

    hideModal()
    {
        this.modalInstance.hide();
    }
    
    clean(tag)
    {
        const smt = document.getElementById(tag);
        smt.value = "";
    }

    toHtmlIndex() {
        const SurveysHtml = this.SurveyListModel.surveys.map( (Survey) => {
            const SView = new SurveyView(Survey);
            return SView.toHtml();
        }).join("");
        return SurveysHtml;
    }

    GetElement(id)
    {
        return document.getElementById(id);
    }
}
