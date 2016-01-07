var names =
    [{
        'text':'首页',
        'url': '/yigomobile/main'
    },{
        'text':'新增',
        'url': '/yigomobile/add'
    },{
        'text': '历史纪录',
        'url': '/yigomobile/history'
    },{
        'text': '消息',
        'url': '/yigomobile/news'
    }
];
var NavListItem = React.createClass({
    propTypes: {
        onSelect: React.PropTypes.func.isRequired
    },

    handleClick: function(event) {
        event.preventDefault();
        this.props.onSelect(this.props.uid);
    },

    render: function() {
        var className = React.addons.classSet({
            active: this.props.active
        });

        return (
            <li className={className}>
                <a href={"#" + this.props.url} onClick={this.handleClick}>
                    {this.props.text}
                </a>
            </li>
        );
    }
});
var NavList = React.createClass({
    getInitialState: function() {
        return {active: false};
    },
    getDefaultProps : function () {
        return {
            title : 'Hello World'
        };
    },
    handleClick: function(event) {
        console.log(event);
        this.setState({active: !this.state.active});
    },
    render: function(){
        var text = this.state.active ? 'like' : 'haven\'t liked';
        return (
            <ol onClick={this.handleClick}>
                {
                    names.map(function (name) {
                        return <a href='#' className='' >{name.text}{text}</a>
                        //return <a href={name.url} >{name.text}{text}</a>
                    })
                }
            </ol>
        );
    }
});
//logo
var NavLogo = React.createClass({
    render: function() {
        return <div><img src=""/><h1>{this.props.title}</h1></div>;
    }
});
//nav
var Nav = React.createClass({
    render: function(){
        return (
            <div>
                <NavLogo title="打包工具" />
                <NavList  />
            </div>
        )
    }
});
ReactDOM.render(
    <Nav  />,
    document.getElementById('example')
);


var LikeButton = React.createClass({
    getInitialState: function() {
        return {liked: false};
    },
    handleClick: function(event) {
        this.setState({liked: !this.state.liked});
    },
    render: function() {
        var text = this.state.liked ? 'like' : 'haven\'t liked';
        return (
            <p onClick={this.handleClick}>
                You {text} this. Click to toggle.
            </p>
        );
    }
});