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
        ajax({
            method: 'get',
            url: url + 'sms/templet',
            data: {
                token: sessionStorage.token
            },
            success: function(res) {
                //console.log(res)
                let p = `<option selected="selected" disabled="disabled"  style='display: none' value=''>请选择原始模板</option> `;
                res.data.map((item,index) => {
                    p += `<option value=${item.admin_temp_id}>${item.sms_temp}</option>`
                })
                $('.add-mess-temp').innerHTML = p;
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

    if($('#add-mess-finish').getAttribute('change-type') === 'change') {
        ajax({
            method: 'put',
            url: url + 'sms/'+ $('#add-mess-finish').getAttribute('admin-temp-id') + '?token=' + sessionStorage.token,
            data: {
                admin_temp_id: $('.add-mess-order').value,
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
                admin_temp_id: $('.add-mess-temp').value,
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