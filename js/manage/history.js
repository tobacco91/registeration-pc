//显示短信历史
$('.his').addEventListener('click',function() {
    $('.show-mess-his-main').style.display = 'block';
    if(lastcontentGroupClick !== $('.show-mess-his-main')) {
        lastcontentGroupClick.style.display = 'none';
        lastcontentGroupClick = $('.show-mess-his-main');
    }
    state.args.hisShow = {pageNum: 1};
    state.hisShow;
    history.pushState({url: 'his',args:state.args.hisShow},'',pageUrl + 'his?pageNum=1')
})
$('.show-mess-his-page').addEventListener('click',(e) => {
    if(e.target.classList.contains('page-his-num')) {
        state.args.hisShow.pageNum = e.target.innerText;
        state.hisShow;
        history.pushState({url: 'his',args: state.args.hisShow},'',pageUrl + 'his?pageNum='+ e.target.innerText)
    }
})