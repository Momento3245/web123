
import ListModel from './model/ListModel.js';
import SurveyView from './view/ListView.js';
import Controller from './controller/Controller.js';

let SLM = new ListModel();
let SLV = new SurveyView(SLM);

let controller = new Controller(SLM, SLV);

