import React from 'react';
class Share extends React.Component {
  constructor(props) {
    super(props);
    this.displayPanel = this.displayPanel.bind(this);
    this.fetchCardData = this.fetchCardData.bind(this);
  }

  fetchCardData = (event) => {
    if (this.props.formCompleted === true) {
      this.props.fetchCardData();
    } else {
      event.preventDefault();
    }
  };

  displayPanel(ev) {
    ev.preventDefault();
    this.props.handleCollapse(ev.currentTarget.id);
  }

  render() {
    const tweet = 'Bette Calman te aconseja que mires esta tarjeta, Namaste 🙏';
    return (
      <article className="article__share">
        {/* --Share close--> */}
        <div className="form__closed__share" id={this.props.id} onClick={this.displayPanel}>
          <h2 className="article__share__title">
            <i className="fas fa-share-alt"></i> COMPARTE
          </h2>
          <div className="form__arrow--share">
            <i className={`fas fa-chevron-up ${this.props.activePanel === this.props.id ? 'open' : 'close'}`}></i>
          </div>
        </div>
        {/* --Share open--> */}
        <div className={`form__open__share ${this.props.activePanel === this.props.id ? 'active' : 'hidden'}`}>
          <div className="article__share__container">
            <button onClick={this.fetchCardData} className={`article__share__button ${this.props.formCompleted ? '' : 'disabled'}`}>
              <i className="far fa-address-card"></i>CREAR TARJETA
            </button>
            <small className="article__share__warning">
              {this.props.formCompleted === false ? 'Los campos obligatorios están marcados con *' : ''}
              {this.props.isLoading === true ? '⌛ Tu tarjeta se está generando' : ''}
            </small>
          </div>
          <div className={`article__share__create  ${this.props.cardSuccess === false ? 'hidden' : ''}`}>
            <h3 className="article__share_copy">La tarjeta ha sido creada:</h3>
            <a className="response link_card" href={this.props.cardURL} target="_blank" rel="noopener noreferrer">
              {this.props.cardURL}
            </a>
            <a
              className="article__twitter__button"
              target="_blank"
              href={`https://twitter.com/intent/tweet?text=${tweet}&url=${this.props.cardURL}`}
              rel="noopener noreferrer"
            >
              <div className="child">
                <i className="fab fa-twitter"></i> Compartir en Twitter
              </div>
            </a>
          </div>
        </div>
      </article>
    );
  }
}

export default Share;
