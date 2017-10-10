var url = 
//'/activity/api/',
'https://redrock.team/activity/api/',
    pageUrl='/manage.html#/',
    lastcontentGroupClick = $('.acti');
    console.log(sessionStorage.token)
function $(ele) {
    if (document.querySelectorAll(ele).length === 1) {
        return document.querySelector(ele);
    } else {
        return document.querySelectorAll(ele);
    }
}
var tipsArr = ['TIPS:<br/> 1. 点击开始，微信端将开启该活动的报名入口。<br/>2. 点击活动名称，进入流程设计界面','TIPS：<br/>1. 点击右上角新增流程，创建一个新的流程；<br/>2. 创建\修改时可以绑定短信模板（该模板将会用于对该流程下的报名人员的短信发送）；<br/>3. 需要新的短信模板请先点击菜单"短信模板"->"新建短信模板"。']
function ajax(conf) {
    var method = conf.method;
    var url = conf.url;
    var success = conf.success;
    var error = conf.error;
    var type = conf.type === undefined ? 'form' :  conf.type;
    var data = conf.data;
    var xhr = new XMLHttpRequest();
    var urlData = '';
    var successInfo = new RegExp("2[0-9]{2}");
    var errorInfo = new RegExp("4|5[0-9]{2}");
    if(method.toLowerCase() === 'get' || method.toLowerCase() === 'delete') {
        for(var key in data) {
            urlData += key + '=' + data[key] + '&';
        }
        url = url + '?' + urlData.substring(0,urlData.length-1);
    }
    xhr.open(method, url, true);
    if (method.toLowerCase() === 'get' || method.toLowerCase() === 'delete') {
        xhr.send(null);
    } else if (method.toLowerCase() === 'post') {
        if (type.toLowerCase() === 'json') {
            xhr.setRequestHeader('content-type', 'application/json');
            xhr.send(JSON.stringify(data));
        } else if (type.toLowerCase() === 'form') {
            for(var key in data) {
                urlData += key + '=' + data[key] + '&';
            }
            xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
            xhr.send(urlData.substring(0,urlData.length-1));
        } else {
            xhr.send(data);
        }
    } else if (method.toLowerCase() === 'put') {
            for(var key in data) {
                urlData += key + '=' + data[key] + '&';
            }
            xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
            xhr.send(urlData.substring(0,urlData.length-1));
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && successInfo.test(xhr.status)) {
            if(xhr.responseText != '') {
                success(JSON.parse(xhr.responseText));
            } else {
                success(xhr.responseText);
            }
        } else if (xhr.readyState === 4 && errorInfo.test(xhr.status)) {
            console.log(xhr.status)
            if(error !== undefined) {
                error(JSON.parse(xhr.responseText));
            }
        }
    };
};

//关闭浮动窗 
$('.edit').addEventListener('click',function(e) {
    if(e.target.classList.contains('icon-close')) {
        $('.edit').style.display = 'none';
        e.target.parentNode.style.display = 'none';
    }
})
//打开弹框
function openEdit(ele) {
    $('.edit').style.display = 'block';
    ele.style.display = 'block';
}


let state = {};    
state.args = {}; 
Object.defineProperties(state,{
    //数据名单
    dataShow: {
        enumerable: true,
        set:function(res) {
            //console.log(res)
            if(lastcontentGroupClick !== $('.data')) {
                $('.data').style.display = 'block';
                lastcontentGroupClick.style.display = 'none';
                lastcontentGroupClick = $('.data');
            }
            let tr = '';
            res.date.data.map((ele,index) => {
                tr += `<tr enroll-id=${ele.enroll_id} >
                    <td class="check"><input type="checkbox"></td>
                    <td class="code">${ele.stu_code}</td>
                    <td class="name">${ele.full_name}</td>
                    <td class="phone">${ele.contact}</td>
                    <td class="info">${ele.was_send_sms === 0 ? '否' : '是'}</td>
                    <td class="status"><input type="number" class="data-input-socre" value=${ele.score === null ? 0 : ele.score} onblur="pushScore({enroll_id:${ele.enroll_id},score:parseInt(this.value)})"/></td>
                    <td class="mod mod-btn"><button class="x-btn">详情</button></td>
                    <td class="mod mod-btn"><button class="r-btn">修改</button></td>
                    <td class="finish fin-btn"><button class="b-btn">移除</button></td>
                </tr>`
            })
            let page = '';
            let pageClick = 'page-click';
            let pageLast = 'page-num';
            //console.log(state.args.dataShow.pageNum)
            for(let i = 1; i <= res.date.last_page; i ++) {
                page +=`<li class=${i == state.args.dataShow.pageNum ? pageClick : pageLast}>${i}</li>`;
            }
            //console.log(page)
            $('.page').innerHTML = page;
            $('.data-tbody').innerHTML = tr;

        },
        get: function() {
            ajax({
                method: 'get',
                url: url + 'applydata',
                data: {
                    token: sessionStorage.token,
                    act_key: state.args.dataShow.actKey,
                    flow_id: state.args.dataShow.flowId,
                    sortby: 'score',
                    sort: 'asc',
                    page: state.args.dataShow.pageNum,
                    per_page: 10
                },
                success: function(res) {
                    state.dataShow = res;
                }

            })
        }
    },
    //流程显示
    flowShow: {
        set: function(res) {
            $('.acti-details').children[0].innerHTML = res.data.activity_name;
            $('.acti-details').children[1].innerHTML = `已有${res.data.current_num}人报名`;
            $('.acti-details').children[2].innerHTML = res.data.time_description;
            $('.acti-details').children[3].innerHTML = res.data.summary;
            $('.acti-details-interview').innerHTML = '';
            console.log(res)
            res.data.flowList.map(function(e) {
                $('.acti-details-interview').innerHTML += `<div class="interview">
                    <div class="fir-inter">${e.flow_name}</div>
                    <span class="s-btn acti-start" onclick="flowShow(${e.flow_id})">详情</span>
                    <span class="r-btn acti-modi" onclick="flowChange(${e.flow_id})">修改</span>
                    <span class="b-btn acti-dele" onclick="flowDelete(${e.flow_id})">删除</span>
                </div>`;
            })
            lastcontentGroupClick.style.display = 'none';
            $('.acti-details').style.display = 'block';
            lastcontentGroupClick = $('.acti-details');
        },
        get: function() {
            ajax({
                method: 'get',
                async: true,
                url: url + 'act/' + state.args.flowShow.actKey,
                data: {
                    token: sessionStorage.token
                },
                success: function(res) {
                    console.log(this);
                    state.flowShow = res;
                }
            }) 
        }
    },
    //活动显示
    actiShow: {
        set: function(res){
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
        get: function() {
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
                    state.actiShow = res;
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
        }
    },
    //短信显示
    messShow: {
        set: function(res) {
            if(Object.prototype.toString.call(res.data) !== '[object Array]') {
                res.data = [res.data];
            }
            let tr = res.data.map((item) => {
                return(`<tr admin-temp-id=${item.temp_id}>
                        <td>${item.temp_name}</td>
                        <td>${item.was_test === 0 ? '未测试' : '已测试'}</td>
                        <td><button class="x-btn">修改</button></td>
                        <td><button class="r-btn">详情</button></td>
                        <td class="test"><button class="b-btn">测试</button></td>
                    </tr>`)
            })
            $('.mess-tbody').innerHTML = tr.join('');
        },
        get: function() {
            ajax({
                method: 'get',
                url: url + 'sms/',
                data: {
                    token: sessionStorage.token,
                },
                success: function(res) {
                    state.messShow = res;
                }
            })
        }
    },
    hisShow: {
        set: function(res) {
            let inner = '';
            res.data.data.map((item)=>{
                inner += `<li class="show-mess-his-content">内容:${item.content}&emsp;&emsp;是否发送成功:${item.smg === '*' ? '发送失败' : '发送成功'}&emsp;&emsp;失败原因（成功为空)${item.sub_msg === null ? '' : item.sub_msg}</li>`;
            })
            $('.show-mess-his-ul').innerHTML = inner;
            let page = '';
            let pageClick = 'page-his-click';
            let pageLast = 'page-his-num';
            //console.log(state.args.dataShow.pageNum)
            for(let i = 1; i <= res.data.last_page; i ++) {
                page +=`<li class=${i == state.args.hisShow.pageNum ? pageClick : pageLast}>${i}</li>`;
            }
            $('.show-mess-his-page').innerHTML = page;
        },
        get: function() {
            ajax({
                method: 'get',
                url: url + 'sms/history',
                data: {
                    token: sessionStorage.token,
                    page: state.args.hisShow.pageNum,
                    per_page: 2,
                    status: 1
                },
                success: function(res) {
                    state.hisShow = res;
                },
                error: function(res) {
                    console.log(res.message)
                }
            })
        }
    }
})

//充值
// $('.recharge').addEventListener('click',() => {
//     openEdit($('.recharge-main'));
// })
$('#recharge-test').addEventListener('click',() => {
    new Promise((resolve,reject) => {
        ajax({
            method: 'get',
            url: url + 'admin/org',
            data: {
                token: sessionStorage.token
            },
            success: function(res) {
                let id;
                res.data.map((item) => {
                    if($('.admin-name').value == item.account) {
                        resolve(item.admin_id);
                    }
                })
                reject('用户名错误');
            }
        })
    }).then((res) => {
        ajax({
            method: 'post',
            url: url + 'admin/smscharge?token=' + sessionStorage.token,
            data: {
                admin_id: res,
                sms_num: $('.sms-num').value
            },
            success: function(res) {
                alert(res.message)
                console.log(res)
            },
            error: function(res) {
                alert(res.message)
                console.log(res)
            }
        })
        //console.log(res)
    }).catch((err) => {
        alert(err)
    })
})



//路由
window.addEventListener('popstate',(e)=>{
    if(e.state === null) return;
    switch (e.state.url) {
        case 'acti': 
            $('.acti-manage').click();
        break;
        case 'mess': 
            $('.message').click();
        break;
        case 'data':
            console.log(e.state.args)
            state.args.dataShow.pageNum = e.state.args.pageNum;
            state.dataShow;
        break;
    }

})
window.addEventListener('load',(e)=>{
    console.log(history.state)
    switch (history.state.url) {
        case 'acti': 
            $('.acti-manage').click();
        break;
        case 'mess': 
            $('.message').click();
        break;
        case 'data':
            // state.args.dataShow = 
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
    }
})