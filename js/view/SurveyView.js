export default class SurveyView {
    constructor(SurveyModel) {
        this.SurveyModel = SurveyModel;
    }

    toHtmlPublic()
    {
        if(this.SurveyModel.shown){
            return; 
        }
        let image = "";
        if(this.SurveyModel.img !== null){
            image = `style="background-image: url(${this.SurveyModel.img})`;
        }
        let date = `${this.SurveyModel.date.getDate()}/${this.SurveyModel.date.getMonth() + 1}/${this.SurveyModel.date.getFullYear()}`;
        return `<a href="#" style="text-decoration: none; color: inherit; id="${this.SurveyModel.id}"">
                    <div class="col-12 survey_col d-flex flex-column justify-content-center align-items-center background-image" ${image};  
                        background-repeat: no-repeat; background-position: center; background-size: cover;">
                            <div class="text-center"><h4>${this.SurveyModel.name}</h4><p>${this.SurveyModel.quests.length} questinos</p></div>
                            <div class="mt-auto d-flex justify-content-between w-100">
                                <div class="text-secondary">${this.SurveyModel.responsible} finished</div>
                                <div class="text-secondary">${date}</div>
                            </div>
                    </div>
                </a>`;    
    }

    

    toHtml() {
        if(this.SurveyModel.shown){
            return; 
        }
        let status;
        if(this.SurveyModel.status){
            status = "finished";
        }
        else{
            status = "unfinished";
        }

        let image;
        if(this.SurveyModel.img === null){
            image = "";
        }
        else{
            image = `<img src="${this.SurveyModel.img}" class="img-fluid" style="height: 100%; width: 100%; object-fit: fill;" alt="картинка">`
        }

        let date = `${this.SurveyModel.date.getDate()}/${this.SurveyModel.date.getMonth()}/${this.SurveyModel.date.getFullYear()}`;
        return `<div id="${this.SurveyModel.id}" class="col-xxl-3 col-xl-4 col-md-6 col-sm-12">
            <div class="survey_col" style="background-color: ${this.SurveyModel.background};">
                <div class="text-secondary d-flex justify-content-between mb-1" style="font-size: small;">
                    <button type="button" class="btn"  data-bs-toggle="dropdown">
                    <i class="bi bi-three-dots-vertical"></i>
                </button>
                <div class="dropdown-menu">
                    <li data-id="${this.SurveyModel.id}" class="dropdown-item">Edit</li>
                    <li data-id="${this.SurveyModel.id}" class="dropdown-item">Delete</li>
                    <li data-id="${this.SurveyModel.id}" class="dropdown-item">Hide</li>
                </div>
                    <div class="text-secondary" style="font-size: small; display: flex; align-items: center; justify-content: center; height: 100%;">
                        ${date}
                    </div>
                </div>
                    <div style="height: 60%; overflow: hidden; margin-bottom: 30px;">
                        ${image}
                    </div>
                    <div class="d-flex flex-column justify-content-between align-items-center">
                        <div class="text-center"><h4>${this.SurveyModel.name}</h4></div>
                        <div class="text-secondary">${this.SurveyModel.quests.length} question</div>
                        <div class="text-secondary">${this.SurveyModel.responsible} respondents</div>
                        <div>${status}</div>
                    </div>
            
            </div>
        </div>`
    }
}