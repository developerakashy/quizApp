document.addEventListener('DOMContentLoaded', () => {
    const quizIntro = document.querySelector('.quiz-intro')
    const quizTopics = document.querySelector('.quiz-topics')
    const questionAnswer = document.querySelector('.question-answer')
    const headDiv = document.querySelector('.head')
    const questionContent = document.querySelector('.question-content')
    const optionContent = document.querySelector('.option-content')
    let divOptions = optionContent.querySelectorAll('div')
    const submitBtn = document.querySelector('.submit-option')
    const nextBtn = document.querySelector('.next-option')
    const playAgainBtn = document.querySelector('.play-again')

    let currentQuiz
    let currentQuestionCount = 0
    let currentQuestionAnswer
    let optionSelected = false
    let score = 0

    const deselectOptions = (e) => deselectOtherOptions(e)

    quizTopics.addEventListener('click', (e) => {

        if(e.target.closest('div')){
            const element = e.target.closest('div')

            fetchQuestions(parseInt(element.dataset.subject))

            quizIntro.parentElement.classList.add('hidden')
            questionAnswer.classList.remove('hidden')
        }

    })

    submitBtn.addEventListener('click', () => submitAndRevealAnswer(currentQuestionAnswer))
    nextBtn.addEventListener('click', () => nextQuestion(currentQuiz))

    playAgainBtn.addEventListener('click', resetQuiz)


    async function fetchQuestions(subject){
        let data = await fetch('./data.json')
        let response = await data.json()
        const quiz = response.quizzes[subject]
        currentQuiz = quiz
        showQuizQuestions(quiz)

    }

    function showQuizQuestions(quiz){

        headDiv.innerHTML = `
        <div>
            <img class="${quiz.title.toLowerCase()}" src="${quiz.icon}" />
            <p class="sub-text">${quiz.title}</p>
        </div>
        <div></div>
        `

        let question = quiz.questions[currentQuestionCount].question

        questionContent.innerHTML = ''
        questionContent.innerHTML = `
        <p class="current-question-count">Question ${currentQuestionCount + 1} of ${quiz.questions.length}</p>
        <p class="question"></p>
        <div class="progress-view">
            <div class="progress"></div>
        </div>
        `
        const questionText = questionContent.querySelector('.question')
        questionText.textContent = question

        const progress = questionContent.querySelector('.progress')
        progress.style.width = `calc(${currentQuestionCount + 1}0% - 12px)`

        let options = quiz.questions[currentQuestionCount].options
        currentQuestionAnswer = quiz.questions[currentQuestionCount].answer


        optionContent.innerHTML = ''

        let optionListNames = ['A', 'B', 'C', 'D']
        let currentListNameIndex = 0
        options.forEach(option => {
            const div = document.createElement('div')


            div.innerHTML = `
                <p class="option">${optionListNames[currentListNameIndex]}</p>
                <p class="option-text"></p>
                <svg class="correct-svg hidden" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 40 40"><path fill="#26D782" d="M20 5a15 15 0 1 1 0 30 15 15 0 0 1 0-30Zm0 2.5a12.5 12.5 0 1 0 0 25 12.5 12.5 0 0 0 0-25Zm-1.875 15.105L25.3 15.41a1.25 1.25 0 0 1 1.915 1.593l-.145.174-8.06 8.08a1.25 1.25 0 0 1-1.595.148l-.175-.145-4.375-4.375a1.25 1.25 0 0 1 1.595-1.913l.175.143 3.49 3.49Z"/></svg>
                <svg class="incorrect-svg hidden" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 40 40"><path fill="#EE5454" d="M20 5a15 15 0 1 1 0 30 15 15 0 0 1 0-30Zm0 2.5a12.5 12.5 0 1 0 0 25 12.5 12.5 0 0 0 0-25Zm-5.402 7.415.142-.175a1.25 1.25 0 0 1 1.595-.143l.175.143L20 18.233l3.49-3.493a1.25 1.25 0 0 1 1.595-.143l.175.143a1.25 1.25 0 0 1 .142 1.595l-.142.175L21.767 20l3.493 3.49a1.25 1.25 0 0 1 .142 1.595l-.142.175a1.25 1.25 0 0 1-1.595.142l-.175-.142L20 21.767l-3.49 3.493a1.25 1.25 0 0 1-1.595.142l-.175-.142a1.25 1.25 0 0 1-.143-1.595l.143-.175L18.233 20l-3.493-3.49a1.25 1.25 0 0 1-.143-1.595Z"/></svg>
            `
            const optionText = div.querySelector('.option-text')
            optionText.textContent = option
            optionContent.appendChild(div)
            currentListNameIndex += 1

        });

        currentListNameIndex = 0
        divOptions = optionContent.querySelectorAll('div')

        optionContent.addEventListener('click', deselectOptions)

    }


    function submitAndRevealAnswer(answer){
        if(!optionSelected) {
            console.log('select a option')
            return
        }

        optionContent.removeEventListener('click', deselectOptions)

        divOptions.forEach((option) => {

            const optionText = option.querySelector('.option-text').textContent
            const optionCorrectSvg = option.querySelector('.correct-svg')
            const optionIncorrectSvg = option.querySelector('.incorrect-svg')

            if(answer === optionText){
                option.classList.add('correct')
                optionCorrectSvg.classList.remove('hidden')
                console.log('true')
            }else{
                option.classList.add('wrong')
                optionIncorrectSvg.classList.remove('hidden')
            }

            if(option.classList.contains('correct') && option.classList.contains('selected')){
                score += 1
            }

        })


        nextBtn.classList.remove('hidden')
        submitBtn.classList.add('hidden')
        playAgainBtn.classList.add('hidden')
        optionSelected = false
        currentQuestionCount += 1

    }



    function deselectOtherOptions(e){
        const optionElement = e.target

        if(optionElement.closest('div') && !optionElement.closest('div').classList.contains('option-content')){
            divOptions.forEach(option => {
                option.classList.remove('selected')
            })
            optionElement.closest('div').classList.add('selected')
            optionSelected = true

        }
    }


    function nextQuestion(quiz){

        if(currentQuestionCount >= quiz.questions.length){
            showResult(quiz)
            currentQuestionCount = 0
        }else{
            showQuizQuestions(quiz)
            submitBtn.classList.remove('hidden')
            nextBtn.classList.add('hidden')
            playAgainBtn.classList.add('hidden')
        }

        window.scrollTo(0, 0)
    }


    function showResult(quiz){
        questionContent.innerHTML = ''
        optionContent.innerHTML = ''

        questionContent.innerHTML = `
        <p class='completedText'>Quiz completed</p>
        <p class='scoredText'>You scored...</p>
        `

        optionContent.innerHTML = `
        <div class='result-view'>
            <div class='sub-icon'>
                <img class="${quiz.title.toLowerCase()}" src="${quiz.icon}" />
                <p class="sub-text">${quiz.title}</p>
            </div>
            <p class='score'>${score}</p>
            <p class='out-of'>out of ${quiz.questions.length}</p>
        </div>
        `

        playAgainBtn.classList.remove('hidden')
        submitBtn.classList.add('hidden')
        nextBtn.classList.add('hidden')

        console.log('Your score: ', score)
    }

    function resetQuiz(){
        questionContent.innerHTML = ''
        optionContent.innerHTML = ''

        quizIntro.parentElement.classList.remove('hidden')
        questionAnswer.classList.add('hidden')

        score = 0

        submitBtn.classList.remove('hidden')
        nextBtn.classList.add('hidden')
        playAgainBtn.classList.add('hidden')
    }


})
