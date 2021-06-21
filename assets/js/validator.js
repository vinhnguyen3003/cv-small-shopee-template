

var selectorRules = {};

function Validator(options){

	function validate(inputElement, rule){
		//var errorMessage = rule.test(inputElement.value);
		var formMessage = inputElement.parentElement.querySelector(options.errorSelector);
		var errorMessage;

		var rules = selectorRules[rule.selector];

		for(var i = 0; i< rules.length; i++){
			errorMessage= rules[i](inputElement.value);
			if(errorMessage) break;
		}

		if(errorMessage){
			formMessage.innerText = errorMessage;
			inputElement.parentElement.classList.add("invalid");
		}else{
			formMessage.innerText = "";
			inputElement.parentElement.classList.remove("invalid");
		}	
	}

	var formElement = document.querySelector( options.form );

	if(formElement){
		options.rules.forEach( function(rule){

			if(Array.isArray(selectorRules[rule.selector])){
				selectorRules[rule.selector].push(rule.test);
			}else{
				selectorRules[rule.selector]=[rule.test];
			}
			
			var inputElement = formElement.querySelector(rule.selector);
			var formMessage = inputElement.parentElement.querySelector(options.errorSelector);
			
			if(inputElement){

				inputElement.onblur = function(){
					validate(inputElement, rule);
				}

				inputElement.oninput = function(){
					var errorMessage = rule.test(inputElement.value);
					formMessage.innerText = "";
					inputElement.parentElement.classList.remove("invalid");
				}
			}
		})
	}
}
Validator.isRequired = function(selector){
	return {
		selector:selector,
		test: function (value){
			return value.trim() ? undefined : "Vui lòng nhập trường này";
		}
	}
}
Validator.isEmail = function(selector){
	return {
		selector:selector,
		test: function (value){
			var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
			return regex.test(value) ? undefined : "Trường này phải là Email";
		}
	}
}
Validator.isPassword = function(selector, min){
	return {
		selector:selector,
		test: function (value){
			return value.length >= min ? undefined : `Mật khẩu phải có ít nhất ${min} kí tự`;
		}
	}
}	

Validator.isConfirm = function(selector, valueToConfirm, confirmMessage){
	return {
		selector:selector,
		test: function (value){
			return valueToConfirm() === value ? undefined : confirmMessage || "Giá trị nhập vào không chính xác";
		}
	}
}		