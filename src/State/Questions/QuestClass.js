class Question{
    id
    quiz
    title
    text
    img
    price
    type
    answer
    video
    isActive

    constructor(model) {
        this.id = model.id?model.id:'new'
        this.quiz =  model.quiz? model.quiz:''
        this.title = model.title? model.title:''
        this.text = model.text? model.text:'';
        this.img = model.img? model.img:'';
        this.type = model.type?model.type:'question';
        this.answer = model.answer?model.answer:'';
        this.video = model.video?model.video:''
        this.isActive =  model.isActive? model.isActive:true
    }
}

export default Question