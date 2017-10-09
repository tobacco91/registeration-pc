//数据管理
//渲染nav
$('.nav').addEventListener('click',()=>{
    let ul = '';
    ajax({
        method: 'get',
        url: url + 'act/flow',
        data: {
            token: sessionStorage.token
        },
        success: function(res) {
        console.log(res)
            res.data.map((ele,index) => {
                ul += `<li><a href="#">${ele.activity_name}</a><ul>`;
                ele.flowlist.map((item,index) => {
                    console.log()
                    ul +=`<li><a href="#" class="data-choose" activity-id=${ele.activity_id} flow-id=${item.flow_id} li-title="${ele.activity_name}-${item.flow_name}">${item.flow_name}</a></li>`
                })
                ul += `</ul></li>`;
            })
            $('.nav-data-second').innerHTML = ul;
        }
    })
})


//数据管理名单渲染  
//点击nav   
$('.nav-data-second').addEventListener('click',(e) => {
    if(e.target.classList.contains('data-choose')) {
        $('.order').innerText = e.target.getAttribute('li-title');
        state.args.dataShow = {
                actKey: e.target.getAttribute('activity-id'),
                flowId: e.target.getAttribute('flow-id'),
                pageNum: 1
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
    console.log(dataScore)
}

//修改分数提交
$('.sure').addEventListener('click',()=>{
    let act = state.args.dataShow.actKey;
    let flow = state.args.dataShow.flowId;
    ajax({
        method: 'post',
        url: url + 'applydata/score?token=' + sessionStorage.token,
        data: {
            activity_key: act,
            flow_id: flow,
            scoreData: JSON.stringify(dataScore)
        },
        success: function(res) {
            alert(res.message)
        },
        error: function(res) {
            console.log(res)
        }
    })
})


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
            //console.log(res)
            alert(res.message)
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
     let checked = [];
     [].slice.call($('.check input'))
    .map((ele,index) => {
        if(ele.checked === true && ele.getAttribute('id') !== 'all') {
            //console.log(ele)
            checked.push(ele.parentNode.parentNode.getAttribute('enroll-id'));
        }
    })
    //console.log(checked)
    ajax({
        method: 'post',
        url: url + 'applydata/sendsms?token=' + sessionStorage.token,
        data: {
            enroll_id: checked + '',
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
//excel导入
let file = $('.import_form').children[0],
    check_upload = false;
$('.import').addEventListener('click',() => {
    openEdit($('.prompt-main'))
    setTimeout(()=> {
        file.click();
    },500)
    
})
file.addEventListener('change',() => {
    chooseFile();
    uploadFile();
})

function chooseFile() {
    let test_last = /\.xls$|xlsx$/i,
        fileValue = file.value;
    if(test_last.test(fileValue)) {
        check_upload = true;
    }else {
        window.alert('只能是excel文件');
        return;
    }
}

function uploadFile() {
    if(!check_upload) return;
    let formData = new FormData();
    formData.append('excel',file.files[0]);
    formData.append('flow_id',state.args.dataShow.flowId);
    ajax({
        method: 'post',
        url: url + 'applydata/excel?token=' + sessionStorage.token,
        type: 'file',
        data: formData,
        success: function(res) {
            alert(res.message);
            state.dataShow;
        },
        error: function(res) {
            console.log(res)
        }
    })
}

//导出excel
$('.export').addEventListener('click',()=>{
    window.location.href = `${url}applydata/excel?token=${sessionStorage.token}&act_key=${state.args.dataShow.actKey}&flow_id=${state.args.dataShow.flowId}&sortby=grade&sort=asc`;
})
//分页
$('.page').addEventListener('click',(e) => {
    if(e.target.classList.contains('page-num')) {
        state.args.dataShow.pageNum = e.target.innerText;
        state.dataShow;
    }
})
//短信发送历史
$('.his').addEventListener('click',()=>{
    openEdit($('.show-mess-his-main'));
    state.args.hisShow = {pageNum: 1};
    state.hisShow;
})
$('.show-mess-his-page').addEventListener('click',(e) => {
    if(e.target.classList.contains('page-his-num')) {
        state.args.hisShow.pageNum = e.target.innerText;
        state.hisShow;
    }
})