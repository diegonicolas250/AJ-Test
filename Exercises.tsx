import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import database from '@react-native-firebase/database';
import {Exercise} from './interfaces/excercises';

const Exercises = () => {
  const [exercises, setExercises] = React.useState<Exercise[]>([]);
  const [selectedAnswer, setSelectedAnswer] = React.useState('');
  const [index, setIndex] = useState(0);

  React.useEffect(() => {
    const reference = database().ref('/exercises');

    reference.on('value', snapshot => {
      setExercises(snapshot.val());
    });
  }, []);

  const formatPrimarySentence = (sentence: string) => {
    const highlightWord = sentence.substring(
      sentence.indexOf('{') + 1,
      sentence.lastIndexOf('}'),
    );
    const firstWords = sentence.split('{')[0];
    const lastWords = sentence.split('}')[1];

    return (
      <Text>
        <Text>{firstWords}</Text>
        <Text style={styles.highlightWord}>{highlightWord}</Text>
        <Text>{lastWords}</Text>
      </Text>
    );
  };

  const formatSecondarySentence = (sentence: string) => {
    const firstWords = sentence.split('{')[0];
    const lastWords = sentence.split('}')[1];

    return (
      <Text>
        <Text>{firstWords}</Text>
        {selectedAnswer ? (
          <View style={styles.answerSecondaryWordContainer}>
            <Text style={{color: 'white', fontSize: 22}}>{selectedAnswer}</Text>
          </View>
        ) : (
          <Text style={styles.highlightWord}>{'                '}</Text>
        )}
        <Text>{lastWords}</Text>
      </Text>
    );
  };

  const renderAnswers = () => {
    return exercises[0].answer.map(answer => {
      const isSelectedAnswer = answer.word === selectedAnswer;

      return (
        <View style={{width: '35%'}} key={answer.word}>
          <TouchableOpacity onPress={() => setSelectedAnswer(answer.word)}>
            <View
              style={
                !isSelectedAnswer
                  ? styles.answerContainer
                  : styles.answerSelectedContainer
              }>
              <Text>{!isSelectedAnswer ? answer.word : ''}</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    });
  };

  const handleContinuePress = () => {
    if (index + 1 <= exercises.length - 1 && index + 1 >= 0) {
      setIndex(index + 1);
      setSelectedAnswer('');
    }
  };

  if (exercises.length === 0) {
    return (
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.container}>
          <Text>No data</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.sentenceContainer}>
          <Text style={styles.title}>Fill in the missing word</Text>

          <Text style={styles.sentencePrimary}>
            {formatPrimarySentence(exercises[index].sentenceEnglish)}
          </Text>

          <Text style={styles.sentenceSecondary}>
            {formatSecondarySentence(exercises[index].sentenceGerman)}
          </Text>

          <View style={styles.answersContainer}>{renderAnswers()}</View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.buttonContinue}
            onPress={handleContinuePress}
            disabled={index >= exercises.length - 1 || selectedAnswer === ''}>
            <Text style={styles.buttonText}>CONTINUE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    flex: 1,
    backgroundColor: '#3b6c82',
    justifyContent: 'space-between',
  },
  sentenceContainer: {
    alignItems: 'center',
    flex: 1,
  },
  answersContainer: {
    marginTop: 30,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  wrapper: {
    paddingTop: 100,
    backgroundColor: '#75dafe',
    flex: 1,
  },
  title: {
    color: 'white',
  },
  sentencePrimary: {
    fontSize: 28,
    color: 'white',
    marginTop: 20,
  },
  sentenceSecondary: {
    fontSize: 22,
    marginTop: 30,
    color: 'white',
  },
  highlightWord: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginBottom: 30,
  },
  buttonContinue: {
    width: '80%',
    backgroundColor: '#6392a6',
    alignSelf: 'center',
    height: 55,
    borderRadius: 50,
    justifyContent: 'center',
  },
  buttonText: {
    alignSelf: 'center',
    alignContent: 'flex-end',
    color: 'white',
  },
  answerContainer: {
    height: 40,
    backgroundColor: 'white',
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  answerSelectedContainer: {
    height: 40,
    backgroundColor: '#6392a6',
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  answerSecondaryWordContainer: {
    height: 40,
    backgroundColor: '#04e0e7',
    borderRadius: 50,
    paddingHorizontal: 20,
    justifyContent: 'flex-end',
  },
});

export default Exercises;
