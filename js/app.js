'use strict';

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

window.ee = new EventEmitter();

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

class Add extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            agreeNotChecked: true,
            authorIsEmpty: true,
            textIsEmpty: true
        };
        this.onBtnClickHandler = this.onBtnClickHandler.bind(this);
        this.onCheckRuleClick = this.onCheckRuleClick.bind(this);
        this.onFieldChange = this.onFieldChange.bind(this);
    }

    componentDidMount() {
        ReactDOM.findDOMNode(this.refs.author).focus();
    }

    onBtnClickHandler(e) {
        e.preventDefault();
        var textEl = ReactDOM.findDOMNode(this.refs.text);
        var author = ReactDOM.findDOMNode(this.refs.author).value;
        var text = textEl.value;
        var item = [{
            author: author,
            text: text,
            bigText: '...'
        }];

        window.ee.emit('News.add', item);

        textEl.value = '';
        this.setState({textIsEmpty: true});
    }

    onCheckRuleClick(e) {
       this.setState({agreeNotChecked: !this.state.agreeNotChecked});
    }

    onFieldChange(fieldName, e) {
        if (e.target.value.trim().length > 0) {
            this.setState({['' + fieldName]: false})
        } else {
            this.setState({['' + fieldName]: true})
        }
    }

    render() {
        var agreeNotChecked = this.state.agreeNotChecked,
            authorIsEmpty = this.state.authorIsEmpty,
            textIsEmpty = this.state.textIsEmpty;

        return(
            <form className="add cf">
                <input
                    type="text"
                    className="add__author"
                    onChange={this.onFieldChange.bind(this, 'authorIsEmpty')}
                    placeholder="Ваше ім'я"
                    ref="author"
                />
                <textarea
                    className="add__text"
                    onChange={this.onFieldChange.bind(this, 'textIsEmpty')}
                    placeholder="Текс новини"
                    ref="text"
                ></textarea>
                <label className="add__checkrule">
                    <input
                        type="checkbox"
                        rel="checkrule"
                        onChange={this.onCheckRuleClick}
                    />Я погоджуюсь з правилами
                </label>
                <button
                    className="add__btn"
                    onClick={this.onBtnClickHandler}
                    ref="alert_button"
                    disabled={agreeNotChecked || authorIsEmpty || textIsEmpty}
                    >Додати новину
                </button>
            </form>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {news: my_news};
    }

    componentDidMount() {
        var self = this;
        window.ee.addListener('News.add', function(item) {
            var nextNews = item.concat(self.state.news);
            self.setState({news: nextNews});
        });
    }

    componentWillUnmount() {
        window.ee.removeListener('News.add');
    }

    render() {
        var news = this.state.news;

        console.log('render');
        return (
            <div className="app">
                <h3>Новини</h3>
                <Add />
                <News data={news} /> {/*Add property data*/}
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
