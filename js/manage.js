var url = 'http://hongyan.cqupt.edu.cn/activity/api/',
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
            success(JSON.parse(xhr.responseText));
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
            $('.acti-details').children[2].innerHTML = res.data.time_description;
            $('.acti-details').children[3].innerHTML = res.data.summary;
            $('.acti-details-interview').innerHTML = '';
            console.log(res)
            res.data.flowList.map(function(e) {
                $('.acti-details-interview').innerHTML += `<div class="interview">
                    <div class="fir-inter">${e.flow_id}.第${e.flow_id}次测试(${e.location})</div>
                    <span class="s-btn acti-start" onclick="actiShow(${e.flow_id})">详情</span>
                    <span class="r-btn acti-modi" onclick="actiChange(${e.flow_id})">修改</span>
                    <span class="b-btn acti-dele" onclick="actiDelete(${e.flow_id})">删除</span>
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
function actiDelete(flow_id) {
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
//新增流程
$('.add-flow').addEventListener('click',() => {
    
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
                        <td>${item.was_test}</td>
                        <td><button class="r-btn">删除</button></td>
                        <td><button class="x-btn">修改</button></td>
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
        $('.add-mess-p').style.display = 'none';
        openEdit($('.add-mess-main'));
        $('#add-mess-finish').setAttribute('change-type','change');
        $('#add-mess-finish').setAttribute('admin-temp-id',e.target.parentNode.parentNode.getAttribute('admin-temp-id'));
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
            console.log(res)
        }
    })
})
//添加变量 
$('.add-var').addEventListener('click',() => {
    openEdit($('.add-mess-main'));
    let p = document.createElement('p');
    $('.add-mess-p').style.display = 'block';
    $('#add-mess-finish').setAttribute('change-type','add');

})


//点击短信模板增加or修改的完成按钮
$('#add-mess-finish').addEventListener('click',() => {

    if($('#add-mess-finish').getAttribute('change-type') === 'change') {
        ajax({
            method: 'put',
            url: url + 'sms/'+ $('#add-mess-finish').getAttribute('admin-temp-id') + '?token=' + sessionStorage.token,
            data: {
                admin_temp_id:  $('#add-mess-finish').getAttribute('admin-temp-id'),
                temp_name: $('.add-mess-title').value,
                'variables[name]': '${full_name}',
                'variables[content]': 'lala',
                'variables[next]': '13232131'
    
            },
            success: function(res) {
                console.log(res)
            },
            error: function(res) {
                console.log(res)
            }
        })
    } else if($('#add-mess-finish').getAttribute('change-type') === 'add') {
        ajax({
            method: 'post',
            url: url + 'sms?token=' + sessionStorage.token,
            type: 'form',
            data: {
                admin_temp_id:  1,
                temp_name: $('.add-mess-title').value,
                'variables[name]': '${full_name}',
                'variables[content]': 'lala',
                'variables[next]': '13232131'
            },
            success: function(res) {
                console.log(res)
            },
            error: function(res) {
                console.log(res)
            }
        })
    }

})




//数据管理
function dataNav() {
    // let promise = new Promise((resolve,reject) => {
    //     ajax({
    //         method: 'get',
    //         url: url + 'act',
    //         data: {
    //             token: sessionStorage.token,
    //             page: 1,
    //             per_page: 100,
    //             sortby: "start_time",
    //             sort: "asc"
    //         },
    //         success: function(res) {
    //             var s = res.data.data;
    //             var inner = '';
    //             if (res.data.data[0]) {
    //                 resolve(res.data.data)
    //             }
    //         },
    //         error: function(err) {
    //             if (err.status == 400) {
    //                 alert('请求错误，请重新登录');
    //                 //请求错误，请重新登录
    //                 //window.location.replace('./login.html');
    //             }
    //         }
    //     })
    // }).then((value) => {
    //     let inner = '';
    //     let ul = '';
    //     value.map((item,index) => { 
    //         let li = document.createElement('li');
    //         ajax({
    //             method: 'get',
    //             async: true,
    //             url: url + 'act/' + item.activity_id,
    //             data: {
    //                 token: sessionStorage.token
    //             },
    //             success: function(res) {
    //                 ul = '';
    //                 inner = `<a href="#">${item.activity_name}</a><ul>`;
    //                 res.data.flowList.map((ele,index) => {
    //                     ul += `<li><a href="#" flow-id=${ele.flow_id}>${ele.flow_name}</a>`
    //                 })
    //                 li.innerHTML = inner + ul + '</ul></li>';
    //                 $('.nav-data-second').appendChild(li)
    //             }
    //         })
    //     })
    // })
    let ul = '';
    ajax({
        method: 'get',
        url: url + 'act/flow',
        data: {
            token: sessionStorage.token
        },
        success: function(res) {
            res.data.map((ele,index) => {
                ul += `<li><a href="#">${ele.activity_name}</a><ul>`;
                ele.flowlist.map((item,index) => {
                    ul +=`<li><a href="#" class="data-choose" activity-id=${ele.activity_id} flow-id=${item.flow_id}>${item.flow_name}</a></li>`
                })
                ul += `</ul></li>`;
            })
            $('.nav-data-second').innerHTML = ul;
        }
    })

}
dataNav()



//数据管理名单渲染          
$('.nav-data-second').addEventListener('click',(e) => {
    if(e.target.classList.contains('data-choose')) {

        ajax({
            method: 'get',
            url: url + 'applydata',
            data: {
                token: sessionStorage.token,
                act_key: e.target.getAttribute('activity-id'),
                flow_id: e.target.getAttribute('flow-id'),
                sortby: 'score',
                sort: 'asc',
                page: 1,
                per_page: 20
            },
            success: function(res) {
                if(lastcontentGroupClick !== $('.data')) {
                    $('.data').style.display = 'block';
                    lastcontentGroupClick.style.display = 'none';
                    lastcontentGroupClick = $('.data');
                }
                let tr = '';
                console.log(res.date.data)
                res.date.data.map((ele,index) => {
                    tr += `<tr enroll-id=${ele.enroll_id}>
                        <td class="check"><input type="checkbox"></td>
                        <td class="name">${ele.full_name}</td>
                        <td class="department">产品</td>
                        <td class="status">已报名</td>
                        <td class="phone">${ele.contact}</td>
                        <td class="mod mod-btn"><button class="r-btn">修改</button></td>
                        <td class="finish fin-btn"><button class="b-btn">移动</button></td>
                    </tr>`
                })
                $('.data-tbody').innerHTML = tr;
            }

        })
    }
    
})