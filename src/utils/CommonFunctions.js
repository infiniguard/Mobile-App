export function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

export function getAge(DOB) {
    var today = new Date();
    var birthDate = new Date(DOB);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export function getAdjustedFontSize(size,deviceHeight){
  if(deviceHeight===568) {size= size }
   else if(deviceHeight===667) {size= size*1.17 }
   else if(deviceHeight===736) {size= size*1.29 }
   else if(deviceHeight===1024){size= size*1.8 }
  return size ;
}


export function alertMessage(alertMessage) {
    Alert.alert(
        'INFINIGUARD®',
        alertMessage, [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
        ], { cancelable: false }
    )
}
