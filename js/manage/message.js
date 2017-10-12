//短信模板
//显示短信模板
$('.message').addEventListener('click',() => {
    history.pushState({url: 'mess'},'',pageUrl + 'mess')
    if(lastcontentGroupClick !== $('.mess')) {
        $('.mess').style.display = 'block';
        lastcontentGroupClick.style.display = 'none';
        lastcontentGroupClick = $('.mess');
    }
    state.messShow;

})
//创建新模板
$('.create').addEventListener('click',() => {
    history.pushState({url: 'messCreate'},'',pageUrl + 'messCreate')
    if(lastcontentGroupClick !== $('.template')) {
        $('.template').style.display = 'block';
        lastcontentGroupClick.style.display = 'none';
        lastcontentGroupClick = $('.template');
    }
})

//创建原始模板下拉框
ajax({
    method: 'get',
    url: url + 'sms/templet',
    data: {
        token: sessionStorage.token
    },
    success: function(res) {
        let tempList = {};
        res.data.map(item => {
            tempList[item.admin_temp_id] = item;
        })
        sessionStorage.tempList = JSON.stringify(tempList);
        let p = `<option selected="selected" disabled="disabled"  style='display: none' value=''>请选择原始模板</option> `;
        res.data.map((item,index) => {
            p += `<option value=${item.admin_temp_id}>${item.sms_temp}</option>`
        })
        $('.add-mess-temp').innerHTML = p;
    }
})
//监听原始模板变化
$('.add-mess-temp').addEventListener('change',(e) => {
    state.tempList = JSON.parse(sessionStorage.tempList)[$('.add-mess-temp').value]
    //console.log(JSON.parse(sessionStorage.tempList)[$('.add-mess-temp').value]);
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
                //console.log(res.data.variables)
                let variables = '';
                let inner = `<h3>短信模板详情</h3>
                <p>短信模板：${res.data.content}</p>`
                for(let i in res.data.variables) {
                    variables += `<p>${i}：${res.data.variables[i]}</p>`
                }
                $('.show-mess-main-mess').innerHTML = inner + variables;
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
            state.messShow;
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
    let data = {
        admin_temp_id: $('.add-mess-temp').value,
        temp_name: $('.add-mess-title').value
    };
    let alertInfo = false;
    state.args.tempList.forEach(function(element,index) {
        data['variables['+ element + ']'] = $('.temp-list-var').children[index].children[0].value;
        console.log($('.temp-list-var').children[index].children[0].value.length);
        if($('.temp-list-var').children[index].children[0].value.length > 15 && !alertInfo) {
            alert('短信模板的变量赋值的时候不允许超过15个字符');
            alertInfo = true;
        }
    }, this);
    if(alertInfo) {
        return;
    }
    if($('#add-mess-finish').getAttribute('change-type') === 'change') {
        ajax({
            method: 'put',
            url: url + 'sms/'+ $('#add-mess-finish').getAttribute('admin-temp-id') + '?token=' + sessionStorage.token,
            data: data,
            success: function(res) {
                state.messShow;
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
            data: data,
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

