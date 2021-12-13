function CodeTrace(objParams){
    let appid = objParams.appid || '';
    let params = objParams.params || '';
    let successFunc = objParams.success;
    let errorFunc = objParams.error;

    var url = '';
    var jsurl = '';
    let scripts = document.querySelectorAll('script');
    for(var i = 0; i < scripts.length; i++){
        let src = scripts[i].getAttribute('src');
        if(/codetrace\.js$/.test(src)){
            jsurl = src;
            break;
        }
    }
    if(jsurl != ''){
        let match = jsurl.match(/(https?:\/\/[^\/]+)/i);
        if(match != null){
            url = match[1];
        }
    }
    if(url == ''){
        if(errorFunc){
            errorFunc();
        }
        return;
    }
    url += '/codetrace/report';

    var ua = navigator.userAgent.toLowerCase();
    var os = 'unknown';
    if(ua.match('android')){
        os = 'android';
    }else if(ua.match(/(ipad|iphone|ipod)/g)){
        os = 'ios';
    }else if(ua.match('windows')){
        os = 'windows';
    }else if(ua.match('linux')){
        os = 'linux';
    }else if(ua.match('bsd')){
        os = 'bsd';
    }else if(ua.match('mac')){
        os = 'osx';
    }

    let w = window.screen.width < window.screen.height ? window.screen.width : window.screen.height;
    let h = window.screen.height < window.screen.width ? window.screen.width : window.screen.height;
    let size = w+'x'+h;

    let callback = '_handleCallback';
    window[callback] = function(json){
        if(successFunc){
            successFunc(json);
        }
    };

    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url+'?appid='+appid+'&params='+params+'&os='+os+'&size='+size+'&callback='+callback;
    script.onerror = function(){
        if(errorFunc){
            errorFunc();
        }
    };
    let scriptNode = document.getElementsByTagName('script')[0];
    scriptNode.parentNode.appendChild(script);
}