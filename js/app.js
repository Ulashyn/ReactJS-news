var my_news = [
  {
    author: 'Саша Спілберг',
    text: 'В четверг, четвертого числа...',
    bigText: 'моросив осінній до і тихо падало лисьтя. Прийшла справжня осінь.'
  },
  {
    author: 'Просто Вася',
    text: 'Рахую, що $ має коштувати 8 гривень!',
    bigText: 'А € по 11!'
  },
  {
    author: 'Гість',
    text: 'Безкоштовно. Зкачати. Кращий сайт - http://localhost:3000',
    bigText: 'Насправді платний, просто потрібно прочитати дуже довгу ліцензійну згоду.'
  }
];

class News extends React.Component {
    render() {
        var data = this.props.data;
        var newsTemplate;

        if(data.length>0){
            newsTemplate= data.map(function (item, index) {
                return (
                    <div key={index}>
                        <Article data={item} />
                    </div>
                )
            });
        }else{
            newsTemplate = <p>Нажаль новини відсутні.</p>
        }
        return (
            <div className="news">
                {newsTemplate}
                <strong className={'news__count ' + (data.length > 0 ? '':'none')}>Всього новин: {data.length}</strong>
            </div>
        );
    }
}

class Article extends React.Component {
    constructor(props) {
        super(props);
        this.state = {visible: false};
        this.readMoreClick = this.readMoreClick.bind(this);
    }

    readMoreClick(e) {
        e.preventDefault();
        this.setState({visible: true})
    }

    render() {
        var author = this.props.data.author,
            text = this.props.data.text,
            bigText = this.props.data.bigText,
            visible = this.state.visible;

        return (
            <div className="article">
                <p className="news__author">{author}:</p>
                <p className="news__text">{text}</p>
                <a href="#" 
                    onClick={this.readMoreClick} 
                    className={'news__readmore ' + (visible ? 'none' : '')}>
                    Детальніше >
                </a>
                <p className={'news__big-text ' + (visible ? '' : 'none')}>{bigText}</p>
            </div>
        );
    }
}

class TestInput extends React.Component {
    constructor(props) {
        super(props);
        this.onBtnClickHandler = this.onBtnClickHandler.bind(this);
    }

    componentDidMount() {
        ReactDOM.findDOMNode(this.refs.myTestInput).focus();
    }

    onBtnClickHandler() {
        console.log(this.refs);
        alert(ReactDOM.findDOMNode(this.refs.myTestInput).value);
    }

    render() {
        return(
            <div>
                <input 
                    type="text"
                    className="test-input" 
                    defaultValue="" 
                    placeholder="Введіть значення"
                    ref="myTestInput"
                />
                <button className="test-button" onClick={this.onBtnClickHandler} ref="alert_button">Показати alert</button>
            </div>
        );
    }
}

class App extends React.Component {
    render() {
        return (
            <div className="app">
                <h3>Новини</h3>
                <TestInput />
                <News data={my_news} /> {/*додали властивість data*/}
            </div>
        );
    }
}

News.propTypes = {
    data: PropTypes.array.isRequired
};

Article.propTypes = {
         data: PropTypes.shape({
            author: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired,
            bigText: PropTypes.string.isRequired
        })
};
ReactDOM.render(
    <App />,
    document.getElementById('root')
);
