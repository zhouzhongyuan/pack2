


var plist = require('plist');
var json = { items:
    [
        {assets:[
            {kind: 'software-package',
             url: 'https://github.com/digbly/ios/blob/master/%E7%A7%BB%E5%8A%A8%E5%8A%9E%E5%85%AC.ipa'},
            {kind: 'display-image',
             url: 'https://dn-bokewebapp.qbox.me/gzw.png'},
            {kind: 'full-size-image',
             url: 'https://dn-bokewebapp.qbox.me/gzw.png'}]
        },
        {metadata:{
                'bundleidentifier': o.appPackageName,
                'bundle-version': o.appVersion,
                'kind':'software',
                'title': o.appName
            }
        }
    ]
};
var obj = plist.build(json);