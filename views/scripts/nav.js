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
        'text': '参数',
        'url': '/yigomobile/arguments'
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
    getDefaultProps : function () {
        return {
            activeTabUid : 'Home'
        };
    },
    render: function() {
        //var className = React.addons.classSet({
        //    active: this.props.active
        //});
        console.log(this.props.active);
        var className = this.props.active?'active':null;
        return (
            <li className={className}>
                <a href={"#" + this.props.uid} onClick={this.handleClick}>
                    {this.props.uid}
                </a>
            </li>
        );
    }
});


var NavList = React.createClass({
    getDefaultProps : function () {
        return {
            activeTabUid : 'Home'
        };
    },
    render: function() {
        var tabNodes = this.props.tabs.map(function(tab) {
            console.log(this.props.activeTabUid, tab.uid);
            return (
                <NavListItem
                    active={this.props.activeTabUid === tab.uid}
                    key={tab.uid}
                    onSelect={this.props.navigateToTab}
                    uid={tab.uid} />
            );
        }, this);

        return (
            <ul className="nav nav-tabs">
                {tabNodes}
            </ul>
        );
    }
});

var navigateToTab = function(data){
    console.log(this,data);
};
ReactDOM.render(
    //<Nav  />,
    <NavList
        navigateToTab={navigateToTab}
        tabs={[{uid: "Home"}, {uid: "Contact"}]} />,
    document.getElementById('example')
);








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