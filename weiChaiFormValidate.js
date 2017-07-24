/**
 * Created by 38794 on 2017/7/21.
 */
(function ($) {

    var defaultData = {
        extraRules: function (data,$formField,ruleName,ruleObj) {    //额外的验证规则
            return true;
        },
        formFieldErrorShow: function ($formField,message) {
            var $formGroup = $formField.parent(".form-group");
            var $helpBlock = $formGroup.find('.help-block');
            $helpBlock.html(message);
            $formGroup.addClass('has-error');
            $helpBlock.show();
        },     //表单域错误显示
        formFieldErrorHide: function ($formField) {
            var $formGroup = $formField.parent(".form-group");
            var $helpBlock = $formGroup.find('.help-block');
            $formGroup.removeClass('has-error');
            $helpBlock.hide();
        },     //表单域错误隐藏
        reset: function (data) {     //重置整个表单
            $.each(data.validate, function (i, n) {
                var $formField = data.$form.find('[name="' + i + '"]');
                data.formFieldErrorHide($formField);
            });
        },
        resetField: function (data, options) {    //重置指定表单域
            switch (typeof options) {
                case 'object':                   //对象 多个表单域
                    if (options instanceof Array) {
                        $.each(options, function (i, n) {
                            var $formField = data.$form.find('[name="' + n + '"]');
                            data.formFieldErrorHide($formField);
                        });
                    }
                    break;
                case 'string':                     //有i个表单域
                    var $formField = data.$form.find('[name="' + options + '"]');
                    data.formFieldErrorHide($formField);
                    break;
                default:
            }
        },
        validateField: function (data, options) {       //验证一个表单域
            var validateFlag = false;
            switch (typeof options){
                case 'string':
                    var $formField = data.$form.find('[name="' + options + '"]');
                    var formFieldValue = $formField.val();
                    $.each(data.validate[options],function (i,n) {
                        switch (i){
                            case 'unRequired':
                                if(formFieldValue===''){
                                    data.formFieldErrorHide($formField);
                                    validateFlag=true;
                                }
                                break;
                            default:

                        }
                    });
                    if(validateFlag===true){
                        return validateFlag;
                    }
                    $.each(data.validate[options], function (i, n) {
                        switch (i) {
                            case 'required':
                                if (formFieldValue === '') {
                                    data.formFieldErrorShow($formField,n.message);
                                    validateFlag=false;
                                    return false;
                                }
                                break;
                            case 'minLength':
                                if (formFieldValue.length < n.min) {
                                    data.formFieldErrorShow($formField,n.message);
                                    validateFlag=false;
                                    return false;
                                }
                                break;
                            case 'maxLength':
                                if (formFieldValue.length > n.max) {
                                    data.formFieldErrorShow($formField,n.message);
                                    validateFlag=false;
                                    return false;
                                }
                                break;
                            case 'rangeLength':
                                if (formFieldValue.length < n.length[0] || formFieldValue.length > n.length[1]) {
                                    data.formFieldErrorShow($formField,n.message);
                                    validateFlag=false;
                                    return false;
                                }
                                break;
                            case 'number':
                                if (isNaN(Number(formFieldValue))) {    //不是一个数字
                                    data.formFieldErrorShow($formField,n.message);
                                    validateFlag=false;
                                    return false;
                                }
                                break;
                            case 'regex':
                                if(!n.pattern.test(formFieldValue)){
                                    data.formFieldErrorShow($formField,n.message);
                                    validateFlag=false;
                                    return false;
                                }
                                break;
                            case 'mobilePhone':      //移动电话的验证
                                if(!/^1[34578]\d{9}$/.test(formFieldValue)){
                                    data.formFieldErrorShow($formField,n.message);
                                    validateFlag=false;
                                    return false;
                                }
                                break;
                            case 'email':      //邮箱的验证
                                if(!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(formFieldValue)){
                                    data.formFieldErrorShow($formField,n.message);
                                    validateFlag=false;
                                    return false;
                                }
                                break;
                            default:
                                break;
                        }
                        if(!data.extraRules(data,$formField,i,n)){   //没有通过额外验证
                            data.formFieldErrorShow($formField,n.message);
                            validateFlag=false;
                            return false;
                        }
                        data.formFieldErrorHide($formField);
                    });
                    return true;
                    break;
                default:
            }
        },
        validateFields:function (data,options) {     //手动验证多个字段   只有啊哦有一个字段没有验证通过即返回false
            var validateFlag = true;
            switch (typeof options){
                case 'object':
                    if(options instanceof Array){
                        $.each(options,function (i,n) {
                            if(!data.validateField(data,n)){
                                validateFlag = false;
                            }
                        })
                    }
                    break;
                case 'string':
                    data.validateField(data,options);
                    break;
                default:
            }
            return validateFlag;
        },
        validateFieldsAll:function (data) {
            var validateFlag = true;
            $.each(data.validate,function (i,n) {
                if(!data.validateField(data,i)){
                    validateFlag=false;
                }
            });
            return validateFlag;
        },
    };

    $.fn.weiChaiFormValidate = function (options, info) {
        switch (typeof options) {
            case 'object':
                options.$form = this;
                var data = $.extend({}, defaultData, options);
                init(data);
                break;
            case 'string':
                var data = this.data('validate');
                return weiChaiFormValidateFun(data, options, info);   //如果是字符串则转到方法处理函数
                break;
            default:

        }
    };
    /**
     * 初始化
     */
    var init = function (data) {
        var $form = data.$form;
        $form.data('validate', data);
        $.each(data.validate, function (i, n) {
            var $formField = $form.find('[name="' + i + '"]');
            if ($formField.length === 0) {
                //抛异常或者报错
                return false;  //没有找到指定的表单域 跳过这个
            }
            data.formFieldErrorHide($formField);
            $formField.blur(function () {
                data.validateField(data,i);
            });
        });
    };

    /**
     * 方法调度
     * @param data data
     * @param method  方法名称
     * @param options  参数
     */
    var weiChaiFormValidateFun = function (data, method, options) {
        switch (method) {
            case 'reset':
                return data.reset(data);
                break;
            case 'resetField':
                return data.resetField(data, options);
                break;
            case 'validateField':
                return data.validateField(data,options);
                break;
            case 'validateFields':
                return data.validateFields(data,options);
                break;
            case 'validateFieldsAll':
                return data.validateFieldsAll(data);
                break
            default:

        }
    }
})(jQuery);