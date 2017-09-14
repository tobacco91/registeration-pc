var url = 'http://hongyan.cqupt.edu.cn/activity/api/',
    lastcontentGroupClick = $('.acti');
    console.log(lastcontentGroupClick)
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
    var type = conf.type;
    var data = conf.data;
    var xhr = new XMLHttpRequest();
    var successInfo = new RegExp("2[0-9]{2}");
    var errorInfo = new RegExp("4|5[0-9]{2}");
    if(method.toLowerCase() !== 'post') {
        var urlData = '';
        for(var key in data) {
            urlData += key + '=' + data[key] + '&';
        }
        url = url + '?' + urlData.substring(0,urlData.length-1);
        console.log(url)
    }
    xhr.open(method, url, true);
    if (method.toLowerCase() === 'get') {
        xhr.send(null);
    } else if (method.toLowerCase() === 'post') {
        if (type.toLowerCase() === 'json') {
            xhr.setRequestHeader('content-type', 'application/json');
            xhr.send(JSON.stringify(data));
        } else if (type.toLowerCase() === 'form') {
            xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
            xhr.send(data);
        }
    } else if (method.toLowerCase() === 'put') {
        xhr.send(null);
    } else if(method.toLowerCase() === 'delete') {
        xhr.send(null);
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && successInfo.test(xhr.status)) {
            success(JSON.parse(xhr.responseText));
        } else if (errorInfo.test(xhr.status)) {
            if(error !== undefined) {
                error(xhr.responseText);
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
// ajax({
//     method: 'put',
//     url: url + 'act/1000',
//     data: {
//         token: sessionStorage.token
//     },
//     success: function(res) {
//         console.log(res)
//     }
// })
//显示活动
$('.acti-manage').addEventListener('click',function() {
    if(lastcontentGroupClick !== $('.acti')) {
        lastcontentGroupClick.style.display = 'none';
        $('.acti').style.display = 'block';
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
                    <span class="b-btn acti-dele">删除</span>
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
    ajax({
        method: 'get',
        async: true,
        url: url + 'act/' + act_key,
        data: {
            token: sessionStorage.token
        },
        success: function(res) {
            $('.acti-details').children[0].innerHTML = res.data.activity_name;
            $('.acti-details').children[1].innerHTML = `已有${res.data.current_num}人报名`;
            $('.acti-details-interview').innerHTML = '';
            res.data.flowList.map(function(e) {
                console.log(e)
                $('.acti-details-interview').innerHTML += `<div class="interview">
                    <div class="fir-inter">${e.flow_id}.第${e.flow_id}次面试(${e.location})</div>
                    <span class="s-btn acti-start" onclick="actiStart(${e.activity_key})">详情</span>
                    <span class="r-btn acti-modi" onclick="actiChange(${e.activity_key})">修改</span>
                    <span class="b-btn acti-dele" onclick="actiDelete(${e.activity_key})">删除</span>
                </div>`;
            })
            lastcontentGroupClick.style.display = 'none';
            $('.acti-details').style.display = 'block';
            lastcontentGroupClick = $('.acti-details');
        }
    }) 
}
//活动开始修改删除
$('.acti-main').addEventListener('click',function(e){
    var act_key = e.target.parentNode.getAttribute('activity_id');
    console.log(act_key)
    switch (e.target.className){ 
        case 's-btn acti-start': 
            ajax({
                method: 'put',
                url: url + 'act/' + act_key + '/start',
                data: {
                    token: sessionStorage.token
                },
                success: function(res) { 
                    alert(res.message);
                }
            })
            break; 
        case 'r-btn acti-modi': 
            $('.edit').style.display = 'block';
            $('.add-acti-main').style.display = 'block';
            $('#confirm-add-acti').setAttribute('act-key',act_key);
            break; 
        case 'b-btn acti-dele':
            break;
    
    } 
})

//添加修改活动
$('#confirm-add-acti').addEventListener('click',function() {
    console.log( $('.acti-summary').innerText, $('.acti-summary').value)
    ajax({
        method: 'put',
        url: url + 'act/' + $('#confirm-add-acti').getAttribute('act-key'),
        data: {
            token: sessionStorage.token,
            activity_name: $('.acti-name').value,
            summary: $('.acti-summary').value,
            max_num: $('.max-num').value, //人数限制，若修改的值低于已报名的人数会返回错误
            location:$('.acti-location').value,
            start_time: $('.acti-st').value,
            end_time: $('.acti-et').value,
            time_description: $('.time-des').value //以上数据可单个发送请求
        },
        success: function(res) {
            console.log(res)
        }

    })
})
