//活动管理
//显示活动
$('.acti-manage').addEventListener('click',function() {
    $('.acti').style.display = 'block';
    if(lastcontentGroupClick !== $('.acti')) {
        lastcontentGroupClick.style.display = 'none';
        lastcontentGroupClick = $('.acti');
    }
    ajax({
        method: 'get',
        url: url + 'act',
        data: {
            token: sessionStorage.token,
            page: 1,
            per_page: 100,
            sortby: "start_time",
            sort: "asc"
            //act_key: 1000, //以下将进行模糊查询
            // act_name: "招新"
        },
        success: function(res) {
            var s = res.data.data;
            var inner = '';
            if (res.data.data[0]) {
                res.data.data.map(function(ele,inedex) {
                    inner += `<div class="activities" activity_id=${ele.activity_id}>
                    <div class="acti-title" onClick="showDetail(${ele.activity_id})"><a>${ele.activity_name}</a></div>
                    <span class="s-btn acti-start">开始</span>
                    <span class="r-btn acti-modi">修改</span>
                    <span class="b-btn acti-dele">关闭</span>
                </div>`;
            })
            $('.acti-main').innerHTML = inner;
            } else {

            }
        },
        error: function(err) {
            if (err.status == 400) {
                console.log(1);
                alert('请求错误，请重新登录');
                //请求错误，请重新登录
                //window.location.replace('./login.html');
            }
        }
    })
})
//显示流程
function showDetail(act_key) {
    console.log(act_key)
    state.args.flowShow = {actKey : act_key};
    state.flowShow;

}
//活动开始修改删除
$('.acti-main').addEventListener('click',function(e){
    var act_key = e.target.parentNode.getAttribute('activity_id');
    console.log(act_key)
    switch (e.target.className){ 
        case 's-btn acti-start': 
            ajax({
                method: 'put',
                url: url + 'act/' + act_key + '/start?token='+ sessionStorage.token,
                success: function(res) { 
                    alert(res.message);
                }
            })
            break; 
        case 'r-btn acti-modi': 
            $('.edit').style.display = 'block';
            $('.add-acti-main').style.display = 'block';
            $('#confirm-add-acti').setAttribute('act-key',act_key);
            $('#confirm-add-acti').setAttribute('change-type','change');
            break; 
        case 'b-btn acti-dele':
            ajax({
                method: 'put',
                url: url + 'act/' + act_key + '/end?token=' + sessionStorage.token,
                success: function(res) { 
                    alert(res.message);
                }
            })
            break;
    
    } 
})
//console.log($('.add-activity'))
$('.add-activity').addEventListener('click',function(){
        $('.edit').style.display = 'block';
        $('.add-acti-main').style.display = 'block';
        $('#confirm-add-acti').setAttribute('change-type','add');
}) 
//添加修改活动
$('#confirm-add-acti').addEventListener('click',function() {
    var method = 'post';
    var nowUrl = url + 'act?token=' + sessionStorage.token;
    if($('#confirm-add-acti').getAttribute('change-type') === 'change') {
        method = 'put';
        nowUrl = url + 'act/' + $('#confirm-add-acti').getAttribute('act-key') + '?token=' + sessionStorage.token;
    }
     ajax({
        method: method,
        url: nowUrl,
        data: {
            activity_name: $('.acti-name').value,
            summary: $('.acti-summary').value,
            max_num: $('.max-num').value, //人数限制，若修改的值低于已报名的人数会返回错误
            location:$('.acti-location').value,
            start_time: $('.acti-st').value.replace('T',' '),
            end_time: $('.acti-et').value.replace('T',' '),
            time_description: $('.time-des').value //以上数据可单个发送请求
        },
        success: function(res) {
            $('.edit').style.display = 'none';
            $('.add-acti-main').style.display = 'none';
            alert(res.message)
            $('.acti-manage').click();
        },
        error: function(error) {
            alert(error.message)
        }
    })
})
function flowDelete(flow_id) {
    ajax({
        method: 'delete',
        url: url + 'flow/' + flow_id,
        data: {
            token: sessionStorage.token,
            flow_id: flow_id
        },
        success: function(res) {
            console.log(res)
        }
    })
}

//短信模板选择渲染
function flowMess() {
    ajax({
        method: 'get',
        url: url + 'sms/',
        data: {
            token: sessionStorage.token,
        },
        success: function(res) {
            if(Object.prototype.toString.call(res.data) !== '[object Array]') {
                res.data = [res.data];
            }
            let tr = res.data.map((item) => {
                return(`<option value=${item.temp_id}>${item.temp_name}</option>`)
            })
            $('.flow-mess').innerHTML = tr.join('');
        }
    })
}
//新增流程框框
$('.add-flow').addEventListener('click',() => {
    flowMess();
    $('#confirm-add-flow').setAttribute('change-type','add');
    openEdit($('.add-flow-main'));
})
//新增修改流程
$('#confirm-add-flow').addEventListener('click',() => {
    var method = 'post';
    var nowUrl = url + 'flow?token=' + sessionStorage.token;
    if($('#confirm-add-flow').getAttribute('change-type') === 'change') {
        method = 'put';
        nowUrl = url + 'flow/' + $('#confirm-add-flow').getAttribute('flow-id') + '?token=' + sessionStorage.token;
    }
    ajax({
        method: method,
        url: nowUrl,
        data: {
            flow_name: $('.flow-name').value,
            act_key: state.args.flowShow.actKey,
            location: $('.flow-location').value,
            time_description: $('.flow-time-des').value,
            type: $('.flow-select').value,
            sms_temp_id:  $('.flow-mess').value
        },
        success: function(res) {
            alert(res.message);
            state.flowShow;
            //console.log(res)
        },
        error: function(res) {
            alert(res.message)
            console.log(res)
        }
    })
})


//修改flow
function flowChange(flow_id) {
    flowMess();
    $('#confirm-add-flow').setAttribute('change-type','change');
    $('#confirm-add-flow').setAttribute('flow-id',flow_id);
    openEdit($('.add-flow-main'));
}

//详情flow
function flowShow(flow_id) {
    ajax({
        method: 'get',
        url: url + 'flow/' + flow_id,
        data: {
            token: sessionStorage.token,
        },
        success: function(res) {
            let arr = ['报名','面试','笔试'];
            let inner = `<h3>流程详情</h3>
                <p>流程名：${res.data.flow_name}</p>
                <p>地点：${res.data.location}</p>
                <p>报名方式：${arr[res.data.type]}</p>
                <p>时间：${res.data.time_description}</p>
                <p>短信模板：${res.data.sms_temp}</p>
                <p>短信模板中的name：各自的名字</p>
                <p>短信模板中的content：${res.data.sms_variables.content}</p>
                <p>短信模板中的next：${res.data.sms_variables.next}</p>`
            $('.show-flow-main-mess').innerHTML = inner;
            openEdit($('.show-flow-main'));
        }
    })
}
