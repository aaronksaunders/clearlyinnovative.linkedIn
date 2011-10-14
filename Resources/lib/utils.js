(function() {
	st.utils = {};

	st.utils.validateField= function(value, fieldName) {
		value=value+"";
		var resultMsg="OK";
		value=this.trim(value);

		if(value.length==0 || value+""=="undefined") {
			if(fieldName=="First Name"){
			resultMsg=L('first_blank');	
			}
			else if(fieldName=="Last Name"){
			resultMsg=L('last_blank');
			}
			else if(fieldName=="Email"){
			resultMsg=L('email_blank');
			}
			else if(fieldName=="Password"){
			resultMsg=L('password_blank');
			}
			else if(fieldName=="Company Name"){
			resultMsg=L('company_blank');	
			}
			else if(fieldName=="Title"){
			resultMsg=L('title_blank');
			}
			//resultMsg=L('first_blank');
		} else if(value.length>100) {
			if(fieldName=="First Name"){
			resultMsg=L('too_long')+L('first_field_name')+L('should_be_less_than_20');	
			}
			else if(fieldName=="Last Name"){
			resultMsg=L('too_long')+L('last_field_name')+L('should_be_less_than_20');	
			}
			else if(fieldName=="Email"){
			resultMsg=L('too_long')+L('email_field_name')+L('should_be_less_than_20');	
			}
			else if(fieldName=="Password"){
			resultMsg=L('too_long')+L('password_field_name')+L('should_be_less_than_20');	
			}
			else if(fieldName=="Company Name"){
			resultMsg=L('too_long')+L('company_field_name')+L('should_be_less_than_20');	
			}
			else if(fieldName=="Title"){
			resultMsg=L('too_long')+L('title_field_name')+L('should_be_less_than_20');
			}
			
		} else if(fieldName=="Password" && value.length<6) {
			resultMsg=L('password_must_contain_6');
		} else if(fieldName=="Email") {
			if(this.emailValidator(value)!="OK") {
				resultMsg=L('invalid_email');
			}
		}

		return resultMsg;
	};
	st.utils.trim= function(s) {
		s=s+"";
		//left trim
		s=s.replace(/^\s+/,"");

		//right trim
		s=s.replace(/\s+$/,"");

		return s;

	};
	st.utils.emailValidator= function(email) {

		var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		if(reg.test(email) == false) {
			return "false";
		}

		return "OK";
	};
	st.utils.UDV= function(value) {
		value=value+"";
		if(value=="undefined") {
			value="";
		}

		return value;
	};
	
	st.utils.canRate=function(){
		var lastRatingTime = Titanium.App.Properties.getString("RATING_LAST_UPDATE");
		if (lastRatingTime == null || lastRatingTime == '') {
			return true;
		}
		var date = new Date(lastRatingTime*1000);
		diff = (((new Date()).getTime() - date.getTime()) / 1000);
		day_diff = Math.floor(diff / 86400); 
		if (day_diff > 0) {
			return true;
		} else if (day_diff == 0) {
				if (diff > 180) {
					return true;
				} else {
					return false;
				}
		}
					
	};
})();