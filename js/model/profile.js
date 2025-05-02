export default class Profile {
    constructor() {
        this.id = Math.round(Math.random() * 100000).toString();
        this.nickname = "nickname";
        this.name = "name";
        this.surname = "surname";
        this.email = "example@gmail.com";
        this.birthday = new Date();
        this.country = "country";
        this.laguenge = "language";
        this.AboutMe = 'text';
        this.avatare = '../images/user-account-flat-icon-vector-14992789.jpg';
        this.surveys = [];
        this.completed = [];
        this.onChangeCallback = null;
    }

    addSurvey(Survey)
    {
        Survey.onChangeCallback = this.onChangeCallback;
        this.surveys.push(Survey);
    }

    addCompleted(Survey)
    {
        Survey.onChangeCallback = this.onChangeCallback;
        this.completed.push(Survey);
    }

    setOnChangeCallback(onChangeCallback) {
        this.onChangeCallback = onChangeCallback;
    }

    GetInfo()
    {
        let data = [];
        data.push(this.nickname);
        data.push(this.name);
        data.push(this.surname);
        data.push(this.email);
        data.push(`${this.birthday.getDate()}/${this.birthday.getMonth() + 1}/${this.birthday.getFullYear()}`)
        data.push(this.country);
        data.push(this.laguenge);
        return data;
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