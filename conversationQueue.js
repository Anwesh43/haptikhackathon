var height = 0,weight = 0;
module.exports = function(apiParams){
  return {messages:[{
     message:'What is your weight in Kg?',
     end:false,
     end_point_callback:function(text,bot,message) {
        weight = parseInt(text)
        console.log(text)
     }},{
     message:'What is your height in cm?',
     end:false,
     end_point_callback:function(text,bot,message) {
        height = parseInt(text)/100
        if(height!=0 && weight!=0) {
            bmi = weight/(height*height)
            apiParams.BMI = bmi
            bot.reply(message,`your BMI is ${bmi}`)
        }
        console.log(text)
     }},{
     message:'What is your Insulin level?',
     end:false,
     end_point_callback:function(text,bot,message) {
        apiParams.Insulin = parseInt(text)
        console.log(text)
     }},
     {
     message:'What is your Glucose level?',
     end:false,
     end_point_callback:function(text,bot,message) {
        apiParams.Glucose = parseInt(text)
        console.log(text)
     }},
     {
     message:'What is your BloodPressure?',
     end:false,
     end_point_callback:function(text,bot,message) {
        apiParams.BloodPressure = parseFloat(text)
        console.log(text)
        bot.reply(message,'Thanks for your response')
     }},
     {
     message:'What is your Skin Thickness?',
     end:false,
     end_point_callback:function(text,bot,message) {
        apiParams.SkinThickness = parseFloat(text)
        console.log(text)
        bot.reply(message,'Thanks for your response')
     }},
      {
     message:'What is your Age?',
     end:true,
     end_point_callback:function(text,bot,message) {
        apiParams.Age = parseInt(text)
        console.log(text)
        bot.reply(message,'Thanks for your response')
     }}

  ]}
}
