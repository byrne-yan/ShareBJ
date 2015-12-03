moment.locale('zh-cn');

conceptionAge = function(conceptionDate,toThen){
    if(conceptionDate instanceof Date){
        var now;
        if(toThen && toThen instanceof Date)
            now= toThen
        else
            now = new Date();

        var timeSpan = now.getTime() - conceptionDate.getTime();
        if(timeSpan>=0)
        {
            var weeks = Math.floor(timeSpan/1000/60/60/24/7);
            var days = Math.ceil(timeSpan/1000/60/60/24) - weeks*7;
            return [weeks,days,weeks+'周' + (days?'+'+days:'')];
        }
        //孕前
        timeSpan = conceptionDate.getTime() - now.getTime();
        var weeks = Math.floor(timeSpan/1000/60/60/24/7);
        var days = Math.ceil(timeSpan/1000/60/60/24) - weeks*7;
        return [-weeks,-days,'孕前'+weeks+'周' + (days?'+'+days:'')];
    }
    return null;
};

ageOf = function(birthDate, toThen) {
    if(birthDate instanceof Date){
        var today;
        if(toThen && toThen instanceof Date)
            today= toThen
        else
            today = new Date();

        var age = today.getFullYear() - birthDate.getFullYear();
        var months = today.getMonth() - birthDate.getMonth();
        var days = today.getDate() - birthDate.getDate();
        if(days <0  )
        {
            months--;
            days += (new Date(today.getFullYear(),today.getMonth(),0)).getDate();
        }

        if(months <0 || (months ===0 && days < 0 )){
            age--;
            months += 12;
        }

        var ageText = '';
        if(age != 0)
        {
            ageText = age + '岁';
        }

        if(months != 0){
            ageText += months + '个月';
        }

        if(days != 0){
            ageText += days + '天';
        }

        if(ageText==='')
        {
            ageText = '出生';
        }else if(age===0 && months===1 && days===0)
        {
            ageText = '满月';
        } if(Math.ceil((today.getTime()-birthDate.getTime())/1000/60/60/24) === 100){
            ageText = '百天';
        }

        return [age,months,days, ageText];
    }
    return null;
};

