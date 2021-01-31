/* eslint-disable react/prop-types */
import React from 'react';
import { useRouter } from 'next/router';

import { Lottie } from '@crello/react-lottie';
// import db from '../../../db.json';
import Widget from '../../components/Widget';
import QuizLogo from '../../components/QuizLogo';
import QuizBackground from '../../components/QuizBackground';
import QuizContainer from '../../components/QuizContainer';
import AlternativesForm from '../../components/AlternativesForm';
import Button from '../../components/Button';
import BackLinkArrow from '../../components/BackLinkArrow';

import loadingAnimation from './animations/loading.json';

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>
        Carregando...
      </Widget.Header>

      <Widget.Content style={{ display: 'flex', justifyContent: 'center' }}>
        <Lottie
          width="200px"
          height="200px"
          className="lottie-container basic"
          config={{ animationData: loadingAnimation, loop: true, autoplay: true }}
        />
      </Widget.Content>
    </Widget>
  );
}

function CorrectWidget({ questionIndex, quizTitle }) {
  const myQuiz = quizTitle === 'PokéQuiz';
  const imgMyQuiz = [
    'https://media.giphy.com/media/W9PZr6VobZHdC/giphy.gif',
    'https://media.giphy.com/media/xuXzcHMkuwvf2/giphy.gif',
    'https://media.giphy.com/media/25MfWTSrSWjPG/giphy.gif',
    'https://media.giphy.com/media/pbGSpeX860JxK/giphy.gif',
  ];
  return (
    <Widget>
      <Widget.Header style={{ justifyContent: 'center' }}>
        ACERTOU
      </Widget.Header>

      <Widget.Content style={{ display: 'flex', justifyContent: 'center' }}>
        <img
          src={
                myQuiz
                  ? `${imgMyQuiz[questionIndex]}`
                  : 'https://media.giphy.com/media/dYdrcYcidefPzFSYJd/giphy.gif'
              }
          alt="Resposta certa!!!"
        />
      </Widget.Content>
    </Widget>
  );
}

function ResultWidget({ results, totalQuestions, quizTitle }) {
  const router = useRouter();
  const totalCorrectAnswers = results.filter((x) => x).length;
  const myQuiz = quizTitle === 'PokéQuiz';
  const playerName = router.query.name;

  return (
    <Widget>
      <Widget.Header>
        {
          myQuiz
            && (
              totalCorrectAnswers === totalQuestions
                ? 'Provou ser um mestre Pokémon!'
                : 'Tente novamente quando for um mestre Pokémon!'
            )
        }
        {!myQuiz && 'Resultado'}
      </Widget.Header>

      <Widget.Content>
        {
          totalCorrectAnswers === 0
            && (
              <p>
                {playerName ? `${playerName}, v` : 'V'}
                ocê não acertou NADA
              </p>
            )
        }
        {
          totalCorrectAnswers > 0
            && (
              <p>
                {playerName ? `${playerName}, v` : 'V'}
                ocê acertou
                {' '}
                {totalCorrectAnswers}
                {' '}
                pergunta
                {totalCorrectAnswers > 1 && 's.'}
              </p>
            )
        }
        {
          myQuiz
            && (
              totalCorrectAnswers === totalQuestions
                ? <img src="https://media.giphy.com/media/amrNGnZUeWhZC/giphy.gif" alt="" />
                : <img src="https://media.giphy.com/media/xIP3GCyzWOEWA/giphy.gif" alt="" />
            )
        }
        {
          !myQuiz
            && (
              totalCorrectAnswers === totalQuestions
                ? <img src="https://media.giphy.com/media/fxsqOYnIMEefC/giphy.gif" alt="" />
                : <img src="https://media.giphy.com/media/14aUO0Mf7dWDXW/giphy.gif" alt="" />
            )
        }

        <form onSubmit={(event) => {
          event.preventDefault();
          router.push('/');
        }}
        >
          <Button type="submit">
            Início
          </Button>
        </form>
      </Widget.Content>
    </Widget>
  );
}

function QuestionWidget({
  question,
  questionIndex,
  totalQuestions,
  onSubmit,
  addResult,
}) {
  const [selectedAlternative, setSelectedAlternative] = React.useState(undefined);
  const [isQuestionSubmited, setIsQuestionSubmited] = React.useState(false);
  const questionId = `question__${questionIndex}`;
  const isCorrect = selectedAlternative === question.answer;
  const hasAlternativeSelected = selectedAlternative !== undefined;

  return (
    <Widget>
      <Widget.Header>
        <BackLinkArrow href="/" />
        <h3>
          {`Pergunta ${questionIndex + 1} de ${totalQuestions}`}
        </h3>
      </Widget.Header>

      <img
        alt="Imagem"
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover',
        }}
        src={question.image}
      />
      <Widget.Content>
        <h2>
          {question.title}
        </h2>
        <p>
          {question.description}
        </p>

        <AlternativesForm
          onSubmit={(infosDoEvento) => {
            infosDoEvento.preventDefault();
            setIsQuestionSubmited(true);
            setTimeout(() => {
              addResult(isCorrect);
              onSubmit(isCorrect);
              setIsQuestionSubmited(false);
              setSelectedAlternative(undefined);
            }, 1 * 1000);
          }}
        >
          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative__${alternativeIndex}`;
            const alternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR';
            const isSelected = selectedAlternative === alternativeIndex;
            return (
              <Widget.Topic
                as="label"
                key={alternativeId}
                htmlFor={alternativeId}
                data-selected={isSelected}
                data-status={isQuestionSubmited && alternativeStatus}
              >
                <input
                  style={{ display: 'none' }}
                  id={alternativeId}
                  name={questionId}
                  onChange={() => setSelectedAlternative(alternativeIndex)}
                  type="radio"
                />
                {alternative}
              </Widget.Topic>
            );
          })}

          <Button type="submit" disabled={!hasAlternativeSelected}>
            Confirmar
          </Button>
        </AlternativesForm>
      </Widget.Content>
    </Widget>
  );
}

const screenStates = {
  LOADING: 'LOADING',
  QUIZ: 'QUIZ',
  CORRECT: 'CORRECT',
  RESULT: 'RESULT',
};
export default function QuizPage({ externalQuestions, externalBg, quizTitle }) {
  const [screenState, setScreenState] = React.useState(screenStates.LOADING);
  const [results, setResults] = React.useState([]);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const questionIndex = currentQuestion;
  const question = externalQuestions[questionIndex];
  const totalQuestions = externalQuestions.length;
  const bg = externalBg;

  function addResult(result) {
    setResults([
      ...results,
      result,
    ]);
  }

  // [React chama de: Efeitos || Effects]
  // React.useEffect
  // atualizado === willUpdate
  // morre === willUnmount
  React.useEffect(() => {
    // fetch() ...
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 1 * 2000);
  // nasce === didMount
  }, []);

  // Se errar perde
  function handleSubmitQuiz(isCorrect) {
    const nextQuestion = questionIndex + 1;

    if (!isCorrect || nextQuestion === totalQuestions) {
      setScreenState(screenStates.RESULT);
    } else {
      setScreenState(screenStates.CORRECT);
      setTimeout(() => {
        setScreenState(screenStates.QUIZ);
        setCurrentQuestion(nextQuestion);
      }, 2 * 1000);
    }
  }

  return (
    <QuizBackground backgroundImage={bg}>
      <QuizContainer>
        <QuizLogo quizTitle={quizTitle} />
        {screenState === screenStates.LOADING && <LoadingWidget />}

        {screenState === screenStates.QUIZ && (
          <QuestionWidget
            question={question}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            onSubmit={handleSubmitQuiz}
            addResult={addResult}
          />
        )}

        {screenState === screenStates.CORRECT
         && (
         <CorrectWidget questionIndex={questionIndex} quizTitle={quizTitle} />
         )}

        {screenState === screenStates.RESULT
          && (
            <ResultWidget
              results={results}
              totalQuestions={totalQuestions}
              quizTitle={quizTitle}
            />
          )}
      </QuizContainer>
    </QuizBackground>
  );
}
