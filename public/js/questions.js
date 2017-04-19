var questions = [];
function showQuestions() {

    var subject = document.getElementById('subject').value;
    console.log('Calling questions', subject );

    firebase.database().ref(subject).on('value', function(snap) {
        var data = snap.val();
        if(data === null)  {
            window.location.href = "/dashboard";
            return;
        }

        for (var i in data){
            questions.push(data[i]);
        }
        var current = 0;
        var score = 0;
        var questionLength = questions.length;
        var wrapper = document.getElementById('wrapper');
        var result = document.getElementById('result');
        var btnNext = document.getElementById('btnext');


        getQuestions(current);

        var getNextQuestion = function (){
            var selectOption = document.querySelector('input[type=radio]:checked');
            if(!selectOption){
                alert('You have to choose an option');
                return;
            }
            var answer = selectOption.value;
            if(questions[current].correct == answer) {
                score += 10;

            }
            selectOption.checked = false;
            current++;
            if(current === (questionLength - 1)) {
                btnNext.innerHTML = "Finish";
            }
            if(current === questionLength) {
                wrapper.style.display = "none";
                result.style.display = "";
                result.innerHTML = "Your Score is " + score;
                return;
            }
            getQuestions(current);
        };

        btnNext.addEventListener('click', function() {
            getNextQuestion();
        });

     });

     function getQuestions(questionIndex) {
         var q = questions[questionIndex];
         var question = document.getElementById('quest');
         var option1 = document.getElementById('option1');
         var option2 = document.getElementById('option2');
         var option3 = document.getElementById('option3');
         var option4 = document.getElementById('option4');

         option1.innerHTML = q.answer1;
         option2.innerHTML = q.answer2;
         option3.innerHTML = q.answer3;
         option4.innerHTML = q.answer4;
         quest.innerHTML = q.question;
     }
}

var go = document.getElementById('changeSubject');
go.addEventListener('click', function() {
    var wrap = document.getElementById('wrapper');
    var subjectList = document.getElementById('subject-list');
    wrap.style.display = 'block';
    subjectList.style.display = 'none';
    console.log(subject);
});
