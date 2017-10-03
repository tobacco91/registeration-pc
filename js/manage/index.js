var url = 'http://wx.idsbllp.cn/activity/api/',
    lastcontentGroupClick = $('.acti');
    console.log(sessionStorage.token)
function $(ele) {
    if (document.querySelectorAll(ele).length === 1) {
        return document.querySelector(ele);
    } else {
        return document.querySelectorAll(ele);
    }
}

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
                    <td class="name">${ele.full_name}</td>
                    <td class="status"><input type="number" class="data-input-socre" value=${ele.score === null ? 0 : ele.score} onblur="pushScore({enroll_id:${ele.enroll_id},score:parseInt(this.value)})"/></td>
                    <td class="phone">${ele.contact}</td>
                    <td class="mod mod-btn"><button class="x-btn">详情</button></td>
                    <td class="mod mod-btn"><button class="r-btn">修改</button></td>
                    <td class="finish fin-btn"><button class="b-btn">移除</button></td>
                </tr>`
            })
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
                    page: 1,
                    per_page: 20
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
    }

})


$('.recharge').addEventListener('click',() => {
    openEdit($('.recharge-main'));
})
$('#recharge-test').addEventListener('click',() => {
    ajax({
        method: 'post',
        url: url + 'admin/smscharge?token=' + sessionStorage.token,
        data: {
            amdin_id: "2",
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
})
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

//数据管理
//渲染nav
function dataNav() {
    let ul = '';
    ajax({
        method: 'get',
        url: url + 'act/flow',
        data: {
            token: sessionStorage.token
        },
        success: function(res) {
           // console.log(res)
            res.data.map((ele,index) => {
                ul += `<li><a href="#">${ele.activity_name}</a><ul>`;
                ele.flowlist.map((item,index) => {
                    ul +=`<li><a href="#" class="data-choose" activity-id=${ele.activity_id} flow-id=${item.flow_id} li-title=${ele.activity_name+"-"+item.flow_name}>${item.flow_name}</a></li>`
                })
                ul += `</ul></li>`;
            })
            $('.nav-data-second').innerHTML = ul;
        }
    })

}
dataNav()

//数据管理名单渲染  


//点击nav   
$('.nav-data-second').addEventListener('click',(e) => {
    if(e.target.classList.contains('data-choose')) {
        $('.order').innerText = e.target.getAttribute('li-title');
        state.args.dataShow = {
                actKey: e.target.getAttribute('activity-id'),
                flowId: e.target.getAttribute('flow-id'),
        };
        state.dataShow; 
    }
    
})
//三个按钮选择
$('.data-tbody').addEventListener('click',(e) => {
    let target = e.target;
    let enrollId = target.parentNode.parentNode.getAttribute('enroll-id')
    switch(target.className){
        case 'x-btn': 
            openEdit($('.show-applydata-main'));
            ajax({
                method:'get',
                url: url + 'applydata/' + enrollId,
                data: {
                    token: sessionStorage.token,
                },
                success: function(res) {
                    let inner  = `<h3>申请信息详情</h3>
                <p>${res.data.act_name}</p>
                <p>姓&emsp;&emsp;名：${res.data.full_name}</p>
                <p>学&emsp;&emsp;号：${res.data.stu_code}</p>
                <p>联系方式：${res.data.contact}</p>
                <p>性&emsp;&emsp;别：${res.data.gender}</p>
                <p>年&emsp;&emsp;级：${res.data.grade}</p>
                <p>分&emsp;&emsp;数：${res.data.score === null ? '还没分数' : res.data.score}</p>
                <p>评&emsp;&emsp;价：${res.data.evaluation === null ? '还没评价' : res.data.evaluation}</p>
                <p>发送短信：${res.data.was_send_sms == 0 ? '没发送' : '已发送'}</p>`
                $('.show-applydata-main-mess').innerHTML = inner;
                    console.log(res)
                }
            })
            break;
        case 'r-btn': 
            openEdit($('.add-applydata-main'));
            $('#confirm-add-applydata').setAttribute('enroll-id',enrollId);
            break;
        case 'b-btn': 
            ajax({
                method: 'delete',
                url: url + 'applydata/'+ enrollId,
                data: {
                    token: sessionStorage.token,
                },
                success: function(res) {
                    alert('移除成功');
                    state.dataShow;
                },
                error: function(res) {
                    console.log(res)
                }
            })
        
            break;
    }
})

//分数修改
let dataScore = [];
function pushScore(score) {
    dataScore.push(score);
    let act = state.args.dataShow.actKey;
    let flow = state.args.dataShow.flowId;
    console.log(flow,act)
}

//全选
let checkInfo = false;
$('#all').addEventListener('click',() => {
        Array.prototype.slice.call($('.data-table input')).forEach(function(element) {
            element.checked = !checkInfo;
        });
        checkInfo = !checkInfo;
})

//新增学生窗口
$('.icon-add-stu').addEventListener('click',() => {
    openEdit($('.add-user-main'));
})

//新增学生
$('#confirm-add-user').addEventListener('click',() => {
    ajax({
        method: 'post',
        url : url+'applydata?token=' +  sessionStorage.token,
        data: {
            act_key: state.args.dataShow.actKey,
            flow_id:  state.args.dataShow.flowId,
            college: $('.user-college').value,
            stu_code: $('.user-code').value,
            full_name: $('.user-name').value,
            contact: $('.user-num').value
        },
        success: function(res) {
            alert(res.message)
            state.dataShow;
        },
        error: function(res) {
            alert(res.message)
        }
    })
})

//修改学生信息
$('#confirm-add-applydata').addEventListener('click',()=> {
    ajax({
        method: 'put',
        url: url + 'applydata/' + $('#confirm-add-applydata').getAttribute('enroll-id') + '?token=' + sessionStorage.token,
        data: {
             act_key: state.args.dataShow.actKey,
             flow_id:  state.args.dataShow.flowId,
             college: $('.applydata-college').value,
             score: $('.applydata-score').value,
             evaluation: $('.applydata-eval').value,
             contact: $('.applydata-num').value
        },
        success: function(res) {
            console.log(res)
            alart(res.message)
        }
    })
})
//升级到下一个流程
$('.up').addEventListener('click',() => {
    let checked = [].slice.call($('.check input'))
    .map((ele,index) => {
        if(ele.checked === true && ele.getAttribute('id') !== 'all') {
            //console.log(ele)
            return ele.parentNode.parentNode.getAttribute('enroll-id');
        }
    })
    ajax({
        method: 'post',
        url: url + 'applydata/operation?token=' + sessionStorage.token,
        data: {
            enroll_id: checked.join(','),
            flow_id: state.args.dataShow.flowId,
            action: 'up'
        },
        success: function(res) {
            alert(res.message)
            console.log(res)
        },
        error: function(res) {
            alert(res.message)
            //console.log(res)
        }
    })
})
//发送短信 
$('.send').addEventListener('click',() => {
     let checked = [].slice.call($('.check input'))
    .map((ele,index) => {
        if(ele.checked === true && ele.getAttribute('id') !== 'all') {
            //console.log(ele)
            return ele.parentNode.parentNode.getAttribute('enroll-id');
        }
    })
    ajax({
        method: 'post',
        url: url + 'applydata/sendsms?token=' + sessionStorage.token,
        data: {
            enroll_id: checked.join(','),
            flow_id: state.args.dataShow.flowId
        },
        success: function(res) {
            alert(res.message)
            console.log(res)
        },
        error: function(res) {
            alert(res.message)
            //console.log(res)
        }
    })
})



//短信模板
//显示短信模板
$('.message').addEventListener('click',() => {
    if(lastcontentGroupClick !== $('.mess')) {
        $('.mess').style.display = 'block';
        lastcontentGroupClick.style.display = 'none';
        lastcontentGroupClick = $('.mess');
    }
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
                return(`<tr admin-temp-id=${item.temp_id}>
                        <td>${item.temp_name}</td>
                        <td>${item.was_test === 0 ? '未测试' : '已测试'}</td>
                        <td><button class="x-btn">修改</button></td>
                        <td><button class="r-btn">详情</button></td>
                        <td class="test"><button class="b-btn">测试</button></td>
                    </tr>`)
            })
            $('.mess-tbody').innerHTML = tr.join('');
        }
    })
})
//创建新模板
$('.create').addEventListener('click',() => {
    if(lastcontentGroupClick !== $('.template')) {
        $('.template').style.display = 'block';
        lastcontentGroupClick.style.display = 'none';
        lastcontentGroupClick = $('.template');
        ajax({
            method: 'get',
            url: url + 'sms/templet',
            data: {
                token: sessionStorage.token
            },
            success: function(res) {
                const p = res.data.map((item,index) => {
                    return `<p>序号：${item.admin_temp_id} 模板内容：${item.sms_temp}</p>`
                })
                $('.templet-model').innerHTML = p;
            }
        })
    }
})
//测试 修改 删除 短信模板
$('.mess-tbody').addEventListener('click',(e) => {
    if(e.target.classList.contains('b-btn')) {
        openEdit($('.test-main'));
        $('#start-test').setAttribute('admin-temp-id',e.target.parentNode.parentNode.getAttribute('admin-temp-id'));
    }else if(e.target.classList.contains('x-btn')) {
        openEdit($('.add-mess-main'));
        $('#add-mess-finish').setAttribute('change-type','change');
        $('#add-mess-finish').setAttribute('admin-temp-id',e.target.parentNode.parentNode.getAttribute('admin-temp-id'));
    } else if (e.target.classList.contains('r-btn')) {
        ajax({
            method: 'get',
            url: url + 'sms/'+ e.target.parentNode.parentNode.getAttribute('admin-temp-id'),
            data: {
                token: sessionStorage.token
            },
            success: function(res) {
                console.log(res.data.variables)
                let inner = `<h3>短信模板详情</h3>
                <p>短信模板：${res.data.content}</p>
                <p>name:默认所有报名的同学各自的姓名</p>
                <p>content：${res.data.variables.content}</p>
                <p>next：${res.data.variables.next}</p>`
                $('.show-mess-main-mess').innerHTML = inner;
                openEdit($('.show-mess-main'));
            }
        })
    }
    
})
$('#start-test').addEventListener('click',() => {
    ajax({
        method: 'POST',
        url: url + 'sms/test?token='+ sessionStorage.token,
        data: {
            rec_num: $('.test-phone').value,
  	        temp_id: parseInt($('#start-test').getAttribute('admin-temp-id'))
        },
        success: function(res) {
            alert(res.message)
        }
    })
})
//添加变量 
$('.add-var').addEventListener('click',() => {
    openEdit($('.add-mess-main'));
    let p = document.createElement('p');
    // $('.add-mess-p').style.display = 'block';
    $('#add-mess-finish').setAttribute('change-type','add');

})
//点击短信模板增加or修改的完成按钮
$('#add-mess-finish').addEventListener('click',() => {

    if($('#add-mess-finish').getAttribute('change-type') === 'change') {
        ajax({
            method: 'put',
            url: url + 'sms/'+ $('#add-mess-finish').getAttribute('admin-temp-id') + '?token=' + sessionStorage.token,
            data: {
                admin_temp_id:  1,
                temp_name: $('.add-mess-title').value,
                'variables[name]': '${full_name}',
                'variables[content]': $('.add-mess-content').value,
                'variables[next]': $('.add-mess-date').value
            },
            success: function(res) {
                alert('修改成功')
            },
            error: function(res) {
                alert(res.message)
                console.log(res)
            }
        })
    } else if($('#add-mess-finish').getAttribute('change-type') === 'add') {
        ajax({
            method: 'post',
            url: url + 'sms/?token=' + sessionStorage.token,
            type: 'form',
            data: {
                admin_temp_id: 1,
                temp_name: $('.add-mess-title').value,
                'variables[name]': '${full_name}',
                'variables[content]': $('.add-mess-content').value,
                'variables[next]': $('.add-mess-date').value
            },
            success: function(res) {
                alert('添加成功');
            },
            error: function(res) {
                alert(res.message)
                console.log(res)
            }
        })
    }

})