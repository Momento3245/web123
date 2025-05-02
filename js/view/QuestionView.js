export default class QuestionView {
    constructor(QuestionModel) {
        this.QuestionModel = QuestionModel;
        this.start = 
        `
        <div class="div-class section" id="${this.QuestionModel.id}">
            <div class="row mt-1">
                <div class="col-12">
                    <div class="input-group">
                        <textarea data-name="${this.QuestionModel.id}" style="font-size: 24px; font-weight: bold;" class="form-control" placeholder="Question" >${this.QuestionModel.question}</textarea>
                    </div>
                </div>
            </div>
            
            <div class="row mt-2">
                <div class="col-12">
                    <div class="input-group">
                        <textarea data-description="${this.QuestionModel.id}" type="text" class="form-control text-dark mt-3" placeholder="description (optional)">${this.QuestionModel.description}</textarea>
                    </div>
                </div>
            </div>`
        this.end = ` <div class="justify-content-end d-flex mt-4 align-items-center" style="border-top: 0.5px solid #dadce0;">
                        <button data-deleteQuestion="${this.QuestionModel.id}" type="button" class="btn btn-danger mt-1">
                            <i data-deleteQuestion="${this.QuestionModel.id}" class="bi bi-trash"></i>
                        </button>
                        <div class="form-check form-switch mt-1 ms-3" style="font-size: 20px;">
                            <input data-mandatory="${this.QuestionModel.id}" class="form-check-input" type="checkbox">
                            <label class="form-check-label" for="switchDefault">mandatory</label>
                        </div>
                    </div>
                </div>`
    }

 
    toHtml() 
    {
        if(this.QuestionModel.type === 0) {
            return this.type0();
        } else if (this.QuestionModel.type === 1) {
            return this.type1();
        } else if (this.QuestionModel.type === 2) {
            return this.type2();
        } else if (this.QuestionModel.type === 3) {
            return this.type3();
        } 
    }

    type0()
    {
        let res = this.start;
        for(let i = 0; i < this.QuestionModel.options.length; i++){
            res += `<div class="row d-flex align-items-center mt-5">
                        <div class="col">
                            <div class="align-items-center" style="display: flex;">
                                <div class="form-check" style="margin-right: 0.5%;">
                                    <input class="form-check-input" type="radio" disabled>
                                </div>
                                <input value="${this.QuestionModel.options[i]}" data-input="${i}" data-id="${this.QuestionModel.id}"  type="text" class="form-control" placeholder="option ${i}">
                            </div>
                        </div>
                        <div class="col-auto">
                            <button data-delete="${i}" data-id="${this.QuestionModel.id}" type="button" class="btn btn-sm btn-danger ms-2">
                                <i data-delete="${i}" data-id="${this.QuestionModel.id}" class="bi bi-x"></i>
                            </button>
                        </div>
                    </div>`
        }
        res += ` <div class="d-flex align-items-center justify-content-center mt-5">
                    <button data-add="${this.QuestionModel.id}" type="button" class="btn btn-primary">
                        Add new question
                    </button> 
                </div>`
        res += this.end;
        return res;
       
    }

    type1()
    {
        let res = this.start;
        for(let i = 0; i < this.QuestionModel.options.length; i++){
            res += `
            <div class="row d-flex align-items-center mt-5">
                        <div class="col">
                            <div class="align-items-center" style="display: flex;">
                                <div class="form-check" style="margin-right: 0.5%;">
                                    <input class="form-check-input" type="checkbox" disabled>
                                </div>
                                <input value="${this.QuestionModel.options[i]}" data-input="${i}" data-id="${this.QuestionModel.id}"  type="text" class="form-control" placeholder="option ${i}">
                            </div>
                        </div>
                        <div class="col-auto">
                            <button data-delete="${i}" data-id="${this.QuestionModel.id}" type="button" class="btn btn-sm btn-danger ms-2">
                                <i data-delete="${i}" data-id="${this.QuestionModel.id}" class="bi bi-x"></i>
                            </button>
                        </div>
                    </div>`
        }
        res += ` <div class="d-flex align-items-center justify-content-center mt-5">
                    <button data-add="${this.QuestionModel.id}" type="button" class="btn btn-primary">
                        Add new question
                    </button> 
                </div>
        `
        
        res += this.end;
        return res;
    }

    type2()
    {
        let res = this.start;
        res += `
        <div class="row mt-5">
            <div class="col-6">
                <div class="input-group">
                    <input  value="${this.QuestionModel.options[0]}" data-input="minimun" data-id="${this.QuestionModel.id}" type="text" class="form-control" placeholder="minimum">
                </div>
            </div>
            <div class="col-6">
                <div class="input-group">
                    <input  value="${this.QuestionModel.options[1]}" data-input="maximum" data-id="${this.QuestionModel.id}" type="text" class="form-control" placeholder="maximum">
                </div>
            </div>
        </div>
        <div class="form-select mt-3">
            <input type="range" class="form-range" disabled>
        </div>
        ` 
        res += this.end;
        return res;
    }

    type3()
    {
        let res = this.start;
        res += `       
            <div class="row mt-4">
                <div class="col-12">
                    <div class="input-group">
                        <textarea value="${this.QuestionModel.options[0]}" type="text" class="form-control text-dark mt-3" placeholder="Answer" disabled></textarea>
                    </div>
                </div>
            </div>
            `
        res += this.end;
        return res;
    }

  
}