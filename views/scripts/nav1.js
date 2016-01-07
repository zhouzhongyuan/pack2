/**
 * Using React 0.13.2
 *
 * - 2015-04-28: Update from React 0.12 to 0.13.2
 * - 2015-04-14: Load all assets over SSL
 */

var Tab = React.createClass({
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
                <a href={"#" + this.props.uid} onClick={this.handleClick}>
                    {this.props.uid}
                </a>
            </li>
        );
    }
});


var TabMenu = React.createClass({
    render: function() {
        var tabNodes = this.props.tabs.map(function(tab) {
            return (
                <Tab
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

var navigateToTab = function(uid) {
    router.navigate(uid.toLowerCase(), {trigger: true});
};

var tabMenu = React.render(
    <TabMenu
        navigateToTab={navigateToTab}
        tabs={[{uid: "Home"}, {uid: "Contact"}]} />,
    document.getElementById("application")
);

var Router = Backbone.Router.extend({
    routes: {
        "": "home",
        "home": "home",
        "contact": "contact"
    },

    contact: function() {
        tabMenu.setProps({activeTabUid: "Contact"});
    },

    home: function() {
        tabMenu.setProps({activeTabUid: "Home"});
    }
});
var router = new Router();
Backbone.history.start();