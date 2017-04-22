var questions = [];

function showQuestions() {
    var subject = document.getElementById('subject').value;
    var name = document.getElementById('name').value;

    firebase.database().ref(subject).on('value', function(snap) {
        var data = snap.val();
        if(data === null)  {
            window.location.href = "/start";
        }

        for (var i in data){
            questions.push(data[i]);
        }
        var current = 0;
        var score = 0;
        var questionLength = questions.length;
        var wrapper = document.getElementById('wrapper');
        var result = document.getElementById('result');
        var feedback = document.getElementById('feedback');
        var scoreId = document.getElementById('score');
        var smiley = document.getElementById('smiley');
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
                score += 1;

            }
            selectOption.checked = false;
            current++;
            if(current === (questionLength - 1)) {
                btnNext.innerHTML = "Finish";
            }
            if(current === questionLength) {
                //calculate percentage;
                var passMark = 50;
                var per = (score/questionLength) * 100;
                if(per >= 50) {
                    wrapper.style.display = "none";
                    result.style.display = "block";
                    result.className  += " congrats";
                    feedback.innerHTML = "Congratulations you pass the pass mark of <b>50%</b>";
                    scoreId.innerHTML = per+"%";
                    firebase.database().ref('leaderboard/').push({
                	    name : name,
                        subject: subject,
                	    score: per
                    });
                }else{
                    wrapper.style.display = "none";
                    result.style.display = "block";
                    smiley.innerHTML = '<i class="fa fa-frown-o fa-5x" aria-hidden="true"></i>';
                    result.className += " sad";
                    feedback.innerHTML = "Oops you didn't pass the pass mark of <b>50%</b> Try again";
                    scoreId.innerHTML = per+"%";

                    firebase.database().ref('leaderboard/').push({
            		  name: name,
            		  score: per,
                      subject: subject
                  });
                }
                return;
            }
            getQuestions(current);
        };

        btnNext.addEventListener('click', function() {
            getNextQuestion();
        });

     });

     function getQuestions(questionIndex) {
         questions = getRandomQuestions(questions, 5);
         var q = questions[questionIndex];
         var question = document.getElementById('quest');
         document.getElementById('option1').innerHTML = q.answer1;
         document.getElementById('option2').innerHTML = q.answer2;
         document.getElementById('option3').innerHTML = q.answer3;
         document.getElementById('option4').innerHTML = q.answer4;
         var topic = document.getElementById('topic');
         var remainNumber = document.getElementById('remainNumber');
         var totalNumber = document.getElementById('totalNumber');
         quest.innerHTML = (questionIndex + 1)+'. ' + '  ' +q.question;
         topic.innerHTML = subject.toUpperCase();
         remainNumber.innerHTML = (questionIndex + 1) + " of ";
         totalNumber.innerHTML = questions.length;
     }
}

var go = document.getElementById('changeSubject');
go.addEventListener('click', function() {
    var wrap = document.getElementById('wrapper');
    var subjectList = document.getElementById('subject-list');
    wrap.style.display = 'block';
    subjectList.style.display = 'none';

});

function getRandomQuestions(arr, count) {
    var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}
