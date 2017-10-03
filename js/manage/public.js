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