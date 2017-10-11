//路由
window.addEventListener('popstate',(e)=>{
    if(e.state === null) return;
    switch (e.state.url) {
        case 'acti': 
        $('.acti').style.display = 'block';
        $('.tips').innerHTML = tipsArr[0];
        if(lastcontentGroupClick !== $('.acti')) {
            lastcontentGroupClick.style.display = 'none';
            lastcontentGroupClick = $('.acti');
        }
        state.actiShow;
            //$('.acti-manage').click();
        break;
        case 'mess': 
            //$('.message').click();
            if(lastcontentGroupClick !== $('.mess')) {
                $('.mess').style.display = 'block';
                lastcontentGroupClick.style.display = 'none';
                lastcontentGroupClick = $('.mess');
            }
            state.messShow;
        break;
        case 'data':
            $('.order').innerText = sessionStorage.title;
            state.args.dataShow.pageNum = e.state.args.pageNum;
            state.dataShow;
        break;
        case 'his': 
            $('.show-mess-his-main').style.display = 'block';
            if(lastcontentGroupClick !== $('.show-mess-his-main')) {
                lastcontentGroupClick.style.display = 'none';
                lastcontentGroupClick = $('.show-mess-his-main');
            }
            state.args.hisShow = e.state.args;
            state.hisShow;
        break;
        case 'messCreate': 
            if(lastcontentGroupClick !== $('.template')) {
                $('.template').style.display = 'block';
                lastcontentGroupClick.style.display = 'none';
                lastcontentGroupClick = $('.template');
            }
        break;
        case 'flow':
            $('.tips').innerHTML = tipsArr[1];
            state.args.flowShow = e.state.args;
            state.flowShow;
        break;
    }

})
window.addEventListener('load',(e)=>{
    //console.log('load')
    if(history.state === null) return;
    switch (history.state.url) {
        case 'acti': 
            $('.acti-manage').click();
        break;
        case 'mess': 
            $('.message').click();
        break;
        case 'data':
            $('.order').innerText = sessionStorage.title;
            state.args.dataShow = history.state.args;
            state.dataShow;
        break;
        case 'messCreate': 
             $('.create').click();
        break;
        case 'flow':
            $('.tips').innerHTML = tipsArr[1];
            state.args.flowShow = history.state.args;
            state.flowShow;
        break;
        case 'his': 
        $('.show-mess-his-main').style.display = 'block';
        if(lastcontentGroupClick !== $('.show-mess-his-main')) {
            lastcontentGroupClick.style.display = 'none';
            lastcontentGroupClick = $('.show-mess-his-main');
        }
        //console.log(history.state.args)
        state.args.hisShow = history.state.args;
        state.hisShow;
        break;
    }
})

