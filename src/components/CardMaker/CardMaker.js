import React from 'react';
import Form from './Form/Form';
import Preview from './Preview';
import Footer from '../Footer';
import Header from '../Header';
import defaultImage from './Form/image/defaultImage';
import ls from '../../services/localStorage.js';
import { fetchCardData } from '../../services/CardService';
import grandmaBot from '../../services/grandmaBot';
import spiritualName from '../../services/spiritualName';

class CardMaker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAvatarDefault: true,
      userInfo: {
        palette: '1',
        name: '',
        job: '',
        photo: defaultImage,
        email: '',
        phone: '',
        linkedin: '',
        github: '',
      },
      activePanel: 'collapse-1',
      formCompleted: false,
      cardURL: '',
      isLoading: false,
      cardSuccess: false,
      grandmaActive: false,
      spiritual: false,
      inputName: 'Bette Calman',
      inputJob: 'Grandma Karma',
    };
    this.initialState = this.state;
    this.handleInfo = this.handleInfo.bind(this);
    this.handleCollapse = this.handleCollapse.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.updateAvatar = this.updateAvatar.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.fetchCardData = this.fetchCardData.bind(this);
    this.setURL = this.setURL.bind(this);
    this.handleGrandma = this.handleGrandma.bind(this);
    this.handleRandomQuote = this.handleRandomQuote.bind(this);
    this.handleRandomName = this.handleRandomName.bind(this);
  }

  //Modifica el valor de UserInfo con los datos recogidos en el input del formulario
  handleInfo(inputId, inputValue) {
    this.setState(
      (prevState) => {
        return {
          userInfo: {
            ...prevState.userInfo,
            [inputId]: inputValue,
          },
        };
      },
      () => this.validateForm()
    );
  }

  //Valida que estén todos los campos rellenos excepto el teléfono que no es obligatorio
  validateForm() {
    let completedValues = 0;
    Object.entries(this.state.userInfo).forEach(([key, value]) => {
      if (value !== '' && key !== 'phone') {
        completedValues = completedValues + 1;
      }
    });
    if (completedValues === 7) {
      this.setState({ formCompleted: true });
    } else if (completedValues !== 7) {
      this.setState({ formCompleted: false });
      this.setState({cardSuccess: false})
    }
  }
  componentDidMount() {
    let localStorage = ls.get('localData', {
      userInfo: this.state.userInfo,
      spiritual: this.state.spiritual,
    });
    this.setState({ userInfo: localStorage.userInfo, spiritual: localStorage.spiritual }, () => this.validateForm());
  }

  componentDidUpdate() {
    ls.set('localData', { userInfo: this.state.userInfo, spiritual: this.state.spiritual });
  }

  //actualiza la imagen de la tarjeta y recoge que ya no es la imagen por defecto
  updateAvatar(img) {
    const { userInfo } = this.state;
    this.setState((prevState) => {
      const newProfile = { ...userInfo, photo: img };
      return {
        userInfo: newProfile,
        isAvatarDefault: false,
      };
    });
  }

  handleReset() {
    this.setState(this.initialState);
  }

  handleCollapse(targetId) {
    //si el colapsable que he clickado es distinto que el guardado en el estado, seteo de nuevo el estado
    //con el valor del colapsable clickado, en caso contrario reseteo el valor del colapsable
    if (targetId !== this.state.activePanel) {
      this.setState({ activePanel: targetId });
    } else {
      this.setState({ activePanel: '' });
    }
  }

  handleGrandma() {
    setTimeout(() => {
      this.setState({
        grandmaActive: false,
      });
    }, 10000);
    this.setState({
      grandmaActive: true,
    });
  }
  handleRandomName(ev) {
    const checked = ev.target.checked;
    this.setState({ spiritual: checked }, this.handleCheckedName(checked));
  }

  handleSpiritualJob() {
    if (this.state.userInfo.palette === '1') {
      return 'Reactjsdha';
    } else if (this.state.userInfo.palette === '2') {
      return 'Sassrhara';
    } else if (this.state.userInfo.palette === '3') {
      return 'Javascripna';
    }
  }

  handleCheckedName(checked) {
    if (checked === true) {
      const number1 = this.randomNumber(spiritualName.name.length);
      const number2 = this.randomNumber(spiritualName.surname.length);
      const newName = spiritualName.name[number1] + ' ' + spiritualName.surname[number2];
      const newJob = this.handleSpiritualJob() + ' Charkra';
      const { userInfo } = this.state;
      this.setState({ inputName: this.state.userInfo.name, inputJob: this.state.userInfo.job });
      this.setState((prevState) => {
        const newProfile = { ...userInfo, name: newName, job: newJob };
        return {
          userInfo: newProfile,
        };
      });
    } else {
      const { userInfo } = this.state;
      this.setState((prevState) => {
        const newProfile = { ...userInfo, name: this.state.inputName, job: this.state.inputJob };
        return {
          userInfo: newProfile,
        };
      });
    }
  }

  randomNumber(max) {
    return Math.floor(Math.random() * max);
  }

  handleRandomQuote() {
    const number = this.randomNumber(grandmaBot.length);
    return grandmaBot[number];
  }

  fetchCardData() {
    const json = JSON.parse(localStorage.getItem('localData'));
    const object = json.userInfo;
    fetchCardData(object)
      .then((result) => this.setURL(result))
      .catch((error) => console.log(error));
    this.setState({
      isLoading: true,
    });
  }

  setURL(result) {
    if (result.success) {
      this.setState({
        cardURL: result.cardURL,
        isLoading: false,
        cardSuccess: true,
      });
    } else {
      this.setState({
        cardURL: 'ERROR:' + result.error,
        isLoading: false,
      });
    }
  }

  render() {
    const { userInfo, isAvatarDefault } = this.state;
    return (
      <div>
        <Header />
        <main className="main__grid">
          <Preview
            userInfo={this.state.userInfo}
            resetInfo={this.handleReset}
            photo={userInfo.photo}
            grandmaActive={this.state.grandmaActive}
            handleGrandma={this.handleGrandma}
            handleRandomQuote={this.handleRandomQuote}
          />
          <Form
            userInfo={this.state.userInfo}
            getInformation={this.handleInfo}
            activePanel={this.state.activePanel}
            handleCollapse={this.handleCollapse}
            updateAvatar={this.updateAvatar}
            isAvatarDefault={isAvatarDefault}
            photo={userInfo.photo}
            formCompleted={this.state.formCompleted}
            validateForm={this.validateForm}
            cardURL={this.state.cardURL}
            fetchCardData={this.fetchCardData}
            cardSuccess={this.state.cardSuccess}
            isLoading={this.state.isLoading}
            spiritual={this.state.spiritual}
            handleRandomName={this.handleRandomName}
          />
        </main>
        <Footer />
      </div>
    );
  }
}
export default CardMaker;
