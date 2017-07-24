# weiChaiFormValidate.js
可用于bootstrap或者相同表单结构的表单验证，我的第一份jquery插件

<form id='form'>
<div class='form-froup'>
<lable class='control-lable'>用户名</lable>
<input type='text' class='form-control' name='username'/>
<span class=''help-block'><span>
</div>
</form>

$('#form').weiChaiFormValidate({
    validate:{
      username:{
        required:{
          message:'用户名必填项'
        }
      }
    }
});


//目前暂时只支持的验证规则  
required  必填
unrequired  非必填 可以和其他验证使用  实现只有填写了才验证
minLength 最小长度
maxLength 最大长度
rangeLength 长度在这之间  参数数组
number  数字
regex  正则
mobilePhone  移动电话
email  电子邮箱



$('#form').weiChaiFormValidate(options)

options is object

extraryles:function(data,$formField,ruleName,ruleObj){    
  return true;
}
//用于扩展额外的规则验证
 //data  绑定在form上的数据即options  $formField 表单域的jquery对象  
 //ruleName 验证规则的名称   ruleObj验证规则的对象
 //return true;表示验证通过   false则验证失败

formFiledErrorShow  function    //可用于修改错误显示的逻辑
formFileldErrorHide  function   //可用于修改错误隐藏的逻辑

reset  function   //重置有规则验证的表单错误信息
resetField  function   //重置指定的表单域验证错误

validateField  function  //验证一个表单域
validateFields  function  //验证多个表单域
validateAll   function   //验证整个表单域   多用于提交前验证


可使用方法   $('#form').weiChaiFormValidate('reset')


