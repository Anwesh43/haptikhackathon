var height = 0,weight = 0;
var request = require('request')
var buttonUtil = require('./create_buttons_util')
var localApiNames = require('./localApiName')
var imageAdress = 'http://anwesh43.github.io/hackathonImages/'
module.exports = function(apiParams,controller){
  function sendList(list,bot,message) {
      
      list.forEach((tip)=>{
        bot.reply(message,tip)
      })
  }
  return {messages:[{
     message:"What is your weight in Kg?",
     ask:true,
     end:false,
     end_point_callback:function(text,bot,message) {
        weight = parseInt(text)
     }},{
     message:"What is your height in cm?",
     ask:true,
     end:false,
     end_point_callback:function(text,bot,message) {
        height = parseInt(text)/100
        if(height!=0 && weight!=0) {
            bmi = weight/(height*height)
            bmi = Math.round(bmi)
            apiParams.BMI = bmi
            bot.reply(message,`your BMI is ${bmi}`)
        }
     }},{
     message:"What is your Insulin level?Please enter  a number or enter Skip if you don't know",
     ask:true,
     end:false,
     end_point_callback:function(text,bot,message) {
        if(text != "Skip") {
            apiParams.Insulin = parseInt(text)
        }
     }},
     {
     message:"What is your Glucose level?Please enter a number or enter Skip if you don't know",
     ask:true,
     end:false,
     end_point_callback:function(text,bot,message) {
        if(text != "Skip") {
            apiParams.Glucose = parseInt(text)
        }
     }},
     {
     message:"What is your BloodPressure?Please enter number or enter Skip if you don't know",
     ask:true,
     end:false,
     end_point_callback:function(text,bot,message) {
        if(text != "Skip") {
            apiParams.BloodPressure = parseFloat(text)
        }

     }},
     {
     message:"What is your Skin Thickness?Please enter number or enter Skip if you don't know",
     ask:true,
     end:false,
     end_point_callback:function(text,bot,message) {
        if(text != "Skip") {
            apiParams.SkinThickness = parseFloat(text)
            console.log(text)
        }

     }},
      {
     message:'What is your Age?',
     ask:true,
     end:true,
     end_point_callback:function(text,bot,message) {
        apiParams.Age = parseInt(text)
        request(localApiNames.trainEndPoint,(err,response,body)=>{
            if(err == null) {
                console.log(body)
                var algo = body["Algo"]
                if(algo == undefined) {
                    algo = "QDA"
                }
                request(localApiNames.testEndPoint+"?Algo="+algo+"&vals="+'['+[apiParams.Pregnancies,apiParams.Glucose,apiParams.BloodPressure,apiParams.SkinThickness,apiParams.Insulin,apiParams.BMI,apiParams.DiabetesPedigreeFunction,apiParams.Age]+']',function(err,res,body){
                    if(err == null) {
                        body = JSON.parse(body)
                        var prediction = body["Prediction"]
                        var msg = "Cheers you are not diabetic :D :D"
                        console.log(prediction)
                        console.log(typeof(prediction))
                        if(prediction == "1.0") {
                           msg = "Unfortunately you are diabetic :( but don't worry as we will give you some excellent health tips"
                           bot.reply(message,msg)
                           var diabeticMap = {
                             'Diet Tips':function(bot,message){
                                  sendList(['Eat more green vegetables','Eat low calorie fruits','Take less oil in your diet','Try to avoid food rich in carbohydrates'],bot,message)
                               },
                             'Exercise Tips':function(bot,message) {
                                 sendList(['Do yoga','Do cycling','Do physical exercise'],bot,message)
                               },
                             'Habit Changing Tips': function(bot,message) {
                                 sendList(['Quit Smoking','Wake up early','Sleep early','Quit Alcohol'],bot,message)
                               }
                             }
                             buttonUtil.createButtonsFromJson(bot,message,controller,'What type of recommendation you need?',diabeticMap)
                        }
                        else {
                          bot.reply(message,msg)
                        }
                    }
                    else {
                        bot.reply(message,"I couldn't determine whether you are diabetic or not")
                    }
                })
            }

        })
     }}

  ]}
}
